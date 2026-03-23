import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class ConversationRepo extends KyselyRepo {
  protected readonly tableName = "conversations";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async save(model: any) {
    await this.cleanup();
    if (model.id) {
      await this.db.updateTable("conversations").set({
        title: model.title,
        groupId: model.groupId,
        visibility: model.visibility,
        allowAnonymousPosts: model.allowAnonymousPosts
      }).where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await sql`INSERT INTO conversations (id, churchId, contentType, contentId, title, groupId, visibility, allowAnonymousPosts, dateCreated, postCount) VALUES (${model.id}, ${model.churchId}, ${model.contentType}, ${model.contentId}, ${model.title}, ${model.groupId}, ${model.visibility}, ${model.allowAnonymousPosts}, NOW(), 0)`.execute(this.db);
    }
    return model;
  }

  private async cleanup() {
    await sql`CALL cleanup()`.execute(this.db);
  }

  public async loadByIds(churchId: string, ids: string[]) {
    const result = await this.db.selectFrom("conversations")
      .select(["id", "firstPostId", "lastPostId", "postCount"])
      .where("churchId", "=", churchId)
      .where("id", "in", ids)
      .execute();
    return result || [];
  }

  public async loadPosts(churchId: string, groupIds: string[]) {
    const result = await sql`select c.contentType, c.contentId, c.groupId, c.id, c.firstPostId, c.lastPostId, c.postCount FROM conversations c INNER JOIN messages fp on fp.id=c.firstPostId INNER JOIN messages lp on lp.id=c.lastPostId WHERE c.churchId=${churchId} and c.groupId IN (${sql.join(groupIds)}) AND lp.timeSent>DATE_SUB(NOW(), INTERVAL 365 DAY)`.execute(this.db);
    return (result.rows as any[]) || [];
  }

  public async loadById(churchId: string, id: string) {
    return (await this.db.selectFrom("conversations").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }

  public async loadForContent(churchId: string, contentType: string, contentId: string) {
    return this.db.selectFrom("conversations").selectAll()
      .where("churchId", "=", churchId)
      .where("contentType", "=", contentType)
      .where("contentId", "=", contentId)
      .orderBy("dateCreated", "desc")
      .execute();
  }

  public async loadCurrent(churchId: string, contentType: string, contentId: string) {
    const cutOff = new Date();
    cutOff.setDate(cutOff.getDate() - 1);
    return (await this.db.selectFrom("conversations").selectAll()
      .where("churchId", "=", churchId)
      .where("contentType", "=", contentType)
      .where("contentId", "=", contentId)
      .where("dateCreated", ">=", cutOff)
      .orderBy("dateCreated", "desc")
      .limit(1)
      .executeTakeFirst()) ?? null;
  }

  public async loadHostConversation(churchId: string, mainConversationId: string) {
    const result = await sql`select c2.* FROM conversations c INNER JOIN conversations c2 on c2.churchId=c.churchId and c2.contentType='streamingLiveHost' and c2.contentId=c.contentId WHERE c.id=${mainConversationId} AND c.churchId=${churchId} LIMIT 1`.execute(this.db);
    return (result.rows as any[])[0] ?? null;
  }

  public async updateStats(conversationId: string) {
    await sql`CALL updateConversationStats(${conversationId})`.execute(this.db);
  }
}
