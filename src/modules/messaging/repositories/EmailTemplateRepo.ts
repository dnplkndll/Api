import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class EmailTemplateRepo extends KyselyRepo {
  protected readonly tableName = "emailTemplates";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      await this.db.updateTable("emailTemplates").set({
        name: model.name,
        subject: model.subject,
        htmlContent: model.htmlContent,
        category: model.category,
        dateModified: sql`NOW()`
      }).where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await sql`INSERT INTO emailTemplates (id, churchId, name, subject, htmlContent, category, dateCreated, dateModified) VALUES (${model.id}, ${model.churchId}, ${model.name}, ${model.subject}, ${model.htmlContent}, ${model.category}, NOW(), NOW())`.execute(this.db);
    }
    return model;
  }

  public async loadByChurchId(churchId: string) {
    return this.db.selectFrom("emailTemplates")
      .select(["id", "churchId", "name", "subject", "category", "dateCreated", "dateModified"])
      .where("churchId", "=", churchId)
      .orderBy("name")
      .execute();
  }

  public async loadById(churchId: string, id: string) {
    return (await this.db.selectFrom("emailTemplates").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }
}
