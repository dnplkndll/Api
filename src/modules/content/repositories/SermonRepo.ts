import { DateHelper, UniqueIdHelper } from "@churchapps/apihelper";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class SermonRepo extends KyselyRepo {
  protected readonly tableName = "sermons";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.publishDate) model.publishDate = DateHelper.toMysqlDate(model.publishDate);

    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable("sermons").set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await this.db.insertInto("sermons").values(model).execute();
    }
    return model;
  }

  public async loadAll(churchId: string): Promise<any[]> {
    return this.db.selectFrom("sermons").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("publishDate", "desc")
      .execute();
  }

  public loadById(id: string, churchId: string) {
    return this.load(churchId, id);
  }

  public async loadPublicAll(churchId: string) {
    return this.db.selectFrom("sermons").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("publishDate", "desc")
      .execute();
  }

  public async loadTimeline(sermonIds: string[]) {
    const result = await sql`select 'sermon' as postType, id as postId, title, description, thumbnail from sermons where id in (${sql.join(sermonIds)})`.execute(this.db);
    return result.rows as any[];
  }
}
