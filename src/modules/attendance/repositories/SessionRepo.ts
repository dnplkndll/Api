import { injectable } from "inversify";
import { sql } from "kysely";
import { DateHelper } from "../../../shared/helpers/DateHelper.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class SessionRepo extends KyselyRepo {
  protected readonly tableName = "sessions";
  protected readonly moduleName = "attendance";
  protected readonly softDelete = false;

  public override async loadAll(churchId: string) {
    return this.db.selectFrom("sessions").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("sessionDate", "desc").execute();
  }

  public override async save(model: any) {
    const processedModel = { ...model };
    if (processedModel.sessionDate) {
      processedModel.sessionDate = DateHelper.toMysqlDateOnly(processedModel.sessionDate);
    }
    return super.save(processedModel);
  }

  public async loadByIds(churchId: string, ids: string[]) {
    const result = await this.db.selectFrom("sessions").selectAll()
      .where("churchId", "=", churchId)
      .where("id", "in", ids)
      .execute();
    return this.convertAllToModel(churchId, result);
  }

  public async loadByGroupServiceTimeDate(churchId: string, groupId: string, serviceTimeId: string, sessionDate: Date) {
    const sessDate = DateHelper.toMysqlDateOnly(sessionDate);
    const result = await this.db.selectFrom("sessions").selectAll()
      .where("churchId", "=", churchId)
      .where("groupId", "=", groupId)
      .where("serviceTimeId", "=", serviceTimeId)
      .where("sessionDate", "=", sessDate as any)
      .executeTakeFirst() ?? null;
    return result ? this.convertToModel(churchId, result) : null;
  }

  public async loadByGroupIdWithNames(churchId: string, groupId: string) {
    const result = await sql`
      select s.id,
        CASE
          WHEN st.name IS NULL THEN DATE_FORMAT(sessionDate, '%m/%d/%Y')
          ELSE concat(DATE_FORMAT(sessionDate, '%m/%d/%Y'), ' - ', st.name)
        END AS displayName
      FROM sessions s
      LEFT OUTER JOIN serviceTimes st on st.id = s.serviceTimeId
      WHERE s.churchId=${churchId} AND s.groupId=${groupId}
      ORDER by s.sessionDate desc
    `.execute(this.db);
    return this.convertAllToModel(churchId, result.rows as any[]);
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      groupId: data.groupId,
      serviceTimeId: data.serviceTimeId,
      sessionDate: data.sessionDate,
      displayName: data.displayName
    };
  }
}
