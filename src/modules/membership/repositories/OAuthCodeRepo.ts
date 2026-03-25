import { injectable } from "inversify";
import { sql } from "kysely";
import { DateHelper } from "../helpers/index.js";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class OAuthCodeRepo extends GlobalKyselyRepo {
  protected readonly tableName = "oAuthCodes";
  protected readonly moduleName = "membership";

  public async save(model: any) {
    const expiresAt = DateHelper.toMysqlDate(model.expiresAt);
    if (model.id) {
      await this.db.updateTable(this.tableName).set({
        code: model.code,
        clientId: model.clientId,
        userChurchId: model.userChurchId,
        redirectUri: model.redirectUri,
        scopes: model.scopes,
        expiresAt
      } as any).where("id", "=", model.id).execute();
    } else {
      model.id = this.createId();
      await sql`INSERT INTO "oAuthCodes" (id, code, "clientId", "userChurchId", "redirectUri", scopes, "expiresAt", "createdAt") VALUES (${model.id}, ${model.code}, ${model.clientId}, ${model.userChurchId}, ${model.redirectUri}, ${model.scopes}, ${expiresAt}, NOW())`.execute(this.db);
    }
    return model;
  }

  public async load(id: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", id).executeTakeFirst() ?? null;
  }

  public async loadByCode(code: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("code", "=", code).executeTakeFirst() ?? null;
  }

  public async delete(id: string) {
    await this.db.deleteFrom(this.tableName)
      .where("id", "=", id).execute();
  }

  public async deleteByCode(code: string) {
    await this.db.deleteFrom(this.tableName)
      .where("code", "=", code).execute();
  }

  public async deleteExpired() {
    await sql`DELETE FROM "oAuthCodes" WHERE "expiresAt" < NOW()`.execute(this.db);
  }
}
