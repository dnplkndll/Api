import { injectable } from "inversify";
import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class BibleLookupRepo extends GlobalKyselyRepo {
  protected readonly tableName = "bibleLookups";
  protected readonly moduleName = "content";

  public async save(model: any) {
    if (model.id) {
      await this.db.updateTable("bibleLookups").set({
        translationKey: model.translationKey,
        lookupTime: model.lookupTime,
        ipAddress: model.ipAddress,
        startVerseKey: model.startVerseKey,
        endVerseKey: model.endVerseKey
      }).where("id", "=", model.id).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await sql`INSERT INTO bibleLookups (id, translationKey, lookupTime, ipAddress, startVerseKey, endVerseKey) VALUES (${model.id}, ${model.translationKey}, now(), ${model.ipAddress}, ${model.startVerseKey}, ${model.endVerseKey})`.execute(this.db);
    }
    return model;
  }

  public async saveAll(lookups: any[]) {
    const promises: Promise<any>[] = [];
    lookups.forEach((b) => {
      promises.push(this.save(b));
    });
    return Promise.all(promises);
  }

  public async getStats(startDate: Date, endDate: Date) {
    const result = await sql`SELECT bt.abbreviation, count(distinct(bl.ipAddress)) as lookups FROM bibleTranslations bt INNER JOIN bibleLookups bl ON bl.translationKey = bt.abbreviation WHERE bl.lookupTime BETWEEN ${startDate} AND ${endDate} GROUP BY bt.abbreviation ORDER BY bt.abbreviation`.execute(this.db);
    return result.rows as any[];
  }
}
