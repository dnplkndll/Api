import { injectable } from "inversify";
import { ArrayHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class SettingRepo extends KyselyRepo {
  protected readonly tableName = "settings";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async deleteForUser(churchId: string, userId: string, id: string) {
    await this.db.deleteFrom("settings")
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .where("userId", "=", userId)
      .execute();
  }

  public async loadAll(churchId: string) {
    return this.db.selectFrom("settings").selectAll()
      .where("churchId", "=", churchId)
      .where("userId", "is", null)
      .execute();
  }

  public async loadUser(churchId: string, userId: string) {
    return this.db.selectFrom("settings").selectAll()
      .where("churchId", "=", churchId)
      .where("userId", "=", userId)
      .execute();
  }

  public async loadPublicSettings(churchId: string) {
    return this.db.selectFrom("settings").selectAll()
      .where("churchId", "=", churchId)
      .where("public", "=", 1)
      .execute();
  }

  public async loadAllPublicSettings() {
    return this.db.selectFrom("settings").selectAll()
      .where("public", "=", 1)
      .where("userId", "is", null)
      .execute();
  }

  public async loadMulipleChurches(keyNames: string[], churchIds: string[]) {
    return this.db.selectFrom("settings").selectAll()
      .where("keyName", "in", keyNames)
      .where("churchId", "in", churchIds)
      .where("public", "=", 1)
      .where("userId", "is", null)
      .execute();
  }

  public async loadByKeyNames(churchId: string, keyNames: string[]) {
    return this.db.selectFrom("settings").selectAll()
      .where("keyName", "in", keyNames)
      .where("churchId", "=", churchId)
      .where("userId", "is", null)
      .execute();
  }

  public getImports(data: any[], type?: string, playlistId?: string, channelId?: string) {
    let result: any[] = [];
    if (playlistId && channelId) {
      const filterType = type === "youtube" ? "youtubeChannelId" : "vimeoChannelId";
      const filteredByPlaylist = data.filter((d) => d.keyName === "autoImportSermons" && d.value.includes(playlistId));
      const filteredByChannel = data.filter((d) => d.keyName === filterType && d.value === channelId);
      const channelIds = ArrayHelper.getIds(filteredByChannel, "id");
      const filtered = filteredByPlaylist.filter((d) => {
        const id = d.value.split("|#");
        return channelIds.indexOf(id[1]) >= 0;
      });
      if (filtered.length > 0) {
        const split = filtered[0].value.split("|#");
        const getChannelId = ArrayHelper.getOne(filteredByChannel, "id", split[1]);
        result = [{ channel: getChannelId, ...filtered[0] }];
      }
    } else {
      const filterByCategory = data.filter((d) => d.keyName === "autoImportSermons");
      if (filterByCategory.length > 0) {
        let filtered: any[] = [];
        if (type === "youtube") {
          const filterByYoutube = data.filter((d) => d.keyName === "youtubeChannelId");
          const ids = ArrayHelper.getIds(filterByYoutube, "id");
          filtered = filterByCategory.filter((d) => {
            const id = d.value.split("|#");
            return ids.indexOf(id[1]) >= 0;
          });
        } else if (type === "vimeo") {
          const filterByVimeo = data.filter((d) => d.keyName === "vimeoChannelId");
          const ids = ArrayHelper.getIds(filterByVimeo, "id");
          filtered = filterByCategory.filter((d) => {
            const id = d.value.split("|#");
            return ids.indexOf(id[1]) >= 0;
          });
        } else {
          filtered = filterByCategory;
        }
        filtered.forEach((row) => {
          const split = row.value.split("|#");
          const getchannel = ArrayHelper.getOne(data, "id", split[1]);
          result.push({ channel: getchannel, ...row });
        });
      }
    }
    return result;
  }

  public convertAllImports(data: any[]) {
    const result: any[] = [];
    data.forEach((d) => {
      result.push({
        id: d.id,
        churchId: d.churchId,
        keyName: d.keyName,
        playlistId: d.value.split("|#")[0],
        [d?.channel?.keyName]: d?.channel?.value
      });
    });
    return result;
  }
}
