import { injectable } from "inversify";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class BibleTranslationRepo extends GlobalKyselyRepo {
  protected readonly tableName = "bibleTranslations";
  protected readonly moduleName = "content";

  public async loadBySourceKey(source: string | null, sourceKey: string) {
    if (source) {
      return (await this.db.selectFrom("bibleTranslations").selectAll()
        .where("source", "=", source)
        .where("sourceKey", "=", sourceKey)
        .executeTakeFirst()) ?? null;
    }
    return (await this.db.selectFrom("bibleTranslations").selectAll()
      .where("sourceKey", "=", sourceKey)
      .executeTakeFirst()) ?? null;
  }

  public async loadAll() {
    return this.db.selectFrom("bibleTranslations").selectAll().orderBy("name").execute();
  }

  public async loadNeedingCopyrights() {
    return this.db.selectFrom("bibleTranslations").selectAll()
      .where("copyright", "is", null)
      .execute();
  }
}
