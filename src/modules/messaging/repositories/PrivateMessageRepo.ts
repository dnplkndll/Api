import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class PrivateMessageRepo extends KyselyRepo {
  protected readonly tableName = "privateMessages";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async loadById(churchId: string, id: string) {
    return (await this.db.selectFrom("privateMessages").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }

  public async loadByPersonId(churchId: string, personId: string) {
    const result = await sql`SELECT c.*, pm.id as "pmId", pm."fromPersonId", pm."toPersonId", pm."notifyPersonId", pm."deliveryMethod", m."timeSent" as "lastMessageTime" FROM "privateMessages" pm INNER JOIN conversations c on c.id=pm."conversationId" LEFT JOIN messages m on m.id=c."lastPostId" WHERE pm."churchId"=${churchId} AND (pm."fromPersonId"=${personId} OR pm."toPersonId"=${personId}) ORDER BY COALESCE(m."timeSent", c."dateCreated") DESC`.execute(this.db);
    return (result.rows as any[]).map((data: any) => this.rowToPrivateMessage(data));
  }

  public async loadByChurchId(churchId: string) {
    return this.db.selectFrom("privateMessages").selectAll()
      .where("churchId", "=", churchId)
      .execute();
  }

  public async loadByConversationId(churchId: string, conversationId: string) {
    return (await this.db.selectFrom("privateMessages").selectAll()
      .where("churchId", "=", churchId)
      .where("conversationId", "=", conversationId)
      .executeTakeFirst()) ?? null;
  }

  public async loadUndelivered() {
    const result = await this.db.selectFrom("privateMessages").selectAll()
      .where("notifyPersonId", "is not", null)
      .where((eb) =>
        eb.or([
          eb("deliveryMethod", "is", null),
          eb("deliveryMethod", "=", ""),
          eb("deliveryMethod", "=", "push"),
          eb("deliveryMethod", "=", "socket"),
          eb("deliveryMethod", "=", "email")
        ])
      )
      .execute();
    return (result || []).map((data: any) => this.rowToPrivateMessage(data));
  }

  public async markAllRead(churchId: string, personId: string) {
    await this.db.updateTable("privateMessages")
      .set({ notifyPersonId: null as any, deliveryMethod: "complete" })
      .where("churchId", "=", churchId)
      .where("notifyPersonId", "=", personId)
      .execute();
  }

  public async loadPendingEscalation() {
    return this.db.selectFrom("privateMessages").selectAll()
      .where("notifyPersonId", "is not", null)
      .where("deliveryMethod", "in", ["socket", "push"])
      .execute();
  }

  private rowToPrivateMessage(data: any) {
    return {
      id: data.pmId || data.id,
      churchId: data.churchId,
      fromPersonId: data.fromPersonId,
      toPersonId: data.toPersonId,
      conversationId: data.pmId ? data.id : data.conversationId,
      notifyPersonId: data.notifyPersonId,
      deliveryMethod: data.deliveryMethod,
      conversation: {
        id: data.id,
        churchId: data.churchId,
        contentType: data.contentType,
        contentId: data.contentId,
        title: data.title,
        dateCreated: data.dateCreated,
        groupId: data.groupId,
        visibility: data.visibility,
        firstPostId: data.firstPostId,
        lastPostId: data.lastPostId,
        postCount: data.postCount,
        allowAnonymousPosts: data.allowAnonymousPosts
      }
    };
  }

  public convertToModel(_churchId: string, data: any) {
    if (!data) return null;
    return this.rowToPrivateMessage(data);
  }

  public convertAllToModel(_churchId: string, data: any) {
    if (!Array.isArray(data)) return [];
    return data.map((row: any) => this.rowToPrivateMessage(row));
  }
}
