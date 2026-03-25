import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class RoleRepo extends KyselyRepo {
  protected readonly tableName = "roles";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async loadByIds(ids: string[]) {
    if (ids.length === 0) return [];
    return this.db.selectFrom(this.tableName).selectAll()
      .where("id", "in", ids)
      .execute();
  }

  public async loadAll(churchId?: string) {
    if (churchId) {
      return this.db.selectFrom(this.tableName).selectAll()
        .where("churchId", "=", churchId)
        .execute();
    }
    return this.db.selectFrom(this.tableName).selectAll().execute();
  }

  public async loadByChurchId(id: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", id)
      .execute();
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      name: data.name
    };
  }

  public async loadById(churchId: string, id: string) {
    return this.loadOne(churchId, id);
  }
}
