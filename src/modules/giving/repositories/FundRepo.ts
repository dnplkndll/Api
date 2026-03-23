import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class FundRepo extends KyselyRepo {
  protected readonly tableName = "funds";
  protected readonly moduleName = "giving";
  protected readonly softDelete = true;

  public override async loadAll(churchId: string) {
    return this.db.selectFrom("funds").selectAll()
      .where("churchId", "=", churchId).where("removed", "=", 0)
      .orderBy("name").execute();
  }

  public async getOrCreateGeneral(churchId: string) {
    const data = await this.db.selectFrom("funds").selectAll()
      .where("churchId", "=", churchId).where("name", "=", "(General Fund)").where("removed", "=", 0)
      .executeTakeFirst() ?? null;

    if (data !== null) return this.convertToModel(churchId, data);
    else {
      const fund: any = { churchId, name: "(General Fund)" };
      const result = await this.save(fund);
      return result;
    }
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      name: data.name,
      churchId: data.churchId,
      productId: data.productId,
      taxDeductible: data.taxDeductible
    };
  }
}
