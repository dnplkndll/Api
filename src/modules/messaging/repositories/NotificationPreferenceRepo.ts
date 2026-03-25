import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class NotificationPreferenceRepo extends KyselyRepo {
  protected readonly tableName = "notificationPreferences";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async loadById(churchId: string, id: string) {
    return (await this.db.selectFrom("notificationPreferences").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }

  public async loadByPersonId(churchId: string, personId: string) {
    return (await this.db.selectFrom("notificationPreferences").selectAll()
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .executeTakeFirst()) ?? null;
  }

  public async loadByChurchId(churchId: string) {
    return this.db.selectFrom("notificationPreferences").selectAll()
      .where("churchId", "=", churchId)
      .execute();
  }

  public async loadByPersonIds(personIds: string[]) {
    return this.db.selectFrom("notificationPreferences").selectAll()
      .where("personId", "in", personIds)
      .execute();
  }
}
