import { injectable } from "inversify";
import { sql } from "kysely";
import { DateHelper } from "../helpers/index.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class FormRepo extends KyselyRepo {
  protected readonly tableName = "forms";
  protected readonly moduleName = "membership";
  protected readonly softDelete = true;

  public async save(model: any) {
    if (model.id) {
      model.accessStartTime = model.accessStartTime ? DateHelper.toMysqlDate(model.accessStartTime) : null;
      model.accessEndTime = model.accessEndTime ? DateHelper.toMysqlDate(model.accessEndTime) : null;
      await sql`UPDATE forms SET name=${model.name}, "contentType"=${model.contentType}, restricted=${model.restricted}, "accessStartTime"=${model.accessStartTime}, "accessEndTime"=${model.accessEndTime}, archived=${model.archived}, "thankYouMessage"=${model.thankYouMessage}, "modifiedTime"=NOW() WHERE id=${model.id} AND "churchId"=${model.churchId}`.execute(this.db);
    } else {
      model.id = this.createId();
      model.accessStartTime = model.accessStartTime ? DateHelper.toMysqlDate(model.accessStartTime) : null;
      model.accessEndTime = model.accessEndTime ? DateHelper.toMysqlDate(model.accessEndTime) : null;
      await sql`INSERT INTO forms (id, "churchId", name, "contentType", "accessStartTime", "accessEndTime", restricted, "thankYouMessage", "createdTime", "modifiedTime", archived, removed) VALUES (${model.id}, ${model.churchId}, ${model.name}, ${model.contentType}, ${model.accessStartTime}, ${model.accessEndTime}, ${model.restricted}, ${model.thankYouMessage}, NOW(), NOW(), false, false)`.execute(this.db);
    }
    return model;
  }

  public async loadAllArchived(churchId: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("removed", "=", false as any)
      .where("archived", "=", true as any)
      .execute();
  }

  public async loadByIds(churchId: string, ids: string[]) {
    if (ids.length === 0) return [];
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("removed", "=", false as any)
      .where("archived", "=", false as any)
      .where("id", "in", ids)
      .orderBy("name")
      .execute();
  }

  public async loadNonMemberForms(churchId: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("contentType", "<>", "form")
      .where("churchId", "=", churchId)
      .where("removed", "=", false as any)
      .where("archived", "=", false as any)
      .execute();
  }

  public async loadNonMemberArchivedForms(churchId: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("contentType", "<>", "form")
      .where("churchId", "=", churchId)
      .where("removed", "=", false as any)
      .where("archived", "=", true as any)
      .execute();
  }

  public async loadMemberForms(churchId: string, personId: string) {
    const result = await sql`SELECT f.* , mp.action FROM forms f LEFT JOIN "memberPermissions" mp ON mp."contentId" = f.id WHERE mp."memberId"=${personId} AND f."churchId"=${churchId} AND f.removed=false AND f.archived=false`.execute(this.db);
    return result.rows;
  }

  public async loadMemberArchivedForms(churchId: string, personId: string) {
    const result = await sql`SELECT f.* FROM forms f LEFT JOIN "memberPermissions" mp ON mp."contentId" = f.id WHERE mp."memberId"=${personId} AND f."churchId"=${churchId} AND f.removed=false AND f.archived=true`.execute(this.db);
    return result.rows;
  }

  public async loadWithMemberPermissions(churchId: string, formId: string, personId: string) {
    const result = await sql`SELECT f.*, mp.action FROM forms f LEFT JOIN "memberPermissions" mp ON mp."contentId" = f.id WHERE f.id=${formId} AND f."churchId"=${churchId} AND mp."memberId"=${personId} AND f.removed=false AND f.archived=false`.execute(this.db);
    return (result.rows as any[])[0] ?? null;
  }

  public async access(id: string) {
    return await this.db.selectFrom(this.tableName)
      .select(["id", "name", "restricted", "churchId"])
      .where("id", "=", id)
      .where("removed", "=", false as any)
      .where("archived", "=", false as any)
      .executeTakeFirst() ?? null;
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      name: data.name,
      contentType: data.contentType,
      createdTime: data.createdTime,
      modifiedTime: data.modifiedTime,
      accessStartTime: data.accessStartTime,
      accessEndTime: data.accessEndTime,
      restricted: data.restricted,
      archived: data.archived,
      action: data.action,
      thankYouMessage: data.thankYouMessage
    };
  }
}
