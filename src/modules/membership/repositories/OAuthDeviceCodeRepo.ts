import { injectable } from "inversify";
import { sql } from "kysely";
import { DateHelper } from "../helpers/index.js";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import crypto from "crypto";

@injectable()
export class OAuthDeviceCodeRepo extends GlobalKyselyRepo {
  protected readonly tableName = "oAuthDeviceCodes";
  protected readonly moduleName = "membership";

  public async save(model: any) {
    const expiresAt = DateHelper.toMysqlDate(model.expiresAt);
    if (model.id) {
      await this.db.updateTable(this.tableName).set({
        status: model.status,
        approvedByUserId: model.approvedByUserId,
        userChurchId: model.userChurchId,
        churchId: model.churchId,
        expiresAt
      } as any).where("id", "=", model.id).execute();
    } else {
      model.id = this.createId();
      await sql`INSERT INTO "oAuthDeviceCodes" (id, "deviceCode", "userCode", "clientId", scopes, "expiresAt", "pollInterval", status, "createdAt")
                 VALUES (${model.id}, ${model.deviceCode}, ${model.userCode}, ${model.clientId}, ${model.scopes}, ${expiresAt}, ${model.pollInterval || 5}, ${model.status || "pending"}, NOW())`.execute(this.db);
    }
    return model;
  }

  public async load(id: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", id).executeTakeFirst() ?? null;
  }

  public async loadByDeviceCode(deviceCode: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("deviceCode", "=", deviceCode).executeTakeFirst() ?? null;
  }

  public async loadByUserCode(userCode: string) {
    // Normalize: remove hyphens and uppercase
    const normalizedCode = userCode.replace(/-/g, "").toUpperCase();
    const result = await sql`SELECT * FROM "oAuthDeviceCodes" WHERE REPLACE("userCode", '-', '')=${normalizedCode} AND status='pending'`.execute(this.db);
    return (result.rows as any[])[0] ?? null;
  }

  public async delete(id: string) {
    await this.db.deleteFrom(this.tableName)
      .where("id", "=", id).execute();
  }

  public async deleteExpired() {
    await sql`DELETE FROM "oAuthDeviceCodes" WHERE "expiresAt" < NOW() AND status IN ('pending', 'expired')`.execute(this.db);
  }

  // Generate cryptographically secure device code (32 bytes, hex encoded)
  public static generateDeviceCode(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  // Generate user-friendly code (6 chars, no ambiguous characters)
  public static generateUserCode(): string {
    // Characters that are easy to read on TV (excluding ambiguous: 0,O,1,I,L)
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[crypto.randomInt(chars.length)];
    }
    return code;
  }
}
