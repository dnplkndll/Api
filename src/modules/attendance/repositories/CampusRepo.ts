import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class CampusRepo extends KyselyRepo {
  protected readonly tableName = "campuses";
  protected readonly moduleName = "attendance";
  protected readonly softDelete = true;

  public override async loadAll(churchId: string) {
    return this.db.selectFrom("campuses").selectAll()
      .where("churchId", "=", churchId).where("removed", "=", 0)
      .orderBy("name").execute();
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      name: data.name,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zip: data.zip,
      importKey: data.importKey
    };
  }
}
