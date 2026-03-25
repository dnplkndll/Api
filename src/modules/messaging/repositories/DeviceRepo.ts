import { injectable } from "inversify";
import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class DeviceRepo extends KyselyRepo {
  protected readonly tableName = "devices";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      const { id: _id, registrationDate: _rd, ...setData } = model;
      await this.db.updateTable("devices").set(setData)
        .where("id", "=", model.id).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await sql`INSERT INTO devices (id, "appName", "deviceId", "churchId", "personId", "fcmToken", label, "registrationDate", "lastActiveDate", "deviceInfo", "admId", "pairingCode", "ipAddress", "contentType", "contentId") VALUES (${model.id}, ${model.appName}, ${model.deviceId}, ${model.churchId}, ${model.personId}, ${model.fcmToken}, ${model.label}, NOW(), ${model.lastActiveDate}, ${model.deviceInfo}, ${model.admId}, ${model.pairingCode}, ${model.ipAddress}, ${model.contentType}, ${model.contentId})`.execute(this.db);
    }
    return model;
  }

  public async loadByIds(churchId: string, ids: string[]) {
    return this.db.selectFrom("devices").selectAll()
      .where("churchId", "=", churchId)
      .where("id", "in", ids)
      .execute();
  }

  public async loadByPersonId(churchId: string, personId: string) {
    return this.db.selectFrom("devices").selectAll()
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .execute();
  }

  public async loadById(churchId: string, id: string) {
    return (await this.db.selectFrom("devices").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }

  public async loadByPairingCode(pairingCode: string) {
    return (await this.db.selectFrom("devices").selectAll()
      .where("pairingCode", "=", pairingCode)
      .executeTakeFirst()) ?? null;
  }

  public async loadByDeviceId(deviceId: string) {
    return (await this.db.selectFrom("devices").selectAll()
      .where("deviceId", "=", deviceId)
      .executeTakeFirst()) ?? null;
  }

  public async loadByFcmToken(churchId: string, fcmToken: string) {
    return (await this.db.selectFrom("devices").selectAll()
      .where("fcmToken", "=", fcmToken)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }

  public async loadByChurchId(churchId: string) {
    return this.db.selectFrom("devices").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("lastActiveDate", "desc")
      .execute();
  }

  public async loadForPerson(churchId: string, personId: string) {
    return this.db.selectFrom("devices").selectAll()
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .execute();
  }

  public async deleteByFcmToken(fcmToken: string) {
    await this.db.deleteFrom("devices")
      .where("fcmToken", "=", fcmToken)
      .execute();
  }
}
