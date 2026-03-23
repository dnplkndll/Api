import { injectable } from "inversify";
import { sql } from "kysely";
import { DateHelper } from "../../../shared/helpers/DateHelper.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class VisitRepo extends KyselyRepo {
  protected readonly tableName = "visits";
  protected readonly moduleName = "attendance";
  protected readonly softDelete = false;

  public override async save(model: any) {
    const processedVisit = { ...model };
    if (processedVisit.visitDate) {
      processedVisit.visitDate = DateHelper.toMysqlDateOnly(processedVisit.visitDate);
    }
    if (processedVisit.checkinTime) {
      processedVisit.checkinTime = DateHelper.toMysqlDate(processedVisit.checkinTime);
    }
    return super.save(processedVisit);
  }

  public async loadAllByDate(churchId: string, startDate: Date, endDate: Date) {
    return this.db.selectFrom("visits").selectAll()
      .where("churchId", "=", churchId)
      .where("visitDate", ">=", DateHelper.toMysqlDateOnly(startDate) as any)
      .where("visitDate", "<=", DateHelper.toMysqlDateOnly(endDate) as any)
      .execute();
  }

  public async loadForSessionPerson(churchId: string, sessionId: string, personId: string) {
    const result = await sql`
      SELECT v.*
      FROM sessions s
      LEFT OUTER JOIN serviceTimes st on st.id = s.serviceTimeId
      INNER JOIN visits v on(v.serviceId = st.serviceId or v.groupId = s.groupId) and v.visitDate = s.sessionDate
      WHERE v.churchId=${churchId} AND s.id = ${sessionId} AND v.personId=${personId} LIMIT 1
    `.execute(this.db);
    return (result.rows as any[])[0] ?? null;
  }

  public async loadByServiceDatePeopleIds(churchId: string, serviceId: string, visitDate: Date, peopleIds: string[]) {
    const vsDate = DateHelper.toMysqlDateOnly(visitDate);
    return this.db.selectFrom("visits").selectAll()
      .where("churchId", "=", churchId)
      .where("serviceId", "=", serviceId)
      .where("visitDate", "=", vsDate as any)
      .where("personId", "in", peopleIds)
      .execute();
  }

  public async loadLastLoggedDate(churchId: string, serviceId: string, peopleIds: string[]) {
    let result = new Date();
    result.setHours(0, 0, 0, 0);

    const data = await this.db.selectFrom("visits")
      .select(sql`max(visitDate)`.as("visitDate"))
      .where("churchId", "=", churchId)
      .where("serviceId", "=", serviceId)
      .where("personId", "in", peopleIds)
      .executeTakeFirst();

    if ((data as any)?.visitDate) result = new Date((data as any).visitDate);
    return result;
  }

  public async loadForPerson(churchId: string, personId: string) {
    return this.db.selectFrom("visits").selectAll()
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .execute();
  }

  public async loadConsecutiveWeekStreaks(churchId: string, personIds: string[]): Promise<Record<string, number>> {
    if (personIds.length === 0) return {};
    const result = await sql`
      SELECT personId, YEARWEEK(visitDate, 3) AS yw
      FROM visits
      WHERE churchId = ${churchId} AND personId IN (${sql.join(personIds)})
      GROUP BY personId, yw
      ORDER BY personId, yw DESC
    `.execute(this.db);
    const rows = result.rows as any[];

    const byPerson: Record<string, number[]> = {};
    for (const row of rows) {
      if (!byPerson[row.personId]) byPerson[row.personId] = [];
      byPerson[row.personId].push(row.yw);
    }

    const currentYw = this.getIsoYearWeek(new Date());
    const streaks: Record<string, number> = {};
    for (const personId of personIds) {
      const weeks = byPerson[personId] || [];
      streaks[personId] = this.countConsecutiveWeeks(weeks, currentYw);
    }
    return streaks;
  }

  private getIsoYearWeek(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return d.getUTCFullYear() * 100 + weekNo;
  }

  private countConsecutiveWeeks(sortedWeeksDesc: number[], currentYw: number): number {
    if (sortedWeeksDesc.length === 0 || sortedWeeksDesc[0] !== currentYw) return 0;
    let streak = 1;
    let expectedYw = currentYw;
    for (let i = 1; i < sortedWeeksDesc.length; i++) {
      expectedYw = this.previousIsoWeek(expectedYw);
      if (sortedWeeksDesc[i] === expectedYw) streak++;
      else break;
    }
    return streak;
  }

  private previousIsoWeek(yw: number): number {
    const year = Math.floor(yw / 100);
    const week = yw % 100;
    if (week > 1) return year * 100 + (week - 1);
    const dec28 = new Date(Date.UTC(year - 1, 11, 28));
    dec28.setUTCDate(dec28.getUTCDate() + 4 - (dec28.getUTCDay() || 7));
    const lastYearStart = new Date(Date.UTC(dec28.getUTCFullYear(), 0, 1));
    const lastWeek = Math.ceil((((dec28.getTime() - lastYearStart.getTime()) / 86400000) + 1) / 7);
    return (year - 1) * 100 + lastWeek;
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      personId: data.personId,
      serviceId: data.serviceId,
      groupId: data.groupId,
      visitDate: data.visitDate,
      checkinTime: data.checkinTime
    };
  }
}
