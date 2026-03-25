import { injectable } from "inversify";
import { sql } from "kysely";
import { DateHelper } from "../../../shared/helpers/DateHelper.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class BlockoutDateRepo extends KyselyRepo {
  protected readonly tableName = "blockoutDates";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public override async save(model: any) {
    const processedData = { ...model };
    if (processedData.startDate) {
      processedData.startDate = DateHelper.toMysqlDateOnly(processedData.startDate);
    }
    if (processedData.endDate) {
      processedData.endDate = DateHelper.toMysqlDateOnly(processedData.endDate);
    }
    return super.save(processedData);
  }

  public async loadByIds(churchId: string, ids: string[]) {
    return this.db.selectFrom("blockoutDates").selectAll()
      .where("churchId", "=", churchId).where("id", "in", ids).execute();
  }

  public async loadForPerson(churchId: string, personId: string) {
    return this.db.selectFrom("blockoutDates").selectAll()
      .where("churchId", "=", churchId).where("personId", "=", personId).execute();
  }

  public async loadUpcoming(churchId: string) {
    const result = await sql`SELECT * FROM "blockoutDates" WHERE "churchId"=${churchId} AND "endDate">NOW()`.execute(this.db);
    return result.rows;
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      personId: data.personId,
      startDate: data.startDate,
      endDate: data.endDate
    };
  }
}
