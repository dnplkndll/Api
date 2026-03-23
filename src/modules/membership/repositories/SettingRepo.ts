import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class SettingRepo extends KyselyRepo {
  protected readonly tableName = "settings";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async loadPublicSettings(churchId: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("public", "=", 1)
      .execute();
  }

  public async loadMulipleChurches(keyNames: string[], churchIds: string[]) {
    if (!keyNames.length || !churchIds.length) return [];
    return this.db.selectFrom(this.tableName).selectAll()
      .where("keyName", "in", keyNames)
      .where("churchId", "in", churchIds)
      .where("public", "=", 1)
      .execute();
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      keyName: data.keyName,
      value: data.value,
      public: data.public
    };
  }
}
