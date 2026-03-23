import { injectable } from "inversify";
import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class FileRepo extends KyselyRepo {
  protected readonly tableName = "files";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      setData.dateModified = sql`NOW()`;
      await this.db.updateTable("files").set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await this.db.insertInto("files").values({
        ...model,
        dateModified: sql`NOW()`
      }).execute();
    }
    return model;
  }

  public async loadByIds(churchId: string, ids: string[]) {
    return this.db.selectFrom("files").selectAll()
      .where("churchId", "=", churchId)
      .where("id", "in", ids)
      .execute();
  }

  public async loadForContent(churchId: string, contentType: string, contentId: string) {
    return this.db.selectFrom("files").selectAll()
      .where("churchId", "=", churchId)
      .where("contentType", "=", contentType)
      .where("contentId", "=", contentId)
      .execute();
  }

  public async loadForWebsite(churchId: string) {
    return this.db.selectFrom("files").selectAll()
      .where("churchId", "=", churchId)
      .where("contentType", "=", "website")
      .execute();
  }

  public async loadTotalBytes(churchId: string, contentType: string, contentId: string) {
    const result = await sql`select IFNULL(sum(size), 0) as size from files where churchId=${churchId} and contentType=${contentType} and contentId=${contentId}`.execute(this.db);
    return result.rows[0] as { size: number };
  }
}
