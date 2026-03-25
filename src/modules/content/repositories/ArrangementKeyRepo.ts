import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class ArrangementKeyRepo extends KyselyRepo {
  protected readonly tableName = "arrangementKeys";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async deleteForArrangement(churchId: string, arrangementId: string) {
    await this.db.deleteFrom("arrangementKeys")
      .where("churchId", "=", churchId)
      .where("arrangementId", "=", arrangementId)
      .execute();
  }

  public async loadByArrangementId(churchId: string, arrangementId: string) {
    return this.db.selectFrom("arrangementKeys").selectAll()
      .where("churchId", "=", churchId)
      .where("arrangementId", "=", arrangementId)
      .execute();
  }
}
