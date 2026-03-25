import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class GroupServiceTimeRepo extends KyselyRepo {
  protected readonly tableName = "groupServiceTimes";
  protected readonly moduleName = "attendance";
  protected readonly softDelete = false;

  public async loadWithServiceNames(churchId: string, groupId: string) {
    const result = await sql`
      SELECT gst.*, concat(c.name, ' - ', s.name, ' - ', st.name) as "serviceTimeName"
      FROM "groupServiceTimes" gst
      INNER JOIN "serviceTimes" st on st.id = gst."serviceTimeId"
      INNER JOIN services s on s.id = st."serviceId"
      INNER JOIN campuses c on c.id = s."campusId"
      WHERE gst."churchId"=${churchId} AND gst."groupId"=${groupId}
    `.execute(this.db);
    return result.rows;
  }

  public async loadByServiceTimeIds(churchId: string, serviceTimeIds: string[]) {
    return this.db.selectFrom("groupServiceTimes").selectAll()
      .where("churchId", "=", churchId)
      .where("serviceTimeId", "in", serviceTimeIds)
      .execute();
  }

  public convertToModel(_churchId: string, data: any) {
    const result: any = { id: data.id, groupId: data.groupId, serviceTimeId: data.serviceTimeId };
    if (data.serviceTimeName !== undefined) result.serviceTime = { id: result.serviceTimeId, name: data.serviceTimeName };
    return result;
  }
}
