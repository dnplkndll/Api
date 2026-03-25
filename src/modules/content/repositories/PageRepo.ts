import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class PageRepo extends KyselyRepo {
  protected readonly tableName = "pages";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async loadByUrl(churchId: string, url: string) {
    return (await this.db.selectFrom("pages").selectAll()
      .where("url", "=", url)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }
}
