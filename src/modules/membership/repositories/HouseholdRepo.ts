import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class HouseholdRepo extends KyselyRepo {
  protected readonly tableName = "households";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async deleteUnused(churchId: string) {
    await sql`DELETE FROM households WHERE "churchId"=${churchId} AND id not in (SELECT "householdId" FROM people WHERE "churchId"=${churchId} AND "householdId" IS NOT NULL group by "householdId")`.execute(this.db);
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      name: data.name
    };
  }
}
