import { injectable } from "inversify";
import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class SongDetailRepo extends GlobalKyselyRepo {
  protected readonly tableName = "songDetails";
  protected readonly moduleName = "content";

  public async loadAll() {
    return this.db.selectFrom("songDetails").selectAll()
      .orderBy("title")
      .orderBy("artist")
      .execute();
  }

  public async save(model: any) {
    if (model.id) {
      const { id: _id, ...setData } = model;
      await this.db.updateTable("songDetails").set(setData)
        .where("id", "=", model.id).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await this.db.insertInto("songDetails").values(model).execute();
    }
    return model;
  }

  /** Load a single SongDetail by id (global — no churchId filter) */
  public async loadGlobal(id: string) {
    return this.load(id);
  }

  public async search(query: string) {
    const q = "%" + query.replace(/ /g, "%") + "%";
    const result = await sql`SELECT * FROM "songDetails" where concat(title, ' ', artist) like ${q} or concat(artist, ' ', title) like ${q}`.execute(this.db);
    return result.rows as any[];
  }

  public async loadByPraiseChartsId(praiseChartsId: string) {
    return (await this.db.selectFrom("songDetails").selectAll()
      .where("praiseChartsId", "=", praiseChartsId)
      .executeTakeFirst()) ?? null;
  }

  public async loadForChurch(churchId: string) {
    const result = await sql`SELECT sd.*, s.id as "songId", s."churchId" FROM songs s INNER JOIN arrangements a on a."songId"=s.id INNER JOIN "songDetails" sd on sd.id=a."songDetailId" WHERE s."churchId"=${churchId} ORDER BY sd.title, sd.artist`.execute(this.db);
    return result.rows as any[];
  }
}
