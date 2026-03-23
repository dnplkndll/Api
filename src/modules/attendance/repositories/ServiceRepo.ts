import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class ServiceRepo extends KyselyRepo {
  protected readonly tableName = "services";
  protected readonly moduleName = "attendance";
  protected readonly softDelete = true;

  public override async loadAll(churchId: string) {
    return this.db.selectFrom("services").selectAll()
      .where("churchId", "=", churchId).where("removed", "=", 0)
      .orderBy("name").execute();
  }

  public async loadWithCampus(churchId: string) {
    const result = await sql`
      SELECT s.*, c.name as campusName FROM services s
      INNER JOIN campuses c on c.id=s.campusId
      WHERE s.churchId=${churchId} AND s.removed=0 and c.removed=0
      ORDER BY c.name, s.name
    `.execute(this.db);
    return this.convertAllToModel(churchId, result.rows as any[]);
  }

  public async searchByCampus(churchId: string, campusId: string) {
    const result = await sql`
      SELECT * FROM services WHERE churchId=${churchId} AND (${campusId}=0 OR CampusId=${campusId}) AND removed=0 ORDER by name
    `.execute(this.db);
    return this.convertAllToModel(churchId, result.rows as any[]);
  }

  public convertToModel(_churchId: string, data: any) {
    const result: any = { id: data.id, campusId: data.campusId, name: data.name };
    if (data.campusName !== undefined) result.campus = { id: result.campusId, name: data.campusName };
    return result;
  }
}
