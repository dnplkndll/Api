import { injectable } from "inversify";
import { sql } from "kysely";
import { SubscriptionFund } from "../models/index.js";
import { FundRepo } from "./FundRepo.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class SubscriptionFundsRepo extends KyselyRepo {
  protected readonly tableName = "subscriptionFunds";
  protected readonly moduleName = "giving";
  protected readonly softDelete = false;

  private fundRepository: FundRepo;

  constructor() {
    super();
    this.fundRepository = new FundRepo();
  }

  public async deleteBySubscriptionId(churchId: string, subscriptionId: string) {
    await this.db.deleteFrom("subscriptionFunds")
      .where("subscriptionId", "=", subscriptionId).where("churchId", "=", churchId).execute();
  }

  public async loadBySubscriptionId(churchId: string, subscriptionId: string) {
    const result = await sql`
      SELECT "subscriptionFunds".*, funds.name FROM "subscriptionFunds"
      LEFT JOIN funds ON "subscriptionFunds"."fundId" = funds.id
      WHERE "subscriptionFunds"."churchId"=${churchId} AND "subscriptionFunds"."subscriptionId"=${subscriptionId}
    `.execute(this.db);
    return result.rows;
  }

  // If the fund gets deleted for a recurring donation, the donations will go to '(General Fund)'
  public async loadForSubscriptionLog(churchId: string, subscriptionId: string) {
    let result;
    const queryResult = await sql`
      SELECT "subscriptionFunds".*, funds.name, funds.removed FROM "subscriptionFunds"
      LEFT JOIN funds ON "subscriptionFunds"."fundId" = funds.id
      WHERE "subscriptionFunds"."churchId"=${churchId} AND "subscriptionFunds"."subscriptionId"=${subscriptionId}
    `.execute(this.db);
    const subscriptionFund = queryResult.rows as any[];
    if (subscriptionFund && subscriptionFund[0] && subscriptionFund[0].removed === false) {
      const { removed: _removed, ...sf } = subscriptionFund[0];
      result = [sf];
    } else if (subscriptionFund && subscriptionFund[0]) {
      // Fund was deleted, use general fund instead
      const generalFund = await this.fundRepository.getOrCreateGeneral(churchId);
      const { removed: _removed, ...sf } = subscriptionFund[0];
      sf.fundId = generalFund.id;
      sf.name = generalFund.name;
      result = [sf];
    } else {
      // No subscription fund found, return empty array
      result = [];
    }
    return result;
  }

  public convertToModel(churchId: string, data: any): SubscriptionFund {
    return {
      id: data.id,
      churchId,
      subscriptionId: data.subscriptionId,
      fundId: data.fundId,
      amount: data.amount
    };
  }
}
