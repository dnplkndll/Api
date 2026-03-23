import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class BlockRepo extends KyselyRepo {
  protected readonly tableName = "blocks";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async loadAll(churchId: string) {
    return this.db.selectFrom("blocks").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("name")
      .execute();
  }

  public async loadByBlockType(churchId: string, blockType: string) {
    return this.db.selectFrom("blocks").selectAll()
      .where("churchId", "=", churchId)
      .where("blockType", "=", blockType)
      .orderBy("name")
      .execute();
  }
}
