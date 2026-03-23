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
      .where("churchId", "=", churchId).where("removed", "=", 0)
      .orderBy("name").execute();
  }

  public async loadNamesWithCampusService(churchId: string) {
    const result = await sql`
      SELECT st.*, concat(c.name, ' - ', s.name, ' - ', st.name) as longName
      FROM serviceTimes st
      INNER JOIN services s on s.Id=st.serviceId
      INNER JOIN campuses c on c.Id=s.campusId
      WHERE s.churchId=${churchId} AND st.removed=0 AND s.removed=0 AND c.removed=0
      ORDER BY c.name, s.name, st.name
    `.execute(this.db);
    return this.convertAllToModel(churchId, result.rows as any[]);
  }

  public async loadNamesByServiceId(churchId: string, serviceId: string) {
    const result = await sql`
      SELECT st.*, concat(c.name, ' - ', s.name, ' - ', st.name) as longName
      FROM serviceTimes st
      INNER JOIN services s on s.id=st.serviceId
      INNER JOIN campuses c on c.id=s.campusId
      WHERE s.churchId=${churchId} AND s.id=${serviceId} AND st.removed=0
      ORDER BY c.name, s.name, st.name
    `.execute(this.db);
    return this.convertAllToModel(churchId, result.rows as any[]);
  }

  public async loadByChurchCampusService(churchId: string, campusId: string, serviceId: string) {
    const result = await sql`
      SELECT st.*
      FROM serviceTimes st
      LEFT OUTER JOIN services s on s.id=st.serviceId
      WHERE st.churchId = ${churchId} AND (${serviceId}=0 OR st.serviceId=${serviceId}) AND (${campusId} = 0 OR s.campusId = ${campusId}) AND st.removed=0
    `.execute(this.db);
    return this.convertAllToModel(churchId, result.rows as any[]);
  }

  public convertToModel(_churchId: string, data: any) {
    return { id: data.id, serviceId: data.serviceId, name: data.name, longName: data.longName };
  }
}
