import { injectable } from "inversify";
import { sql } from "kysely";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class TaskRepo extends KyselyRepo {
  protected readonly tableName = "tasks";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public override async save(model: any) {
    if (model.id) {
      return this.updateTask(model);
    } else {
      return this.createTask(model);
    }
  }

  private async createTask(task: any) {
    if (!task.id) task.id = UniqueIdHelper.shortId();
    const taskNumber = await this.loadNextTaskNumber(task.churchId || "");

    await sql`
      INSERT INTO tasks (id, "churchId", "taskNumber", "taskType", "dateCreated", "dateClosed",
        "associatedWithType", "associatedWithId", "associatedWithLabel",
        "createdByType", "createdById", "createdByLabel",
        "assignedToType", "assignedToId", "assignedToLabel",
        title, status, "automationId", "conversationId", data)
      VALUES (${task.id}, ${task.churchId}, ${taskNumber}, ${task.taskType}, now(), ${task.dateClosed},
        ${task.associatedWithType}, ${task.associatedWithId}, ${task.associatedWithLabel},
        ${task.createdByType}, ${task.createdById}, ${task.createdByLabel},
        ${task.assignedToType}, ${task.assignedToId}, ${task.assignedToLabel},
        ${task.title}, ${task.status}, ${task.automationId}, ${task.conversationId}, ${task.data})
    `.execute(this.db);
    return task;
  }

  private async updateTask(task: any) {
    await this.db.updateTable("tasks").set({
      taskType: task.taskType, dateCreated: task.dateCreated, dateClosed: task.dateClosed,
      associatedWithType: task.associatedWithType, associatedWithId: task.associatedWithId, associatedWithLabel: task.associatedWithLabel,
      createdByType: task.createdByType, createdById: task.createdById, createdByLabel: task.createdByLabel,
      assignedToType: task.assignedToType, assignedToId: task.assignedToId, assignedToLabel: task.assignedToLabel,
      title: task.title, status: task.status, automationId: task.automationId,
      conversationId: task.conversationId, data: task.data
    }).where("id", "=", task.id).where("churchId", "=", task.churchId).execute();
    return task;
  }

  private async loadNextTaskNumber(churchId: string) {
    const result = await sql`select max(COALESCE("taskNumber", 0)) + 1 as "taskNumber" from tasks where "churchId"=${churchId}`.execute(this.db);
    return ((result.rows as any[])[0] as any).taskNumber;
  }

  public async loadTimeline(churchId: string, personId: string, taskIds: string[]) {
    if (taskIds.length > 0) {
      const result = await sql`
        select *, 'task' as "postType", id as "postId" from tasks
        where "churchId"=${churchId} AND (
          status='Open' and (
            ("associatedWithType"='person' and "associatedWithId"=${personId})
            OR
            ("createdByType"='person' and "createdById"=${personId})
            OR
            ("assignedToType"='person' and "assignedToId"=${personId})
          )
        )
        OR id IN (${sql.join(taskIds)})
      `.execute(this.db);
      return result.rows;
    } else {
      const result = await sql`
        select *, 'task' as "postType", id as "postId" from tasks
        where "churchId"=${churchId} AND (
          status='Open' and (
            ("associatedWithType"='person' and "associatedWithId"=${personId})
            OR
            ("createdByType"='person' and "createdById"=${personId})
            OR
            ("assignedToType"='person' and "assignedToId"=${personId})
          )
        )
      `.execute(this.db);
      return result.rows;
    }
  }

  public async loadByAutomationIdContent(churchId: string, automationId: string, recurs: string, associatedWithType: string, associatedWithIds: string[]) {
    let result: any[] = [];
    switch (recurs) {
      case "yearly":
        result = await this.loadByAutomationIdContentYearly(churchId, automationId, associatedWithType, associatedWithIds);
        break;
      case "monthly":
        result = await this.loadByAutomationIdContentMonthly(churchId, automationId, associatedWithType, associatedWithIds);
        break;
      case "weekly":
        result = await this.loadByAutomationIdContentWeekly(churchId, automationId, associatedWithType, associatedWithIds);
        break;
      default:
        result = await this.loadByAutomationIdContentNoRepeat(churchId, automationId, associatedWithType, associatedWithIds);
        break;
    }
    return result;
  }

  private async loadByAutomationIdContentNoRepeat(churchId: string, automationId: string, associatedWithType: string, associatedWithIds: string[]) {
    const result = await sql`
      SELECT * FROM tasks WHERE "churchId"=${churchId} AND "automationId"=${automationId}
      AND "associatedWithType"=${associatedWithType} AND "associatedWithId" IN (${sql.join(associatedWithIds)})
      order by "taskNumber"
    `.execute(this.db);
    return result.rows as any[];
  }

  private async loadByAutomationIdContentYearly(churchId: string, automationId: string, associatedWithType: string, associatedWithIds: string[]) {
    const threshold = new Date();
    threshold.setFullYear(threshold.getFullYear() - 1);
    const result = await sql`
      SELECT * FROM tasks WHERE "churchId"=${churchId} AND "automationId"=${automationId}
      AND "associatedWithType"=${associatedWithType} AND "associatedWithId" IN (${sql.join(associatedWithIds)})
      and "dateCreated">${threshold} order by "taskNumber"
    `.execute(this.db);
    return result.rows as any[];
  }

  private async loadByAutomationIdContentMonthly(churchId: string, automationId: string, associatedWithType: string, associatedWithIds: string[]) {
    const threshold = new Date();
    threshold.setMonth(threshold.getMonth() - 1);
    const result = await sql`
      SELECT * FROM tasks WHERE "churchId"=${churchId} AND "automationId"=${automationId}
      AND "associatedWithType"=${associatedWithType} AND "associatedWithId" IN (${sql.join(associatedWithIds)})
      and "dateCreated">${threshold} order by "taskNumber"
    `.execute(this.db);
    return result.rows as any[];
  }

  private async loadByAutomationIdContentWeekly(churchId: string, automationId: string, associatedWithType: string, associatedWithIds: string[]) {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 7);
    const result = await sql`
      SELECT * FROM tasks WHERE "churchId"=${churchId} AND "automationId"=${automationId}
      AND "associatedWithType"=${associatedWithType} AND "associatedWithId" IN (${sql.join(associatedWithIds)})
      and "dateCreated">${threshold} order by "taskNumber"
    `.execute(this.db);
    return result.rows as any[];
  }

  public async loadForPerson(churchId: string, personId: string, status: string) {
    const result = await sql`
      SELECT * FROM tasks WHERE "churchId"=${churchId}
      AND (("assignedToType"='person' AND "assignedToId"=${personId}) OR ("createdByType"='person' AND "createdById"=${personId}))
      and status=${status} order by "taskNumber"
    `.execute(this.db);
    return result.rows;
  }

  public async loadForGroups(churchId: string, groupIds: string[], status: string) {
    if (groupIds.length === 0) return [];
    const result = await sql`
      SELECT * FROM tasks WHERE "churchId"=${churchId}
      AND (("assignedToType"='group' AND "assignedToId" IN (${sql.join(groupIds)})) OR ("createdByType"='group' AND "createdById" IN (${sql.join(groupIds)})))
      AND status=${status} order by "taskNumber"
    `.execute(this.db);
    return result.rows;
  }

  public async loadForDirectoryUpdate(churchId: string, personId: string) {
    return this.db.selectFrom("tasks").selectAll()
      .where("taskType", "=", "directoryUpdate")
      .where("status", "=", "Open")
      .where("churchId", "=", churchId)
      .where("associatedWithId", "=", personId)
      .execute();
  }

  public override async load(churchId: string, id: string) {
    return await this.db.selectFrom("tasks").selectAll()
      .where("id", "=", id).where("churchId", "=", churchId)
      .orderBy("taskNumber" as any)
      .executeTakeFirst() ?? null;
  }

  public override async loadAll(churchId: string) {
    return this.db.selectFrom("tasks").selectAll()
      .where("churchId", "=", churchId).execute();
  }
}
