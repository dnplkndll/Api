import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class MessageRepo extends KyselyRepo {
  protected readonly tableName = "messages";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      await this.db.updateTable("messages").set({
        personId: model.personId,
        displayName: model.displayName,
        content: model.content,
        timeUpdated: model.timeUpdated
      }).where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await sql`INSERT INTO messages (id, "churchId", "conversationId", "personId", "displayName", "messageType", content, "timeSent") VALUES (${model.id}, ${model.churchId}, ${model.conversationId}, ${model.personId}, ${model.displayName}, ${model.messageType}, ${model.content}, NOW())`.execute(this.db);
    }
    return model;
  }

  // Returns {} not null — deliberate behavior preserved
  public async loadById(churchId: string, id: string) {
    const result = await this.db.selectFrom("messages").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst();
    return result || {};
  }

  public async loadByIds(churchId: string, ids: string[]) {
    const result = await this.db.selectFrom("messages").selectAll()
      .where("id", "in", ids)
      .where("churchId", "=", churchId)
      .execute();
    return result || [];
  }

  public async loadForConversation(churchId: string, conversationId: string) {
    const result = await this.db.selectFrom("messages").selectAll()
      .where("churchId", "=", churchId)
      .where("conversationId", "=", conversationId)
      .orderBy("timeSent")
      .execute();
    return result || [];
  }

  public async loadForConversationPaginated(
    churchId: string,
    conversationId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const offset = (page - 1) * limit;
    const result = await this.db.selectFrom("messages").selectAll()
      .where("churchId", "=", churchId)
      .where("conversationId", "=", conversationId)
      .orderBy("timeSent", "desc")
      .limit(limit)
      .offset(offset)
      .execute();
    return result || [];
  }

  public convertToModel(_churchId: string, data: any) {
    if (!data) return null;
    return { id: data.id, churchId: data.churchId, conversationId: data.conversationId, displayName: data.displayName, timeSent: data.timeSent, messageType: data.messageType, content: data.content, personId: data.personId, timeUpdated: data.timeUpdated };
  }
}
