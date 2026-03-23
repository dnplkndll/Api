import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class AnswerRepo extends KyselyRepo {
  protected readonly tableName = "answers";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async deleteForSubmission(churchId: string, formSubmissionId: string) {
    await this.db.deleteFrom(this.tableName)
      .where("churchId", "=", churchId)
      .where("formSubmissionId", "=", formSubmissionId)
      .execute();
  }

  public async loadForFormSubmission(churchId: string, formSubmissionId: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("formSubmissionId", "=", formSubmissionId)
      .execute();
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      formSubmissionId: data.formSubmissionId,
      questionId: data.questionId,
      value: data.value
    };
  }
}
