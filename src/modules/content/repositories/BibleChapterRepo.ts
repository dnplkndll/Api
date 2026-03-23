import { injectable } from "inversify";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class BibleChapterRepo extends GlobalKyselyRepo {
  protected readonly tableName = "bibleChapters";
  protected readonly moduleName = "content";

  public async loadAll() {
    return this.db.selectFrom("bibleChapters").selectAll().orderBy("number").execute();
  }

  public async loadByBook(translationKey: string, bookKey: string) {
    return this.db.selectFrom("bibleChapters").selectAll()
      .where("translationKey", "=", translationKey)
      .where("bookKey", "=", bookKey)
      .orderBy("number")
      .execute();
  }
}
