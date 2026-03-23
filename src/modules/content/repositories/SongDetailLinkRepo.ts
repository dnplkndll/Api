import { injectable } from "inversify";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class SongDetailLinkRepo extends GlobalKyselyRepo {
  protected readonly tableName = "songDetailLinks";
  protected readonly moduleName = "content";

  public async loadForSongDetail(songDetailId: string) {
    return this.db.selectFrom("songDetailLinks").selectAll()
      .where("songDetailId", "=", songDetailId)
      .orderBy("service")
      .execute();
  }

  public async loadByServiceAndKey(service: string, serviceKey: string) {
    return (await this.db.selectFrom("songDetailLinks").selectAll()
      .where("service", "=", service)
      .where("serviceKey", "=", serviceKey)
      .executeTakeFirst()) ?? null;
  }
}
