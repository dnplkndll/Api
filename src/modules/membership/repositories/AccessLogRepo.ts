import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class AccessLogRepo extends KyselyRepo {
  protected readonly tableName = "accessLogs";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable(this.tableName).set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = this.createId();
      const result = await sql`INSERT INTO accessLogs (id, churchId, userId, appName, loginTime) VALUES (${model.id}, ${model.churchId}, ${model.userId}, ${model.appName}, NOW())`.execute(this.db);
      return model;
    }
    return model;
  }

  // For compatibility with existing controllers
  public async create(log: any) {
    return this.save(log);
  }
}
