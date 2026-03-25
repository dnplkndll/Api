import { injectable } from "inversify";
import { sql } from "kysely";
import { UniqueIdHelper, DateHelper, ArrayHelper } from "@churchapps/apihelper";
import { DateHelper as LocalDateHelper } from "../../../shared/helpers/DateHelper.js";
import { Donation, DonationSummary } from "../models/index.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { getDialect } from "../../../db/index.js";

@injectable()
export class DonationRepo extends KyselyRepo {
  protected readonly tableName = "donations";
  protected readonly moduleName = "giving";
  protected readonly softDelete = false;

  public override async save(model: any) {
    if (model.personId === "") model.personId = null;
    if (model.id) {
      return this.updateDonation(model);
    } else {
      return this.createDonation(model);
    }
  }

  private async createDonation(donation: any): Promise<any> {
    donation.id = UniqueIdHelper.shortId();
    donation.entryTime = new Date();
    if (!donation.status) donation.status = "complete";
    const donationDate = LocalDateHelper.toMysqlDateOnly(donation.donationDate);
    const entryTime = DateHelper.toMysqlDate(donation.entryTime);
    await this.db.insertInto("donations").values({
      id: donation.id, churchId: donation.churchId, batchId: donation.batchId, personId: donation.personId,
      donationDate, amount: donation.amount, currency: donation.currency, method: donation.method,
      methodDetails: donation.methodDetails, notes: donation.notes, entryTime, status: donation.status,
      transactionId: donation.transactionId
    }).execute();
    return donation;
  }

  private async updateDonation(donation: any): Promise<any> {
    const donationDate = LocalDateHelper.toMysqlDateOnly(donation.donationDate);
    const entryTime = DateHelper.toMysqlDate(donation.entryTime);
    await this.db.updateTable("donations").set({
      batchId: donation.batchId, personId: donation.personId, donationDate, amount: donation.amount,
      currency: donation.currency, method: donation.method, methodDetails: donation.methodDetails,
      notes: donation.notes, entryTime, status: donation.status, transactionId: donation.transactionId
    }).where("id", "=", donation.id).where("churchId", "=", donation.churchId).execute();
    return donation;
  }

  public async deleteByBatchId(churchId: string, batchId: string) {
    await this.db.deleteFrom("donations")
      .where("churchId", "=", churchId).where("batchId", "=", batchId).execute();
  }

  public async loadByBatchId(churchId: string, batchId: string) {
    return this.db.selectFrom("donations").selectAll()
      .where("churchId", "=", churchId).where("batchId", "=", batchId)
      .orderBy("entryTime", "desc").execute();
  }

  public async loadByMethodDetails(churchId: string, method: string, methodDetails: string) {
    return await this.db.selectFrom("donations").selectAll()
      .where("churchId", "=", churchId).where("method", "=", method).where("methodDetails", "=", methodDetails)
      .orderBy("donationDate", "desc").limit(1)
      .executeTakeFirst() ?? null;
  }

  public async loadByPersonId(churchId: string, personId: string) {
    const result = await sql`
      SELECT d.*, f.id as "fundId", COALESCE(f.name, 'Unkown') as "fundName", fd.amount as "fundAmount"
      FROM donations d
      INNER JOIN "fundDonations" fd on fd."donationId" = d.id
      LEFT JOIN funds f on f.id = fd."fundId"
      WHERE d."churchId" = ${churchId} AND d."personId" = ${personId} AND (f."taxDeductible" = true OR f."taxDeductible" IS NULL)
      ORDER BY d."donationDate" DESC
    `.execute(this.db);
    return result.rows;
  }

