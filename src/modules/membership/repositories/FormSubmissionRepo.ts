import { injectable } from "inversify";
import { sql } from "kysely";
import { DateHelper } from "../helpers/index.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class FormSubmissionRepo extends KyselyRepo {
  protected readonly tableName = "formSubmissions";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      await sql`UPDATE "formSubmissions" SET "contentId"=${model.contentId}, "revisedBy"=${model.revisedBy}, "revisionDate"=NOW() WHERE id=${model.id} AND "churchId"=${model.churchId}`.execute(this.db);
    } else {
      model.id = this.createId();
      const submissionDate = DateHelper.toMysqlDate(model.submissionDate);
      const revisionDate = DateHelper.toMysqlDate(model.revisionDate);
      await this.db.insertInto(this.tableName).values({
        id: model.id,
        churchId: model.churchId,
        formId: model.formId,
        contentType: model.contentType,
        contentId: model.contentId,
        submissionDate,
        submittedBy: model.submittedBy,
        revisionDate,
        revisedBy: model.revisedBy
      }).execute();
    }
    return model;
  }

  public async loadForContent(churchId: string, contentType: string, contentId: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("contentType", "=", contentType)
      .where("contentId", "=", contentId)
      .execute();
  }

  public async loadByFormId(churchId: string, formId: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("formId", "=", formId)
      .execute();
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      formId: data.formId,
      contentType: data.contentType,
      contentId: data.contentId,
      submissionDate: data.submissionDate,
      submittedBy: data.submittedBy,
      revisionDate: data.revisionDate,
      revisedBy: data.revisedBy
    };
  }
}
