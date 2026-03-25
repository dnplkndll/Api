import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class DeviceContentRepo extends KyselyRepo {
  protected readonly tableName = "deviceContent";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async loadByDeviceId(churchId: string, deviceId: string) {
    return this.db.selectFrom("deviceContent").selectAll()
      .where("churchId", "=", churchId)
      .where("deviceId", "=", deviceId)
      .execute();
  }

  public async deleteByDeviceId(churchId: string, deviceId: string) {
    await this.db.deleteFrom("deviceContent")
      .where("deviceId", "=", deviceId)
      .where("churchId", "=", churchId)
      .execute();
  }
}
