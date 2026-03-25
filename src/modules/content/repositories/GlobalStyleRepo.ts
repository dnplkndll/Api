import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class GlobalStyleRepo extends KyselyRepo {
  protected readonly tableName = "globalStyles";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async loadForChurch(churchId: string) {
    return (await this.db.selectFrom("globalStyles").selectAll()
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }
}
