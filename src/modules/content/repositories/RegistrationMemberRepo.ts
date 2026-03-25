import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class RegistrationMemberRepo extends KyselyRepo {
  protected readonly tableName = "registrationMembers";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async loadForRegistration(churchId: string, registrationId: string) {
    return this.db.selectFrom("registrationMembers").selectAll()
      .where("churchId", "=", churchId)
      .where("registrationId", "=", registrationId)
      .execute();
  }

  public async loadForEvent(churchId: string, eventId: string) {
    const result = await sql`SELECT rm.* FROM "registrationMembers" rm INNER JOIN registrations r ON rm."registrationId"=r.id WHERE r."churchId"=${churchId} AND r."eventId"=${eventId}`.execute(this.db);
    return result.rows as any[];
  }

  public async deleteForRegistration(churchId: string, registrationId: string) {
    await this.db.deleteFrom("registrationMembers")
      .where("churchId", "=", churchId)
      .where("registrationId", "=", registrationId)
      .execute();
  }
}
