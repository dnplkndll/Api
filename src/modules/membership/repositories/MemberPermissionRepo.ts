import { injectable } from "inversify";
import { sql } from "kysely";
import { MemberPermission } from "../models/index.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class MemberPermissionRepo extends KyselyRepo {
  protected readonly tableName = "memberPermissions";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async deleteByMemberId(churchId: string, memberId: string, contentId: string) {
    await this.db.deleteFrom(this.tableName)
      .where("memberId", "=", memberId)
      .where("contentId", "=", contentId)
      .where("churchId", "=", churchId)
      .execute();
  }

  public async loadMyByForm(churchId: string, formId: string, personId: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("contentType", "=", "form")
      .where("contentId", "=", formId)
      .where("memberId", "=", personId)
      .executeTakeFirst() ?? null;
  }

  public async loadByEmailNotification(churchId: string, contentType: string, contentId: string, emailNotification: boolean) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("contentType", "=", contentType)
      .where("contentId", "=", contentId)
      .where("emailNotification", "=", emailNotification)
      .execute();
  }

  public async loadFormsByPerson(churchId: string, personId: string) {
    const result = await sql`SELECT mp.*, p."displayName" as "personName"
      FROM "memberPermissions" mp
      INNER JOIN people p on p.id=mp."memberId" AND (p.removed=false OR p.removed IS NULL)
      WHERE mp."churchId"=${churchId} AND mp."memberId"=${personId}
      ORDER BY mp.action, mp."emailNotification" desc`.execute(this.db);
    return result.rows;
  }

  public async loadPeopleByForm(churchId: string, formId: string) {
    const result = await sql`SELECT mp.*, p."displayName" as "personName"
      FROM "memberPermissions" mp
      INNER JOIN people p on p.id=mp."memberId" AND (p.removed=false OR p.removed IS NULL)
      WHERE mp."churchId"=${churchId} AND mp."contentId"=${formId}
      ORDER BY mp.action, mp."emailNotification" desc`.execute(this.db);
    return result.rows;
  }

  public convertToModel(_churchId: string, data: any): MemberPermission {
    return {
      id: data.id,
      churchId: data.churchId,
      memberId: data.memberId,
      contentType: data.contentType,
      contentId: data.contentId,
      action: data.action,
      personName: data.personName,
      emailNotification: data.emailNotification
    };
  }

  private async existingPermissionRecord(churchId: string, contentId: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("contentId", "=", contentId)
      .where("churchId", "=", churchId)
      .executeTakeFirst() ?? null;
  }
}
