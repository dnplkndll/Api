import { injectable } from "inversify";
import { sql } from "kysely";
import { Question } from "../models/index.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class QuestionRepo extends KyselyRepo {
  protected readonly tableName = "questions";
  protected readonly moduleName = "membership";
  protected readonly softDelete = true;

  public async save(model: any) {
    const choices = JSON.stringify(model.choices);
    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      setData.choices = choices;
      await this.db.updateTable(this.tableName).set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = this.createId();
      await this.db.insertInto(this.tableName).values({
        ...model,
        choices,
        removed: 0
      }).execute();
    }
    return model;
  }

  public async delete(churchId: string, id: string) {
    const question = await this.db.selectFrom(this.tableName)
      .select(["formId", "sort"])
      .where("id", "=", id)
      .executeTakeFirst();
    if (question) {
      await sql`UPDATE questions SET sort=sort-1 WHERE formId=${question.formId} AND sort>${+question.sort}`.execute(this.db);
      await sql`UPDATE questions SET sort=-1*sort, removed=1 WHERE id=${id} AND churchId=${churchId}`.execute(this.db);
    }
  }

  public async loadForForm(churchId: string, formId: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("formId", "=", formId)
      .where("removed", "=", 0)
      .orderBy("sort")
      .execute();
  }

  public async loadForUnrestrictedForm(formId: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("formId", "=", formId)
      .where("removed", "=", 0)
      .orderBy("sort")
      .execute();
  }

  public async moveQuestionUp(id: string) {
    const question = await this.db.selectFrom(this.tableName)
      .select(["formId", "sort"])
      .where("id", "=", id)
      .executeTakeFirst();
    if (question) {
      await sql`UPDATE questions SET sort=sort+1 WHERE formId=${question.formId} AND sort=${+question.sort - 1}`.execute(this.db);
      await sql`UPDATE questions SET sort=sort-1 WHERE id=${id}`.execute(this.db);
    }
  }

  public async moveQuestionDown(id: string) {
    const question = await this.db.selectFrom(this.tableName)
      .select(["formId", "sort"])
      .where("id", "=", id)
      .executeTakeFirst();
    if (question) {
      await sql`UPDATE questions SET sort=sort-1 WHERE formId=${question.formId} AND sort=${+question.sort + 1}`.execute(this.db);
      await sql`UPDATE questions SET sort=sort+1 WHERE id=${id}`.execute(this.db);
    }
  }

  public convertToModel(_churchId: string, data: any): Question {
    const result: Question = {
      id: data.id,
      churchId: data.churchId,
      formId: data.formId,
      parentId: data.parentId,
      title: data.title,
      description: data.description,
      fieldType: data.fieldType,
      placeholder: data.placeholder,
      required: data.required,
      sort: data.sort,
      choices: data.choices || []
    };
    if (typeof data.choices === "string") result.choices = JSON.parse(data.choices);
    else result.choices = data.choices;
    return result;
  }
}
