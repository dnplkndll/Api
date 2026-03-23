import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class SongRepo extends KyselyRepo {
  protected readonly tableName = "songs";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async loadAll(churchId: string) {
    return this.db.selectFrom("songs").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("name")
      .execute();
  }

  public async search(churchId: string, query: string) {
    const q = "%" + query.replace(/ /g, "%") + "%";
    const result = await sql`SELECT sd.*, ak.id as arrangementKeyId, ak.keySignature as arrangementKeySignature, ak.shortDescription FROM songs s INNER JOIN arrangements a on a.songId=s.id INNER JOIN arrangementKeys ak on ak.arrangementId=a.id INNER JOIN songDetails sd on sd.id=a.songDetailId where s.churchId=${churchId} AND (concat(sd.title, ' ', sd.artist) like ${q} or concat(sd.artist, ' ', sd.title) like ${q})`.execute(this.db);
    return result.rows as any[];
  }
}
