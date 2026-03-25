import { injectable } from "inversify";
import { sql } from "kysely";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class OAuthClientRepo extends GlobalKyselyRepo {
  protected readonly tableName = "oAuthClients";
  protected readonly moduleName = "membership";

  public async save(model: any) {
    if (model.id) {
      await this.db.updateTable(this.tableName).set({
        name: model.name,
        clientId: model.clientId,
        clientSecret: model.clientSecret,
        redirectUris: model.redirectUris,
        scopes: model.scopes
      } as any).where("id", "=", model.id).execute();
    } else {
      model.id = this.createId();
      await sql`INSERT INTO "oAuthClients" (id, name, "clientId", "clientSecret", "redirectUris", scopes, "createdAt") VALUES (${model.id}, ${model.name}, ${model.clientId}, ${model.clientSecret}, ${model.redirectUris}, ${model.scopes}, NOW())`.execute(this.db);
    }
    return model;
  }

  public async load(id: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", id).executeTakeFirst() ?? null;
  }

  public async loadByClientId(clientId: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("clientId", "=", clientId).executeTakeFirst() ?? null;
  }

  public async loadByClientIdAndSecret(clientId: string, clientSecret: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("clientId", "=", clientId)
      .where("clientSecret", "=", clientSecret)
      .executeTakeFirst() ?? null;
  }

  public async delete(id: string) {
    await this.db.deleteFrom(this.tableName)
      .where("id", "=", id).execute();
  }

  public async loadAll() {
    return this.db.selectFrom(this.tableName).selectAll()
      .orderBy("name").execute();
  }
}
