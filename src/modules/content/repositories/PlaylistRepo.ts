import { DateHelper, UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class PlaylistRepo extends KyselyRepo {
  protected readonly tableName = "playlists";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.publishDate) model.publishDate = DateHelper.toMysqlDate(model.publishDate);

    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable("playlists").set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await this.db.insertInto("playlists").values(model).execute();
    }
    return model;
  }

  public async loadAll(churchId: string) {
    return this.db.selectFrom("playlists").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("publishDate", "desc")
      .execute();
  }

  public loadById(id: string, churchId: string) {
    return this.load(churchId, id);
  }

  public async loadPublicAll(churchId: string): Promise<any[]> {
    return this.db.selectFrom("playlists").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("publishDate", "desc")
      .execute();
  }
}
