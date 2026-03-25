import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class ServiceTimeRepo extends KyselyRepo {
  protected readonly tableName = "serviceTimes";
  protected readonly moduleName = "attendance";
  protected readonly softDelete = true;

  public override async loadAll(churchId: string) {
    return this.db.selectFrom("serviceTimes").selectAll()
      .where("churchId", "=", churchId).where("removed", "=", false as any)
      .orderBy("name").execute();
  }

  public async loadNamesWithCampusService(churchId: string) {
    const result = await sql`
      SELECT st.*, concat(c.name, ' - ', s.name, ' - ', st.name) as "longName"
      FROM "serviceTimes" st
      INNER JOIN services s on s.id=st."serviceId"
      INNER JOIN campuses c on c.id=s."campusId"
      WHERE s."churchId"=${churchId} AND st.removed=false AND s.removed=false AND c.removed=false
      ORDER BY c.name, s.name, st.name
    `.execute(this.db);
    return this.convertAllToModel(churchId, result.rows as any[]);
  }

  public async loadNamesByServiceId(churchId: string, serviceId: string) {
    const result = await sql`
      SELECT st.*, concat(c.name, ' - ', s.name, ' - ', st.name) as "longName"
      FROM "serviceTimes" st
      INNER JOIN services s on s.id=st."serviceId"
      INNER JOIN campuses c on c.id=s."campusId"
      WHERE s."churchId"=${churchId} AND s.id=${serviceId} AND st.removed=false
      ORDER BY c.name, s.name, st.name
    `.execute(this.db);
    return this.convertAllToModel(churchId, result.rows as any[]);
  }

  public async loadByChurchCampusService(churchId: string, campusId: string, serviceId: string) {
    let q = this.db.selectFrom("serviceTimes as st")
      .leftJoin("services as s", "s.id", "st.serviceId")
      .selectAll("st")
      .where("st.churchId", "=", churchId)
      .where("st.removed", "=", false as any);
    if (serviceId && serviceId !== "0") {
      q = q.where("st.serviceId", "=", serviceId);
    }
    if (campusId && campusId !== "0") {
      q = q.where("s.campusId", "=", campusId);
    }
    const rows = await q.execute();
    return this.convertAllToModel(churchId, rows as any[]);
  }

  public convertToModel(_churchId: string, data: any) {
    return { id: data.id, serviceId: data.serviceId, name: data.name, longName: data.longName };
  }
}
