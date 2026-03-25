import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class ActionRepo extends KyselyRepo {
  protected readonly tableName = "actions";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public async loadForAutomation(churchId: string, automationId: string) {
    return this.db.selectFrom("actions").selectAll()
      .where("automationId", "=", automationId).where("churchId", "=", churchId).execute();
  }
}
