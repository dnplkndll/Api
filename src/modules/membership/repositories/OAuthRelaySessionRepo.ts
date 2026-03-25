import { injectable } from "inversify";
import { sql } from "kysely";
import { DateHelper } from "../helpers/index.js";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import crypto from "crypto";

@injectable()
export class OAuthRelaySessionRepo extends GlobalKyselyRepo {
  protected readonly tableName = "oAuthRelaySessions";
  protected readonly moduleName = "membership";

  public async save(model: any) {
    if (model.id) {
      await this.db.updateTable(this.tableName).set({
        authCode: model.authCode,
        status: model.status
      } as any).where("id", "=", model.id).execute();
    } else {
      model.id = this.createId();
      const expiresAt = DateHelper.toMysqlDate(model.expiresAt);
      await sql`INSERT INTO "oAuthRelaySessions" (id, "sessionCode", provider, "redirectUri", status, "expiresAt", "createdAt")
                 VALUES (${model.id}, ${model.sessionCode}, ${model.provider}, ${model.redirectUri}, ${model.status || "pending"}, ${expiresAt}, NOW())`.execute(this.db);
    }
    return model;
  }

  public async load(id: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", id).executeTakeFirst() ?? null;
  }

  public async loadBySessionCode(sessionCode: string) {
    const result = await sql`SELECT * FROM "oAuthRelaySessions" WHERE "sessionCode"=${sessionCode} AND "expiresAt" > NOW()`.execute(this.db);
    return (result.rows as any[])[0] ?? null;
  }

  public async delete(id: string) {
    await this.db.deleteFrom(this.tableName)
      .where("id", "=", id).execute();
  }

  public async deleteExpired() {
    await sql`DELETE FROM "oAuthRelaySessions" WHERE "expiresAt" < NOW()`.execute(this.db);
  }

  // Generate 8-character session code (TV-friendly, no ambiguous characters)
  public static generateSessionCode(): string {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars[crypto.randomInt(chars.length)];
    }
    return code;
  }
}
