import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class SectionRepo extends KyselyRepo {
  protected readonly tableName = "sections";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async loadAll(churchId: string) {
    return this.db.selectFrom("sections").selectAll()
      .where("churchId", "=", churchId)
      .orderBy("sort")
      .execute();
  }

  public async updateSortForBlock(churchId: string, blockId: string) {
    const sections = await this.loadForBlock(churchId, blockId);
    const promises: Promise<any>[] = [];
    for (let i = 0; i < sections.length; i++) {
      if ((sections[i] as any).sort !== i + 1) {
        (sections[i] as any).sort = i + 1;
        promises.push(this.save(sections[i]));
      }
    }
    if (promises.length > 0) await Promise.all(promises);
  }

  public async updateSort(churchId: string, pageId: string, zone: string) {
    const sections = await this.loadForZone(churchId, pageId, zone);
    const promises: Promise<any>[] = [];
    for (let i = 0; i < sections.length; i++) {
      if ((sections[i] as any).sort !== i + 1) {
        (sections[i] as any).sort = i + 1;
        promises.push(this.save(sections[i]));
      }
    }
    if (promises.length > 0) await Promise.all(promises);
  }

  public async loadForBlock(churchId: string, blockId: string) {
    return this.db.selectFrom("sections").selectAll()
      .where("churchId", "=", churchId)
      .where("blockId", "=", blockId)
      .orderBy("sort")
      .execute();
  }

  public async loadForBlocks(churchId: string, blockIds: string[]) {
    return this.db.selectFrom("sections").selectAll()
      .where("churchId", "=", churchId)
      .where("blockId", "in", blockIds)
      .orderBy("sort")
      .execute();
  }

  public async loadForPage(churchId: string, pageId: string) {
    const result = await sql`SELECT * FROM sections WHERE churchId=${churchId} AND (pageId=${pageId} or (pageId IS NULL and blockId IS NULL)) order by sort`.execute(this.db);
    return result.rows as any[];
  }

  public async loadForZone(churchId: string, pageId: string, zone: string) {
    return this.db.selectFrom("sections").selectAll()
      .where("churchId", "=", churchId)
      .where("pageId", "=", pageId)
      .where("zone", "=", zone)
      .orderBy("sort")
      .execute();
  }
}
