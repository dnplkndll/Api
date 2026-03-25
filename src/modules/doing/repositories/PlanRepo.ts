import { injectable } from "inversify";
import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { getDialect } from "../../../db/index.js";

@injectable()
export class PlanRepo extends KyselyRepo {
  protected readonly tableName = "plans";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public override async save(model: any) {
    const serviceDate = model.serviceDate?.toISOString?.().split("T")[0] || new Date().toISOString().split("T")[0];

    if (model.id) {
      await this.db.updateTable("plans").set({
        ministryId: model.ministryId, planTypeId: model.planTypeId, name: model.name,
        serviceDate, notes: model.notes, serviceOrder: model.serviceOrder,
        contentType: model.contentType, contentId: model.contentId, providerId: model.providerId,
        providerPlanId: model.providerPlanId, providerPlanName: model.providerPlanName,
        signupDeadlineHours: model.signupDeadlineHours, showVolunteerNames: model.showVolunteerNames
      }).where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await this.db.insertInto("plans").values({
        id: model.id, churchId: model.churchId, ministryId: model.ministryId, planTypeId: model.planTypeId,
        name: model.name, serviceDate, notes: model.notes, serviceOrder: model.serviceOrder,
        contentType: model.contentType, contentId: model.contentId, providerId: model.providerId,
        providerPlanId: model.providerPlanId, providerPlanName: model.providerPlanName,
        signupDeadlineHours: model.signupDeadlineHours, showVolunteerNames: model.showVolunteerNames
      }).execute();
    }
    return model;
  }

  public async loadByIds(churchId: string, ids: string[]) {
    return this.db.selectFrom("plans").selectAll()
      .where("churchId", "=", churchId).where("id", "in", ids).execute();
  }

  public async load7Days(churchId: string) {
    const endDate = getDialect() === "postgres"
      ? sql`CURRENT_DATE + INTERVAL '7 days'`
      : sql`CURRENT_DATE + INTERVAL 7 DAY`;
    const result = await sql`
      SELECT * FROM plans WHERE "churchId"=${churchId}
      AND "serviceDate" BETWEEN CURRENT_DATE AND ${endDate}
      order by "serviceDate" desc
    `.execute(this.db);
    return result.rows;
  }

  public async loadByPlanTypeId(churchId: string, planTypeId: string) {
    return this.db.selectFrom("plans").selectAll()
      .where("churchId", "=", churchId).where("planTypeId", "=", planTypeId)
      .orderBy("serviceDate", "desc").execute();
  }

  public async loadCurrentByPlanTypeId(planTypeId: string) {
    const result = await sql`
      SELECT * FROM plans WHERE "planTypeId"=${planTypeId} AND "serviceDate">=CURRENT_DATE
      ORDER by "serviceDate" LIMIT 1
    `.execute(this.db);
    return (result.rows as any[])[0] ?? null;
  }

  public async loadSignupPlans(churchId: string) {
    const result = await sql`
      SELECT DISTINCT p.* FROM plans p
      INNER JOIN positions pos ON pos."planId" = p.id AND pos."churchId" = p."churchId"
      WHERE p."churchId" = ${churchId} AND pos."allowSelfSignup" = true AND p."serviceDate" >= CURRENT_DATE
      ORDER BY p."serviceDate" ASC
    `.execute(this.db);
    return result.rows;
  }
}
