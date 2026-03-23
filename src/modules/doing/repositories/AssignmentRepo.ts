import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class AssignmentRepo extends KyselyRepo {
  protected readonly tableName = "assignments";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public async deleteByPlanId(churchId: string, planId: string) {
    await sql`DELETE FROM assignments WHERE churchId=${churchId} and positionId IN (SELECT id from positions WHERE planId=${planId})`.execute(this.db);
  }

  public async loadByPlanId(churchId: string, planId: string): Promise<any[]> {
    const result = await sql`
      SELECT a.* FROM assignments a INNER JOIN positions p on p.id=a.positionId
      WHERE a.churchId=${churchId} AND p.planId=${planId}
    `.execute(this.db);
    return result.rows as any[];
  }

  public async loadByPlanIds(churchId: string, planIds: string[]) {
    const result = await sql`
      SELECT a.* FROM assignments a INNER JOIN positions p on p.id=a.positionId
      WHERE a.churchId=${churchId} AND p.planId IN (${sql.join(planIds)})
    `.execute(this.db);
    return result.rows;
  }

  public async loadLastServed(churchId: string) {
    const result = await sql`
      select a.personId, max(pl.serviceDate) as serviceDate
      from assignments a
      inner join positions p on p.id = a.positionId
      inner join plans pl on pl.id = p.planId
      where a.churchId=${churchId}
      group by a.personId
      order by max(pl.serviceDate)
    `.execute(this.db);
    return result.rows;
  }

  public async loadByByPersonId(churchId: string, personId: string) {
    return this.db.selectFrom("assignments").selectAll()
      .where("churchId", "=", churchId).where("personId", "=", personId).execute();
  }

  public async loadUnconfirmedByServiceDateRange(churchId?: string) {
    if (churchId) {
      const result = await sql`
        SELECT a.*, pl.serviceDate, pl.name as planName
        FROM assignments a
        INNER JOIN positions p ON p.id = a.positionId
        INNER JOIN plans pl ON pl.id = p.planId
        WHERE a.status = 'Unconfirmed'
        AND pl.serviceDate >= DATE_ADD(CURDATE(), INTERVAL 2 DAY)
        AND pl.serviceDate < DATE_ADD(CURDATE(), INTERVAL 3 DAY)
        AND a.churchId = ${churchId}
      `.execute(this.db);
      return result.rows;
    } else {
      const result = await sql`
        SELECT a.*, pl.serviceDate, pl.name as planName
        FROM assignments a
        INNER JOIN positions p ON p.id = a.positionId
        INNER JOIN plans pl ON pl.id = p.planId
        WHERE a.status = 'Unconfirmed'
        AND pl.serviceDate >= DATE_ADD(CURDATE(), INTERVAL 2 DAY)
        AND pl.serviceDate < DATE_ADD(CURDATE(), INTERVAL 3 DAY)
      `.execute(this.db);
      return result.rows;
    }
  }

  public async countByPositionId(churchId: string, positionId: string) {
    const result = await sql`
      SELECT COUNT(*) as cnt FROM assignments
      WHERE churchId=${churchId} AND positionId=${positionId} AND status IN ('Accepted','Unconfirmed')
    `.execute(this.db);
    return (result.rows as any[])[0] ?? null;
  }

  public async loadByServiceDate(churchId: string, serviceDate: Date, excludePlanId?: string) {
    if (excludePlanId) {
      const result = await sql`
        SELECT a.* FROM assignments a
        INNER JOIN positions p ON p.id = a.positionId
        INNER JOIN plans pl ON pl.id = p.planId
        WHERE a.churchId = ${churchId} AND DATE(pl.serviceDate) = DATE(${serviceDate})
        AND pl.id != ${excludePlanId}
      `.execute(this.db);
      return result.rows;
    } else {
      const result = await sql`
        SELECT a.* FROM assignments a
        INNER JOIN positions p ON p.id = a.positionId
        INNER JOIN plans pl ON pl.id = p.planId
        WHERE a.churchId = ${churchId} AND DATE(pl.serviceDate) = DATE(${serviceDate})
      `.execute(this.db);
      return result.rows;
    }
  }
}
