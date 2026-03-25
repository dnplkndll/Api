import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class ArrangementRepo extends KyselyRepo {
  protected readonly tableName = "arrangements";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async loadAll(churchId: string) {
    return this.db.selectFrom("arrangements").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("name")
      .execute();
  }

  public async loadBySongId(churchId: string, songId: string) {
    return this.db.selectFrom("arrangements").selectAll()
      .where("churchId", "=", churchId)
      .where("songId", "=", songId)
      .execute();
  }

  public async loadBySongDetailId(churchId: string, songDetailId: string) {
    return this.db.selectFrom("arrangements").selectAll()
      .where("churchId", "=", churchId)
      .where("songDetailId", "=", songDetailId)
      .execute();
  }

  public async loadByFreeShowId(churchId: string, freeShowId: string) {
    return (await this.db.selectFrom("arrangements").selectAll()
      .where("churchId", "=", churchId)
      .where("freeShowId", "=", freeShowId)
      .executeTakeFirst()) ?? null;
  }
}
