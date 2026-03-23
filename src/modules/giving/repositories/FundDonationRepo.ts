import { injectable } from "inversify";
import { sql } from "kysely";
import { DateHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class FundDonationRepo extends KyselyRepo {
  protected readonly tableName = "fundDonations";
  protected readonly moduleName = "giving";
  protected readonly softDelete = false;

  public async loadAllByDate(churchId: string, startDate: Date, endDate: Date) {
    const result = await sql`
      SELECT fd.*, d.donationDate, d.batchId, d.personId
      FROM fundDonations fd INNER JOIN donations d ON d.id=fd.donationId
      WHERE fd.churchId=${churchId} AND d.donationDate BETWEEN ${DateHelper.toMysqlDate(startDate)} AND ${DateHelper.toMysqlDate(endDate)}
      ORDER by d.donationDate desc
    `.execute(this.db);
    return result.rows;
  }

  public async loadByDonationId(churchId: string, donationId: string) {
    return this.db.selectFrom("fundDonations").selectAll()
      .where("churchId", "=", churchId).where("donationId", "=", donationId).execute();
  }

  public async loadByPersonId(churchId: string, personId: string) {
    const result = await sql`
      SELECT fd.* FROM donations d
      inner join fundDonations fd on fd.churchId=d.churchId and fd.donationId=d.id
      WHERE d.churchId=${churchId} AND d.personId=${personId}
      ORDER by d.donationDate
    `.execute(this.db);
    return result.rows;
  }

  public async loadByFundId(churchId: string, fundId: string) {
    const result = await sql`
      SELECT fd.*, d.donationDate, d.batchId, d.personId
      FROM fundDonations fd INNER JOIN donations d ON d.id=fd.donationId
      WHERE fd.churchId=${churchId} AND fd.fundId=${fundId}
      ORDER by d.donationDate desc
    `.execute(this.db);
    return result.rows;
  }

  public async loadByFundIdDate(churchId: string, fundId: string, startDate: Date, endDate: Date) {
    const result = await sql`
      SELECT fd.*, d.donationDate, d.batchId, d.personId
      FROM fundDonations fd INNER JOIN donations d ON d.id=fd.donationId
      WHERE fd.churchId=${churchId} AND fd.fundId=${fundId} AND d.donationDate BETWEEN ${DateHelper.toMysqlDate(startDate)} AND ${DateHelper.toMysqlDate(endDate)}
      ORDER by d.donationDate desc
    `.execute(this.db);
    return result.rows;
  }

  public async loadByFundName(churchId: string, fundName: string) {
    const result = await sql`
      SELECT fd.*, d.donationDate, d.batchId, d.personId
      FROM fundDonations fd INNER JOIN donations d ON d.id=fd.donationId
      INNER JOIN funds f ON f.id=fd.fundId
      WHERE fd.churchId=${churchId} AND f.name LIKE ${"%" + fundName + "%"}
      ORDER by d.donationDate desc
    `.execute(this.db);
    return result.rows;
  }

  public async loadByFundNameDate(churchId: string, fundName: string, startDate: Date, endDate: Date) {
    const result = await sql`
      SELECT fd.*, d.donationDate, d.batchId, d.personId
      FROM fundDonations fd INNER JOIN donations d ON d.id=fd.donationId
      INNER JOIN funds f ON f.id=fd.fundId
      WHERE fd.churchId=${churchId} AND f.name LIKE ${"%" + fundName + "%"} AND d.donationDate BETWEEN ${DateHelper.toMysqlDate(startDate)} AND ${DateHelper.toMysqlDate(endDate)}
      ORDER by d.donationDate desc
    `.execute(this.db);
    return result.rows;
  }

  public convertToModel(_churchId: string, data: any) {
    const result: any = { id: data.id, donationId: data.donationId, fundId: data.fundId, amount: data.amount };
    if (data.batchId !== undefined) {
      result.donation = {
        id: result.donationId,
        donationDate: data.donationDate,
        batchId: data.batchId,
        personId: data.personId
      };
    }
    return result;
  }
}
