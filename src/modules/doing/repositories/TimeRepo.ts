import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class TimeRepo extends KyselyRepo {
  protected readonly tableName = "times";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public async deleteByPlanId(churchId: string, planId: string) {
    await this.db.deleteFrom("times")
      .where("churchId", "=", churchId).where("planId", "=", planId).execute();
  }

  public async loadByPlanId(churchId: string, planId: string) {
    return this.db.selectFrom("times").selectAll()
      .where("churchId", "=", churchId).where("planId", "=", planId).execute();
  }

  public async loadByPlanIds(churchId: string, planIds: string[]) {
    return this.db.selectFrom("times").selectAll()
      .where("churchId", "=", churchId).where("planId", "in", planIds).execute();
  }
}
