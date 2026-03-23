import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class NotificationRepo extends KyselyRepo {
  protected readonly tableName = "notifications";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      await this.db.updateTable("notifications").set({
        contentType: model.contentType,
        contentId: model.contentId,
        isNew: model.isNew,
        message: model.message,
        link: model.link,
        deliveryMethod: model.deliveryMethod,
        triggeredByPersonId: model.triggeredByPersonId
      }).where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await sql`INSERT INTO notifications (id, churchId, personId, contentType, contentId, message, link, deliveryMethod, triggeredByPersonId, timeSent, isNew) VALUES (${model.id}, ${model.churchId}, ${model.personId}, ${model.contentType}, ${model.contentId}, ${model.message}, ${model.link}, ${model.deliveryMethod}, ${model.triggeredByPersonId}, NOW(), 1)`.execute(this.db);
    }
    return model;
  }

  public async loadById(churchId: string, id: string) {
    return (await this.db.selectFrom("notifications").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }

  public async loadByPersonId(churchId: string, personId: string) {
    return this.db.selectFrom("notifications").selectAll()
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .orderBy("timeSent", "desc")
      .execute();
  }

  public async loadForEmail(frequency: string) {
    const result = await sql`SELECT DISTINCT n.churchId, n.personId FROM notifications n INNER JOIN notificationPreferences np on np.churchId=n.churchId and np.personId=n.personId WHERE n.deliveryMethod='email' AND np.emailFrequency=${frequency} AND n.timeSent>DATE_SUB(NOW(), INTERVAL 24 HOUR) LIMIT 200`.execute(this.db);
    return result.rows as any[];
  }

  public async loadByPersonIdForEmail(churchId: string, personId: string, frequency: string) {
    let timeCutoff = "DATE_SUB(NOW(), INTERVAL 24 HOUR)";
    if (frequency === "individual") timeCutoff = "DATE_SUB(NOW(), INTERVAL 30 MINUTE)";
    const result = await sql`SELECT * FROM notifications WHERE churchId=${churchId} AND personId=${personId} AND deliveryMethod='email' AND timeSent>=${sql.raw(timeCutoff)} ORDER BY timeSent`.execute(this.db);
    return result.rows as any[];
  }

  public async markRead(churchId: string, personId: string) {
    await this.db.updateTable("notifications")
      .set({ isNew: 0 as any, deliveryMethod: "complete" })
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .execute();
  }

  public async markAllRead(churchId: string, personId: string) {
    await this.db.updateTable("notifications")
      .set({ isNew: 0 as any, deliveryMethod: "complete" })
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .execute();
  }

  public async loadForPerson(churchId: string, personId: string) {
    return this.db.selectFrom("notifications").selectAll()
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .orderBy("timeSent", "desc")
      .execute();
  }

  public async loadNewCounts(churchId: string, personId: string) {
    const result = await sql`SELECT (SELECT COUNT(*) FROM notifications where churchId=${churchId} and personId=${personId} and isNew=1) AS notificationCount, (SELECT COUNT(*) FROM privateMessages where churchId=${churchId} and notifyPersonId=${personId}) AS pmCount`.execute(this.db);
    const row = (result.rows as any[])[0];
    return row || {};
  }

  public async loadUndelivered() {
    return this.db.selectFrom("notifications").selectAll()
      .where("isNew", "=", 1)
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
  }

  public async loadExistingUnread(churchId: string, contentType: string, contentId: string) {
    return this.db.selectFrom("notifications").selectAll()
      .where("churchId", "=", churchId)
      .where("contentType", "=", contentType)
      .where("contentId", "=", contentId)
      .where("isNew", "=", 1)
      .execute();
  }

  public async loadPendingEscalation() {
    return this.db.selectFrom("notifications").selectAll()
      .where("isNew", "=", 1)
      .where("deliveryMethod", "in", ["socket", "push"])
      .execute();
  }
}
