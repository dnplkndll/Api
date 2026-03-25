import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { getDialect } from "../../../db/index.js";

@injectable()
export class DomainRepo extends KyselyRepo {
  protected readonly tableName = "domains";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async loadByName(domainName: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("domainName", "=", domainName).executeTakeFirst() ?? null;
  }

  public async loadPairs() {
    const result = await sql`select d."domainName" as host, concat(c."subDomain", '.b1.church:443') as dial from domains d inner join churches c on c.id=d."churchId" WHERE d."domainName" NOT like '%www.%'`.execute(this.db);
    return result.rows;
  }

  public async loadByIds(churchId: string, ids: string[]) {
    if (ids.length === 0) return [];
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("id", "in", ids)
      .orderBy("domainName")
      .execute();
  }

  public async loadUnchecked() {
    const dateSub = getDialect() === "postgres"
      ? sql`NOW() - INTERVAL '24 hours'`
      : sql`DATE_SUB(NOW(), INTERVAL 24 HOUR)`;
    const result = await sql`SELECT * FROM domains WHERE "lastChecked" IS NULL OR "lastChecked" < ${dateSub}`.execute(this.db);
    return result.rows;
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      domainName: data.domainName,
      lastChecked: data.lastChecked,
      isStale: data.isStale
    };
  }
}
