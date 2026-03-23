import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class TextingProviderRepo extends KyselyRepo {
  protected readonly tableName = "textingProviders";
  protected readonly moduleName = "messaging";
  protected readonly softDelete = false;

  public async loadByChurchId(churchId: string) {
    return this.db.selectFrom("textingProviders").selectAll()
      .where("churchId", "=", churchId)
      .execute();
  }

  public async loadById(churchId: string, id: string) {
    return (await this.db.selectFrom("textingProviders").selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .executeTakeFirst()) ?? null;
  }
}
