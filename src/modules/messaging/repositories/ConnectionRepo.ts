import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { ViewerInterface } from "../helpers/Interfaces.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class ConnectionRepo extends KyselyRepo {
  protected readonly tableName = "connections";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      const { id: _id, churchId: _cid, conversationId: _conv, socketId: _sock, ipAddress: _ip, timeJoined: _tj, ...setData } = model;
      await this.db.updateTable("connections").set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await this.deleteExisting(model.churchId, model.conversationId, model.socketId, model.id);
      await sql`INSERT INTO connections (id, "churchId", "conversationId", "personId", "displayName", "socketId", "ipAddress", "timeJoined") VALUES (${model.id}, ${model.churchId}, ${model.conversationId}, ${model.personId}, ${model.displayName}, ${model.socketId}, ${model.ipAddress}, NOW())`.execute(this.db);
    }
    return model;
  }

  public async loadAttendance(churchId: string, conversationId: string) {
    const result = await this.db.selectFrom("connections")
      .select(["id", "displayName", "ipAddress"])
      .where("churchId", "=", churchId)
      .where("conversationId", "=", conversationId)
      .orderBy("displayName")
      .execute();
    const data: ViewerInterface[] = (result || []) as any;
    data.forEach((d: ViewerInterface) => {
      if (d.displayName === "") d.displayName = "Anonymous";
    });
    return data;
  }

  // Returns {} not null — deliberate behavior preserved
  public async loadById(churchId: string, id: string) {
    const result = await this.db.selectFrom("connections").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst();
    return result || {};
  }

  public async loadForConversation(churchId: string, conversationId: string) {
    const result = await this.db.selectFrom("connections").selectAll()
      .where("churchId", "=", churchId)
      .where("conversationId", "=", conversationId)
      .execute();
    return result || [];
  }

  public async loadForNotification(churchId: string, personId: string) {
    const result = await this.db.selectFrom("connections").selectAll()
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .where("conversationId", "=", "alerts")
      .execute();
    return result || [];
  }

  public async loadBySocketId(socketId: string) {
    const result = await this.db.selectFrom("connections").selectAll()
      .where("socketId", "=", socketId)
      .execute();
    return result || [];
  }

  public async delete(churchId: string, id: string) {
    await this.db.deleteFrom("connections")
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .execute();
  }

  public async deleteForSocket(socketId: string) {
    await this.db.deleteFrom("connections")
      .where("socketId", "=", socketId)
      .execute();
  }

  public async deleteExisting(churchId: string, conversationId: string, socketId: string, id: string) {
    await this.db.deleteFrom("connections")
      .where("churchId", "=", churchId)
      .where("conversationId", "=", conversationId)
      .where("socketId", "=", socketId)
      .where("id", "<>", id)
      .execute();
  }

  public convertToModel(_churchId: string, data: any) {
    if (!data) return null;
    return { id: data.id, churchId: data.churchId, conversationId: data.conversationId, personId: data.personId, displayName: data.displayName, timeJoined: data.timeJoined, socketId: data.socketId, ipAddress: data.ipAddress };
  }
}
