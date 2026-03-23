import { ArrayHelper } from "@churchapps/apihelper";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class ElementRepo extends KyselyRepo {
  protected readonly tableName = "elements";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async loadAll(churchId: string) {
    return this.db.selectFrom("elements").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("sort")
      .execute();
  }

  public async updateSortForBlock(churchId: string, blockId: string, parentId: string) {
    const elements = await this.loadForBlock(churchId, blockId);
    const promises: Promise<any>[] = [];
    for (let i = 0; i < elements.length; i++) {
      if ((elements[i] as any).parentId === parentId) {
        if ((elements[i] as any).sort !== i + 1) {
          (elements[i] as any).sort = i + 1;
          promises.push(this.save(elements[i]));
        }
      }
    }
    if (promises.length > 0) await Promise.all(promises);
  }

  public async updateSort(churchId: string, sectionId: string, parentId: string) {
    const elements = await this.loadForSection(churchId, sectionId);
    const skipParentId = ArrayHelper.getAll(elements, "parentId", null);
    const withParentId = ArrayHelper.getAll(elements, "parentId", parentId);
    const promises: Promise<any>[] = [];
    for (let i = 0; i < skipParentId.length; i++) {
      if (skipParentId[i].sort !== i + 1) {
        skipParentId[i].sort = i + 1;
        promises.push(this.save(skipParentId[i]));
      }
    }
    for (let i = 0; i < withParentId.length; i++) {
      if (withParentId[i].sort !== i + 1) {
        withParentId[i].sort = i + 1;
        promises.push(this.save(withParentId[i]));
      }
    }
    if (promises.length > 0) await Promise.all(promises);
  }

  public async loadForSection(churchId: string, sectionId: string): Promise<any[]> {
    return this.db.selectFrom("elements").selectAll()
      .where("churchId", "=", churchId)
      .where("sectionId", "=", sectionId)
      .orderBy("sort")
      .execute();
  }

  public async loadForBlock(churchId: string, blockId: string) {
    return this.db.selectFrom("elements").selectAll()
      .where("churchId", "=", churchId)
      .where("blockId", "=", blockId)
      .orderBy("sort")
      .execute();
  }

  public async loadForBlocks(churchId: string, blockIds: string[]) {
    return this.db.selectFrom("elements").selectAll()
      .where("churchId", "=", churchId)
      .where("blockId", "in", blockIds)
      .orderBy("sort")
      .execute();
  }

  public async loadForPage(churchId: string, pageId: string) {
    const result = await sql`SELECT e.* FROM elements e INNER JOIN sections s on s.id=e.sectionId WHERE (s.pageId=${pageId} OR (s.pageId IS NULL and s.blockId IS NULL)) AND e.churchId=${churchId} ORDER BY sort`.execute(this.db);
    return result.rows as any[];
  }
}
