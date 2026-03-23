import { DateHelper, UniqueIdHelper } from "@churchapps/apihelper";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class EventRepo extends KyselyRepo {
  protected readonly tableName = "events";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.start) model.start = DateHelper.toMysqlDate(model.start);
    if (model.end) model.end = DateHelper.toMysqlDate(model.end);
    if (model.registrationOpenDate) model.registrationOpenDate = DateHelper.toMysqlDate(model.registrationOpenDate);
    if (model.registrationCloseDate) model.registrationCloseDate = DateHelper.toMysqlDate(model.registrationCloseDate);

    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable("events").set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await this.db.insertInto("events").values(model).execute();
    }
    return model;
  }

  public async loadAll(churchId: string) {
    return this.db.selectFrom("events").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("start")
      .execute();
  }

  public async loadTimelineGroup(churchId: string, groupId: string, eventIds: string[]) {
    let q = sql`select *, 'event' as postType, id as postId from events where churchId=${churchId} AND ((groupId = ${groupId} and (end>curdate() or recurrenceRule IS NOT NULL))`;
    if (eventIds.length > 0) {
      q = sql`${q} OR id IN (${sql.join(eventIds)})`;
    }
    q = sql`${q})`;
    const result = await q.execute(this.db);
    return result.rows as any[];
  }

  public async loadTimeline(churchId: string, groupIds: string[], eventIds: string[]) {
    let q = sql`select *, 'event' as postType, id as postId from events where churchId=${churchId} AND (((groupId IN (${sql.join(groupIds)}) OR groupId IN (SELECT groupId FROM curatedEvents WHERE churchId=${churchId} AND eventId IS NULL) OR id IN (SELECT eventId from curatedEvents WHERE churchId=${churchId})) and (end>curdate() or recurrenceRule IS NOT NULL))`;
    if (eventIds.length > 0) {
      q = sql`${q} OR id IN (${sql.join(eventIds)})`;
    }
    q = sql`${q})`;
    const result = await q.execute(this.db);
    return result.rows as any[];
  }

  public async loadForGroup(churchId: string, groupId: string) {
    return this.db.selectFrom("events").selectAll()
      .where("groupId", "=", groupId)
      .where("churchId", "=", churchId)
      .orderBy("start")
      .execute();
  }

  public async loadPublicForGroup(churchId: string, groupId: string) {
    return this.db.selectFrom("events").selectAll()
      .where("groupId", "=", groupId)
      .where("churchId", "=", churchId)
      .where("visibility", "=", "public")
      .orderBy("start")
      .execute();
  }

  public async loadByTag(churchId: string, tag: string) {
    return this.db.selectFrom("events").selectAll()
      .where("churchId", "=", churchId)
      .where("tags", "like", "%" + tag + "%")
      .orderBy("start")
      .execute();
  }

  public async loadRegistrationEnabled(churchId: string) {
    return this.db.selectFrom("events").selectAll()
      .where("churchId", "=", churchId)
      .where("registrationEnabled", "=", 1)
      .orderBy("start")
      .execute();
  }
}
