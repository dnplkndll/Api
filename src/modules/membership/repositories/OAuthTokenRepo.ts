import { injectable } from "inversify";
import { sql } from "kysely";
import { DateHelper } from "../helpers/index.js";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class OAuthTokenRepo extends GlobalKyselyRepo {
  protected readonly tableName = "oAuthTokens";
  protected readonly moduleName = "membership";

  public async save(model: any) {
    const expiresAt = DateHelper.toMysqlDate(model.expiresAt);
    if (model.id) {
      await this.db.updateTable(this.tableName).set({
        accessToken: model.accessToken,
        refreshToken: model.refreshToken,
        clientId: model.clientId,
        userChurchId: model.userChurchId,
        scopes: model.scopes,
        expiresAt
      } as any).where("id", "=", model.id).execute();
    } else {
      model.id = this.createId();
      await sql`INSERT INTO "oAuthTokens" (id, "accessToken", "refreshToken", "clientId", "userChurchId", scopes, "expiresAt", "createdAt") VALUES (${model.id}, ${model.accessToken}, ${model.refreshToken}, ${model.clientId}, ${model.userChurchId}, ${model.scopes}, ${expiresAt}, NOW())`.execute(this.db);
    }
    return model;
  }

  public async load(id: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", id).executeTakeFirst() ?? null;
  }

  public async loadByAccessToken(accessToken: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("accessToken", "=", accessToken).executeTakeFirst() ?? null;
  }

  public async loadByRefreshToken(refreshToken: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("refreshToken", "=", refreshToken).executeTakeFirst() ?? null;
  }

  public async loadByClientAndUser(clientId: string, userChurchId: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("clientId", "=", clientId)
      .where("userChurchId", "=", userChurchId)
      .executeTakeFirst() ?? null;
  }

  public async delete(id: string) {
    await this.db.deleteFrom(this.tableName)
      .where("id", "=", id).execute();
  }

  public async deleteByAccessToken(accessToken: string) {
    await this.db.deleteFrom(this.tableName)
      .where("accessToken", "=", accessToken).execute();
  }

  public async deleteByRefreshToken(refreshToken: string) {
    await this.db.deleteFrom(this.tableName)
      .where("refreshToken", "=", refreshToken).execute();
  }

  public async deleteExpired() {
    await sql`DELETE FROM "oAuthTokens" WHERE "expiresAt" < NOW()`.execute(this.db);
  }
}
