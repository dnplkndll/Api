import { injectable } from "inversify";
import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { DateHelper } from "../../../shared/helpers/DateHelper.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class DonationBatchRepo extends KyselyRepo {
  protected readonly tableName = "donationBatches";
  protected readonly moduleName = "giving";
  protected readonly softDelete = false;

  public override async save(model: any) {
    const processedModel = { ...model };
    if (processedModel.batchDate) {
      processedModel.batchDate = DateHelper.toMysqlDateOnly(processedModel.batchDate);
    }
    if (processedModel.id) {
      const { id: _id, churchId: _cid, ...setData } = processedModel;
      await this.db.updateTable("donationBatches").set(setData)
        .where("id", "=", processedModel.id).where("churchId", "=", processedModel.churchId).execute();
    } else {
      processedModel.id = UniqueIdHelper.shortId();
      await this.db.insertInto("donationBatches").values(processedModel).execute();
    }
    return processedModel;
  }

  public async getOrCreateCurrent(churchId: string) {
    const data = await this.db.selectFrom("donationBatches").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("batchDate", "desc").limit(1)
      .executeTakeFirst() ?? null;
    if (data !== null) return this.convertToModel(churchId, data);
    else {
      const batch: any = { churchId, name: "Online Donation", batchDate: new Date() };
      await this.save(batch);
      return batch;
    }
  }

  public override async loadAll(churchId: string) {
    const result = await sql`
      SELECT db.*,
        COALESCE(d."donationCount", 0) AS "donationCount",
        COALESCE(d."totalAmount", 0) AS "totalAmount"
      FROM "donationBatches" db
      LEFT JOIN (
        SELECT "batchId", COUNT(*) AS "donationCount", SUM(amount) AS "totalAmount"
        FROM donations
        WHERE "churchId" = ${churchId}
        GROUP BY "batchId"
      ) d ON db.id = d."batchId"
      WHERE db."churchId" = ${churchId}
      ORDER BY db."batchDate" DESC
    `.execute(this.db);
    return this.convertAllToModel(churchId, result.rows as any[]);
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      name: data.name,
      batchDate: data.batchDate,
      donationCount: data.donationCount,
      totalAmount: data.totalAmount
    };
  }
}
