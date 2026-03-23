import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class PlanTypeRepo extends KyselyRepo {
  protected readonly tableName = "planTypes";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public async loadByIds(churchId: string, ids: string[]) {
    return this.db.selectFrom("planTypes").selectAll()
      .where("churchId", "=", churchId).where("id", "in", ids).execute();
  }

  public async loadByMinistryId(churchId: string, ministryId: string) {
    return this.db.selectFrom("planTypes").selectAll()
      .where("churchId", "=", churchId).where("ministryId", "=", ministryId).execute();
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      ministryId: data.ministryId,
      name: data.name
    };
  }
}
