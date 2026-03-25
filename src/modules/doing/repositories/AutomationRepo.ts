import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class AutomationRepo extends KyselyRepo {
  protected readonly tableName = "automations";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public override async loadAll(churchId: string) {
    return this.db.selectFrom("automations").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("title").execute();
  }

  public async loadAllChurches() {
    return this.db.selectFrom("automations").selectAll().execute();
  }
}
