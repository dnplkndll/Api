import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class CuratedEventRepo extends KyselyRepo {
  protected readonly tableName = "curatedEvents";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async deleteByEventId(churchId: string, curatedCalendarId: string, eventId: string) {
    await this.db.deleteFrom("curatedEvents")
      .where("curatedCalendarId", "=", curatedCalendarId)
      .where("eventId", "=", eventId)
      .where("churchId", "=", churchId)
      .execute();
  }

  public async deleteByGroupId(churchId: string, curatedCalendarId: string, groupId: string) {
    await this.db.deleteFrom("curatedEvents")
      .where("curatedCalendarId", "=", curatedCalendarId)
      .where("groupId", "=", groupId)
      .where("churchId", "=", churchId)
      .execute();
  }

  public async loadByCuratedCalendarId(churchId: string, curatedCalendarId: string) {
    return this.db.selectFrom("curatedEvents").selectAll()
      .where("churchId", "=", churchId)
      .where("curatedCalendarId", "=", curatedCalendarId)
      .execute();
  }

  public async loadForEvents(curatedCalendarId: string, churchId: string) {
    const result = await sql`SELECT ce.id, ce."churchId", ce."curatedCalendarId", ce."groupId" as "curatedGroupId", ce."eventId", e."groupId", e.title, e.description, e.start, e.end, e."allDay", e."recurrenceRule", e.visibility FROM "curatedEvents" ce INNER JOIN events e ON (CASE WHEN ce."eventId" IS NULL THEN e."groupId"=ce."groupId" ELSE e.id=ce."eventId" END) where "curatedCalendarId"=${curatedCalendarId} AND ce."churchId"=${churchId} and e.visibility='public'`.execute(this.db);
    return result.rows as any[];
  }
}
