import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

export interface AuditLogFilter {
  category?: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

@injectable()
export class AuditLogRepo extends KyselyRepo {
  protected readonly tableName = "auditLogs";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable(this.tableName).set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = this.createId();
      await sql`INSERT INTO auditLogs (id, churchId, userId, category, action, entityType, entityId, details, ipAddress, created) VALUES (${model.id}, ${model.churchId}, ${model.userId}, ${model.category}, ${model.action}, ${model.entityType}, ${model.entityId}, ${model.details}, ${model.ipAddress}, NOW())`.execute(this.db);
    }
    return model;
  }

  public async create(log: any) {
    return this.save(log);
  }

  public async loadFiltered(churchId: string, filter: AuditLogFilter): Promise<any[]> {
    let q = this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId);

    if (filter.category) q = q.where("category", "=", filter.category);
    if (filter.userId) q = q.where("userId", "=", filter.userId);
    if (filter.entityType) q = q.where("entityType", "=", filter.entityType);
    if (filter.entityId) q = q.where("entityId", "=", filter.entityId);
    if (filter.startDate) q = q.where("created", ">=", filter.startDate);
    if (filter.endDate) q = q.where("created", "<=", filter.endDate);

    const limit = Math.max(1, Math.min(filter.limit || 100, 1000));
    const offset = Math.max(0, filter.offset || 0);

    return q.orderBy("created", "desc").limit(limit).offset(offset).execute();
  }

  public async loadForPerson(churchId: string, personId: string, limit: number = 100, offset: number = 0): Promise<any[]> {
    const safeLimit = Math.max(1, Math.min(limit, 1000));
    const safeOffset = Math.max(0, offset);
    const result = await sql`SELECT al.* FROM auditLogs al
      WHERE al.churchId=${churchId} AND (al.userId=${personId} OR (al.entityType='person' AND al.entityId=${personId}))
      ORDER BY al.created DESC LIMIT ${sql.lit(safeLimit)} OFFSET ${sql.lit(safeOffset)}`.execute(this.db);
    return result.rows as any[];
  }

  public async loadCount(churchId: string, filter: AuditLogFilter): Promise<number> {
    let q = this.db.selectFrom(this.tableName)
      .select(this.db.fn.countAll().as("count"))
      .where("churchId", "=", churchId);

    if (filter.category) q = q.where("category", "=", filter.category);
    if (filter.userId) q = q.where("userId", "=", filter.userId);
    if (filter.entityType) q = q.where("entityType", "=", filter.entityType);
    if (filter.entityId) q = q.where("entityId", "=", filter.entityId);
    if (filter.startDate) q = q.where("created", ">=", filter.startDate);
    if (filter.endDate) q = q.where("created", "<=", filter.endDate);

    const result = await q.executeTakeFirst();
    return Number((result as any)?.count) || 0;
  }

  public async deleteOld(days: number = 365): Promise<void> {
    await sql`DELETE FROM auditLogs WHERE created < DATE_SUB(NOW(), INTERVAL ${sql.lit(days)} DAY)`.execute(this.db);
  }
}
