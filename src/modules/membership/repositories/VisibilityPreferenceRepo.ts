import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class VisibilityPreferenceRepo extends KyselyRepo {
  protected readonly tableName = "visibilityPreferences";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async loadForPerson(churchId: string, personId: string): Promise<any> {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .executeTakeFirst() ?? null;
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      personId: data.personId,
      address: data.address,
      phoneNumber: data.phoneNumber,
      email: data.email
    };
  }
}
