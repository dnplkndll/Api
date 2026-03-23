import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class BlockedIpRepo extends KyselyRepo {
  protected readonly tableName = "blockedIps";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async loadByConversationId(churchId: string, conversationId: string) {
    const data = await this.db.selectFrom("blockedIps").selectAll()
      .where("churchId", "=", churchId)
      .where("conversationId", "=", conversationId)
      .execute();
    return (data || []).map((d: any) => d.ipAddress);
  }

  public async loadByServiceId(churchId: string, serviceId: string) {
    const result = await this.db.selectFrom("blockedIps").selectAll()
      .where("churchId", "=", churchId)
      .where("serviceId", "=", serviceId)
      .execute();
    return result || [];
  }

  // Override save to implement toggle behavior (if exists, delete; if not, create)
  public async save(blockedIp: any) {
    const existing = await this.db.selectFrom("blockedIps").select("id")
      .where("churchId", "=", blockedIp.churchId)
      .where("conversationId", "=", blockedIp.conversationId)
      .where("ipAddress", "=", blockedIp.ipAddress)
      .execute();
    const existingIp = existing || [];
    if (existingIp[0]?.id) {
      await this.db.deleteFrom("blockedIps").where("id", "=", existingIp[0].id).execute();
      return;
    }
    return super.save(blockedIp);
  }

  public async deleteByServiceId(churchId: string, serviceId: string) {
    await this.db.deleteFrom("blockedIps")
      .where("churchId", "=", churchId)
      .where("serviceId", "=", serviceId)
      .execute();
  }
}
