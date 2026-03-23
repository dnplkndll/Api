import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class ConjunctionRepo extends KyselyRepo {
  protected readonly tableName = "conjunctions";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public async loadForAutomation(churchId: string, automationId: string) {
    return this.db.selectFrom("conjunctions").selectAll()
      .where("automationId", "=", automationId).where("churchId", "=", churchId).execute();
  }
}
