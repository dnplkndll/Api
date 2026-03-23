import { injectable } from "inversify";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class BibleVerseRepo extends GlobalKyselyRepo {
  protected readonly tableName = "bibleVerses";
  protected readonly moduleName = "content";

  public async loadAll() {
    return this.db.selectFrom("bibleVerses").selectAll().orderBy("number").execute();
  }

  public async loadByChapter(translationKey: string, chapterKey: string) {
    return this.db.selectFrom("bibleVerses").selectAll()
      .where("translationKey", "=", translationKey)
      .where("chapterKey", "=", chapterKey)
      .orderBy("number")
      .execute();
  }
}
