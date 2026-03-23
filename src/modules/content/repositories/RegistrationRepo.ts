import { DateHelper, UniqueIdHelper } from "@churchapps/apihelper";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class RegistrationRepo extends KyselyRepo {
  protected readonly tableName = "registrations";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.registeredDate) model.registeredDate = DateHelper.toMysqlDate(model.registeredDate);
    if (model.cancelledDate) model.cancelledDate = DateHelper.toMysqlDate(model.cancelledDate);

    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable("registrations").set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await this.db.insertInto("registrations").values(model).execute();
    }
    return model;
  }

  public async loadForEvent(churchId: string, eventId: string) {
    return this.db.selectFrom("registrations").selectAll()
      .where("churchId", "=", churchId)
      .where("eventId", "=", eventId)
      .orderBy("registeredDate")
      .execute();
  }

  public async loadForPerson(churchId: string, personId: string) {
    return this.db.selectFrom("registrations").selectAll()
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .orderBy("registeredDate", "desc")
      .execute();
  }

  public async loadForHousehold(churchId: string, householdId: string) {
    return this.db.selectFrom("registrations").selectAll()
      .where("churchId", "=", churchId)
      .where("householdId", "=", householdId)
      .orderBy("registeredDate", "desc")
      .execute();
  }

  public async countActiveForEvent(churchId: string, eventId: string): Promise<number> {
    const result = await sql`SELECT COUNT(*) as cnt FROM registrations WHERE churchId=${churchId} AND eventId=${eventId} AND status IN ('pending','confirmed')`.execute(this.db);
    const row = (result.rows as any[])[0];
    return row?.cnt || 0;
  }

  public async atomicInsertWithCapacityCheck(registration: any, capacity: number | null): Promise<boolean> {
    const m: any = { ...registration };
    if (!m.id) m.id = UniqueIdHelper.shortId();
    if (m.registeredDate) m.registeredDate = DateHelper.toMysqlDate(m.registeredDate);

    if (capacity === null || capacity === undefined) {
      await this.db.insertInto("registrations").values(m).execute();
      registration.id = m.id;
      return true;
    }

    const result: any = await sql`INSERT INTO registrations (id, churchId, eventId, personId, householdId, status, formSubmissionId, notes, registeredDate, cancelledDate) SELECT ${m.id}, ${m.churchId}, ${m.eventId}, ${m.personId || null}, ${m.householdId || null}, ${m.status || "confirmed"}, ${m.formSubmissionId || null}, ${m.notes || null}, ${m.registeredDate || null}, ${m.cancelledDate || null} FROM dual WHERE (SELECT COUNT(*) FROM registrations WHERE eventId=${m.eventId} AND churchId=${m.churchId} AND status IN ('pending','confirmed')) < ${capacity}`.execute(this.db);
    if (result?.numAffectedRows > 0n || result?.numUpdatedOrDeletedRows > 0n) {
      registration.id = m.id;
      return true;
    }
    return false;
  }
}
