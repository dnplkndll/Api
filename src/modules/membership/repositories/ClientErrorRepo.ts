import { injectable } from "inversify";
import { sql } from "kysely";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class ClientErrorRepo extends GlobalKyselyRepo {
  protected readonly tableName = "clientErrors";
  protected readonly moduleName = "membership";

  public async save(model: any) {
    if (model.id) {
      const { id: _id, ...setData } = model;
      await this.db.updateTable(this.tableName).set(setData)
        .where("id", "=", model.id).execute();
    } else {
      model.id = this.createId();
      await this.db.insertInto(this.tableName).values(model).execute();
    }
    return model;
  }

  public async deleteOld() {
    await sql`DELETE FROM clientErrors WHERE errorTime<date_add(NOW(), INTERVAL -7 DAY)`.execute(this.db);
  }

  public async load(id: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", id).executeTakeFirst() ?? null;
  }

  public async loadAll() {
    return this.db.selectFrom(this.tableName).selectAll().execute();
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      application: data.application,
      errorTime: data.errorTime,
      userId: data.userId,
      churchId: data.churchId,
      originUrl: data.originUrl,
      errorType: data.errorType,
      message: data.message,
      details: data.details
    };
  }
}
