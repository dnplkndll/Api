import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class SentTextRepo extends KyselyRepo {
  protected readonly tableName = "sentTexts";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      await this.db.updateTable("sentTexts").set({
        recipientCount: model.recipientCount,
        successCount: model.successCount,
        failCount: model.failCount
      }).where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await sql`INSERT INTO sentTexts (id, churchId, groupId, recipientPersonId, senderPersonId, message, recipientCount, successCount, failCount, timeSent) VALUES (${model.id}, ${model.churchId}, ${model.groupId}, ${model.recipientPersonId}, ${model.senderPersonId}, ${model.message}, ${model.recipientCount}, ${model.successCount}, ${model.failCount}, NOW())`.execute(this.db);
    }
    return model;
  }

  public async loadByChurchId(churchId: string) {
    return this.db.selectFrom("sentTexts").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("timeSent", "desc")
      .execute();
  }

  public async loadById(churchId: string, id: string) {
    return (await this.db.selectFrom("sentTexts").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }
}