  public async findMatchingDonation(churchId: string, amount: number, donationDate: Date, personId?: string | null): Promise<Donation | null> {
    const startOfDay = new Date(donationDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(donationDate);
    endOfDay.setHours(23, 59, 59, 999);
    const startStr = DateHelper.toMysqlDate(startOfDay);
    const endStr = DateHelper.toMysqlDate(endOfDay);

    let q = this.db.selectFrom("donations").selectAll()
      .where("churchId", "=", churchId)
      .where("amount", "=", amount as any)
      .where("donationDate", ">=", startStr as any)
      .where("donationDate", "<=", endStr as any);

    if (personId) {
      q = q.where("personId", "=", personId);
    } else {
      q = q.where("personId", "is", null);
    }

    const row = await q.limit(1).executeTakeFirst() ?? null;
    return row ? this.convertToModel(churchId, row) : null;
  }

  public async loadDashboardKpis(churchId: string, startDate: Date, endDate: Date, fundId?: string) {
    const sDate = DateHelper.toMysqlDate(startDate);
    const eDate = DateHelper.toMysqlDate(endDate);
    if (fundId) {
      const result = await sql`
        SELECT SUM(fd.amount) as "totalGiving", AVG(d.amount) as "avgGift", COUNT(DISTINCT d."personId") as "donorCount", COUNT(DISTINCT d.id) as "donationCount"
        FROM donations d
        INNER JOIN "fundDonations" fd on fd."donationId" = d.id
        INNER JOIN funds f on f.id = fd."fundId"
        WHERE d."churchId"=${churchId} AND d."donationDate" BETWEEN ${sDate} AND ${eDate} AND fd."fundId" = ${fundId}
      `.execute(this.db);
      return (result.rows as any[])[0] ?? null;
    } else {
      const result = await sql`
        SELECT SUM(fd.amount) as "totalGiving", AVG(d.amount) as "avgGift", COUNT(DISTINCT d."personId") as "donorCount", COUNT(DISTINCT d.id) as "donationCount"
        FROM donations d
        INNER JOIN "fundDonations" fd on fd."donationId" = d.id
        INNER JOIN funds f on f.id = fd."fundId"
        WHERE d."churchId"=${churchId} AND d."donationDate" BETWEEN ${sDate} AND ${eDate}
      `.execute(this.db);
      return (result.rows as any[])[0] ?? null;
    }
  }

  public async loadSummary(churchId: string, startDate: Date, endDate: Date) {
    const sDate = DateHelper.toMysqlDate(startDate);
    const eDate = DateHelper.toMysqlDate(endDate);
    const isPg = getDialect() === "postgres";
    const result = isPg
      ? await sql`
        SELECT DATE_TRUNC('week', d."donationDate") AS week, SUM(fd.amount) as "totalAmount", f.name as "fundName"
        FROM donations d
        INNER JOIN "fundDonations" fd on fd."donationId" = d.id
        INNER JOIN funds f on f.id = fd."fundId" AND f."taxDeductible" = true
        WHERE d."churchId"=${churchId}
        AND d."donationDate" BETWEEN ${sDate} AND ${eDate}
        GROUP BY DATE_TRUNC('week', d."donationDate"), f.name
        ORDER BY DATE_TRUNC('week', d."donationDate"), f.name
      `.execute(this.db)
      : await sql`
        SELECT STR_TO_DATE(concat(year(d."donationDate"), ' ', week(d."donationDate", 0), ' Sunday'), '%X %V %W') AS week, SUM(fd.amount) as "totalAmount", f.name as "fundName"
        FROM donations d
        INNER JOIN "fundDonations" fd on fd."donationId" = d.id
        INNER JOIN funds f on f.id = fd."fundId" AND f."taxDeductible" = true
        WHERE d."churchId"=${churchId}
        AND d."donationDate" BETWEEN ${sDate} AND ${eDate}
        GROUP BY year(d."donationDate"), week(d."donationDate", 0), f.name
        ORDER BY year(d."donationDate"), week(d."donationDate", 0), f.name
      `.execute(this.db);
    return result.rows;
  }

  public async loadPersonBasedSummary(churchId: string, startDate: Date, endDate: Date) {
    const result = await sql`
      SELECT d."personId", d.amount as "donationAmount", fd."fundId", fd.amount as "fundAmount", f.name as "fundName"
      FROM donations d
      INNER JOIN "fundDonations" fd on fd."donationId" = d.id
      INNER JOIN funds f on f.id = fd."fundId" AND f."taxDeductible" = true
      WHERE d."churchId"=${churchId}
      AND d."donationDate" BETWEEN ${DateHelper.toMysqlDate(startDate)} AND ${DateHelper.toMysqlDate(endDate)}
    `.execute(this.db);
    return result.rows;
  }

  public convertToModel(_churchId: string, data: any): Donation {
    const result: Donation = {
      id: data.id,
      churchId: data.churchId,
      batchId: data.batchId,
      personId: data.personId,
      donationDate: data.donationDate,
      amount: data.amount,
      currency: data.currency,
      method: data.method,
      methodDetails: data.methodDetails,
      notes: data.notes,
      entryTime: data.entryTime,
      status: data.status || "complete",
      transactionId: data.transactionId
    };
    if (data.fundName !== undefined) result.fund = { id: data.fundId, name: data.fundName, amount: data.fundAmount };
    return result;
  }

  public async loadByTransactionId(churchId: string, transactionId: string): Promise<Donation | null> {
    const row = await this.db.selectFrom("donations").selectAll()
      .where("churchId", "=", churchId).where("transactionId", "=", transactionId)
      .limit(1).executeTakeFirst() ?? null;
    return row ? this.convertToModel(churchId, row) : null;
  }

  public async updateStatus(churchId: string, transactionId: string, status: string): Promise<void> {
    await this.db.updateTable("donations").set({ status })
      .where("churchId", "=", churchId).where("transactionId", "=", transactionId).execute();
  }

  public convertAllToSummary(_churchId: string, data: any[]) {
    const result: DonationSummary[] = [];
    data.forEach((d) => {
      const week = d.week;
      let weekRow: DonationSummary = ArrayHelper.getOne(result, "week", week);
      if (weekRow === null) {
        weekRow = { week, donations: [] };
        result.push(weekRow);
      }
      weekRow.donations!.push({ fund: { name: d.fundName }, totalAmount: d.totalAmount });
    });
    return result;
  }

  public convertAllToPersonSummary(_churchId: string, data: any[]) {
    const result: { personId: string; totalAmount: number; funds: { [fundName: string]: number }[] }[] = [];
    const checkDecimals = (value: number) => {
      if (value === Math.floor(value)) {
        return value;
      } else {
        return +value.toFixed(2);
      }
    };

    const peopleIds = ArrayHelper.getIds(data, "personId");
    peopleIds.forEach((id) => {
      let totalAmount: number = 0;
      const funds: any[] = [];
      const personDonations = ArrayHelper.getAll(data, "personId", id);
      personDonations.forEach((pd) => {
        totalAmount += pd.fundAmount;
      });
      const fundIds = ArrayHelper.getIds(personDonations, "fundId");
      fundIds.forEach((fuId) => {
        let totalFundAmount: number = 0;
        const fundBasedRecords = ArrayHelper.getAll(personDonations, "fundId", fuId);
        fundBasedRecords.forEach((r) => {
          totalFundAmount += r.fundAmount;
        });
        funds.push({ [fundBasedRecords[0].fundName]: checkDecimals(totalFundAmount) });
      });
      result.push({ personId: id, totalAmount: checkDecimals(totalAmount), funds });
    });

    // for anonymous donations
    const anonDonations = ArrayHelper.getAll(data, "personId", null);
    if (anonDonations.length > 0) {
      let totalAmount: number = 0;
      const funds: any[] = [];
      anonDonations.forEach((ad) => {
        totalAmount += ad.donationAmount;
      });
      const fundIds = ArrayHelper.getIds(anonDonations, "fundId");
      fundIds.forEach((fuId) => {
        let totalFundAmount: number = 0;
        const fundBasedRecords = ArrayHelper.getAll(anonDonations, "fundId", fuId);
        fundBasedRecords.forEach((r) => {
          totalFundAmount += r.fundAmount;
        });
        funds.push({ [fundBasedRecords[0].fundName]: checkDecimals(totalFundAmount) });
      });
      result.push({ personId: null as any, totalAmount: checkDecimals(totalAmount), funds });
    }

    return result;
  }
}
