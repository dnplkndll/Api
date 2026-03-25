import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class PositionRepo extends KyselyRepo {
  protected readonly tableName = "positions";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public async deleteByPlanId(churchId: string, planId: string) {
    await this.db.deleteFrom("positions")
      .where("churchId", "=", churchId).where("planId", "=", planId).execute();
  }

  public async loadByIds(churchId: string, ids: string[]) {
    return this.db.selectFrom("positions").selectAll()
      .where("churchId", "=", churchId).where("id", "in", ids).execute();
  }

  public async loadByPlanId(churchId: string, planId: string) {
    return this.db.selectFrom("positions").selectAll()
      .where("churchId", "=", churchId).where("planId", "=", planId)
      .orderBy("categoryName").orderBy("name").execute();
  }

  public async loadByPlanIds(churchId: string, planIds: string[]) {
    return this.db.selectFrom("positions").selectAll()
      .where("churchId", "=", churchId).where("planId", "in", planIds).execute();
  }

  public async loadSignupByPlanId(churchId: string, planId: string) {
    return this.db.selectFrom("positions").selectAll()
      .where("churchId", "=", churchId).where("planId", "=", planId).where("allowSelfSignup", "=", true as any)
      .orderBy("categoryName").orderBy("name").execute();
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      planId: data.planId,
      categoryName: data.categoryName,
      name: data.name,
      count: data.count,
      groupId: data.groupId,
      allowSelfSignup: data.allowSelfSignup,
      description: data.description
    };
  }
}
