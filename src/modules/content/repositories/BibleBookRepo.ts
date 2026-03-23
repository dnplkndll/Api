import { injectable } from "inversify";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class BibleBookRepo extends GlobalKyselyRepo {
  protected readonly tableName = "bibleBooks";
  protected readonly moduleName = "content";

  public async loadAll(translationKey?: string) {
    if (translationKey) {
      return this.db.selectFrom("bibleBooks").selectAll()
        .where("translationKey", "=", translationKey)
        .orderBy("sort")
        .execute();
    }
    return this.db.selectFrom("bibleBooks").selectAll().orderBy("sort").execute();
  }
}
