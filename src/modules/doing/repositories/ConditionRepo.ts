import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class ConditionRepo extends KyselyRepo {
  protected readonly tableName = "conditions";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public async loadForAutomation(churchId: string, automationId: string) {
    const result = await sql`
      SELECT * FROM conditions
      WHERE "conjunctionId" IN (SELECT id FROM conjunctions WHERE "automationId"=${automationId})
      AND "churchId"=${churchId}
    `.execute(this.db);
    return result.rows;
  }
}
