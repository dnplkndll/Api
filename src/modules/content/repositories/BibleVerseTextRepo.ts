import { injectable } from "inversify";
import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class BibleVerseTextRepo extends GlobalKyselyRepo {
  protected readonly tableName = "bibleVerseTexts";
  protected readonly moduleName = "content";

  public async loadAll() {
    return this.db.selectFrom("bibleVerseTexts").selectAll()
      .orderBy("chapterNumber")
      .orderBy("verseNumber")
      .execute();
  }

  private async loadChapters(translationKey: string, bookKey: string, startChapter: number, endChapter: number) {
    return this.db.selectFrom("bibleVerseTexts").selectAll()
      .where("translationKey", "=", translationKey)
      .where("bookKey", "=", bookKey)
      .where("chapterNumber", ">=", startChapter)
      .where("chapterNumber", "<=", endChapter)
      .orderBy("chapterNumber")
      .orderBy("verseNumber")
      .execute();
  }

  private filterResults(data: any[], startChapter: number, startVerse: number, endChapter: number, endVerse: number) {
    const result: any[] = [];
    data.forEach((v: any) => {
      if (startChapter === endChapter) {
        if (v.chapterNumber === startChapter && v.verseNumber >= startVerse && v.verseNumber <= endVerse) result.push(v);
      } else {
        if (v.chapterNumber === startChapter && v.verseNumber >= startVerse) result.push(v);
        if (v.chapterNumber > startChapter && v.chapterNumber < endChapter) result.push(v);
        if (v.chapterNumber === endChapter && v.verseNumber <= endVerse) result.push(v);
      }
    });
    return result;
  }

  public async loadRange(translationKey: string, startVerseKey: string, endVerseKey: string) {
    const startParts = startVerseKey.split(".");
    const endParts = endVerseKey.split(".");
    if (startParts.length !== 3 || endParts.length !== 3) throw new Error("Invalid verse key format");
    const startChapter = parseInt(startParts[1], 0);
    const endChapter = parseInt(endParts[1], 0);
    const startVerse = parseInt(startParts[2], 0);
    const endVerse = parseInt(endParts[2], 0);

    const data = await this.loadChapters(translationKey, startParts[0], startChapter, endChapter);
    return this.filterResults(data, startChapter, startVerse, endChapter, endVerse);
  }

  public async saveAll(models: any[]) {
    const promises: Promise<any>[] = [];
    for (const model of models) {
      promises.push(this.save(model));
    }
    return Promise.all(promises);
  }

  public async save(model: any) {
    if (!model.id) model.id = UniqueIdHelper.shortId();
    await sql`INSERT INTO "bibleVerseTexts" (id, "translationKey", "verseKey", "bookKey", "chapterNumber", "verseNumber", content, "newParagraph") VALUES (${model.id}, ${model.translationKey}, ${model.verseKey}, ${model.bookKey}, ${model.chapterNumber}, ${model.verseNumber}, ${model.content}, ${model.newParagraph}) ON DUPLICATE KEY UPDATE content=VALUES(content), "newParagraph"=VALUES("newParagraph")`.execute(this.db);
    return model;
  }
}
