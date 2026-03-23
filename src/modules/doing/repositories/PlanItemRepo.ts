import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class PlanItemRepo extends KyselyRepo {
  protected readonly tableName = "planItems";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public async deleteByPlanId(churchId: string, planId: string) {
    await this.db.deleteFrom("planItems")
      .where("churchId", "=", churchId).where("planId", "=", planId).execute();
  }

  public async loadByIds(churchId: string, ids: string[]) {
    return this.db.selectFrom("planItems").selectAll()
      .where("churchId", "=", churchId).where("id", "in", ids).execute();
  }

  public async loadForPlan(churchId: string, planId: string) {
    return this.db.selectFrom("planItems").selectAll()
      .where("churchId", "=", churchId).where("planId", "=", planId)
      .orderBy("sort").execute();
  }
}
