import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class VisitSessionRepo extends KyselyRepo {
  protected readonly tableName = "visitSessions";
  protected readonly moduleName = "attendance";
  protected readonly softDelete = false;

  public async loadByVisitIdSessionId(churchId: string, visitId: string, sessionId: string) {
    return await this.db.selectFrom("visitSessions").selectAll()
      .where("churchId", "=", churchId)
      .where("visitId", "=", visitId)
      .where("sessionId", "=", sessionId)
      .limit(1)
      .executeTakeFirst() ?? null;
  }

  public async loadByVisitIds(churchId: string, visitIds: string[]) {
    return this.db.selectFrom("visitSessions").selectAll()
      .where("churchId", "=", churchId)
      .where("visitId", "in", visitIds)
      .execute();
  }

  public async loadByVisitId(churchId: string, visitId: string) {
    return this.db.selectFrom("visitSessions").selectAll()
      .where("churchId", "=", churchId)
      .where("visitId", "=", visitId)
      .execute();
  }

  public async loadForSessionPerson(churchId: string, sessionId: string, personId: string) {
    const result = await sql`
      SELECT v.*
      FROM sessions s
      LEFT OUTER JOIN "serviceTimes" st on st.id = s."serviceTimeId"
      INNER JOIN visits v on(v."serviceId" = st."serviceId" or v."groupId" = s."groupId") and v."visitDate" = s."sessionDate"
      WHERE v."churchId"=${churchId} AND s.id = ${sessionId} AND v."personId"=${personId} LIMIT 1
    `.execute(this.db);
    return (result.rows as any[])[0] ?? null;
  }

  public async loadForSession(churchId: string, sessionId: string) {
    const result = await sql`
      SELECT vs.*, v."personId"
      FROM "visitSessions" vs
      INNER JOIN visits v on v.id = vs."visitId"
      WHERE vs."churchId"=${churchId} AND vs."sessionId" = ${sessionId}
    `.execute(this.db);
    return result.rows;
  }

  public convertToModel(_churchId: string, data: any) {
    const result: any = { id: data.id, visitId: data.visitId, sessionId: data.sessionId };
    if (data.personId !== undefined) {
      result.visit = { id: result.visitId, personId: data.personId };
    }
    return result;
  }
}
