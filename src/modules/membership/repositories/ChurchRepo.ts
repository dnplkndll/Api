import { injectable } from "inversify";
import { sql } from "kysely";
import { Church, Api, LoginUserChurch } from "../models/index.js";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class ChurchRepo extends GlobalKyselyRepo {
  protected readonly tableName = "churches";
  protected readonly moduleName = "membership";

  public async save(model: any) {
    if (model.id) {
      await sql`UPDATE churches SET name=${model.name}, subDomain=${model.subDomain}, address1=${model.address1}, address2=${model.address2}, city=${model.city}, state=${model.state}, zip=${model.zip}, country=${model.country}, archivedDate=${model.archivedDate}, latitude=${model.latitude}, longitude=${model.longitude} WHERE id=${model.id}`.execute(this.db);
    } else {
      model.id = this.createId();
      await sql`INSERT INTO churches (id, name, subDomain, registrationDate, address1, address2, city, state, zip, country, archivedDate, latitude, longitude) VALUES (${model.id}, ${model.name}, ${model.subDomain}, NOW(), ${model.address1}, ${model.address2}, ${model.city}, ${model.state}, ${model.zip}, ${model.country}, ${model.archivedDate}, ${model.latitude}, ${model.longitude})`.execute(this.db);
    }
    return model;
  }

  public async loadCount() {
    const result = await this.db.selectFrom(this.tableName)
      .select(this.db.fn.countAll().as("count"))
      .executeTakeFirst();
    return Number((result as any)?.count) || 0;
  }

  public async loadAll(): Promise<any[]> {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("archivedDate", "is", null)
      .orderBy("name")
      .execute();
  }

  public async search(name: string, includeArchived: boolean): Promise<any[]> {
    const searchTerm = "%" + name.replace(" ", "%") + "%";
    let q = this.db.selectFrom(this.tableName).selectAll()
      .where("name", "like", searchTerm);
    if (!includeArchived) q = q.where("archivedDate", "is", null);
    q = q.orderBy("name");
    if (name) q = q.limit(50);
    else q = q.limit(10);
    return q.execute();
  }

  public async loadContainingSubDomain(subDomain: string): Promise<any[]> {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("subDomain", "like", subDomain + "%")
      .where("archivedDate", "is", null)
      .execute();
  }

  public async loadBySubDomain(subDomain: string): Promise<any> {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("subDomain", "=", subDomain)
      .where("archivedDate", "is", null)
      .executeTakeFirst() ?? null;
  }

  public async loadById(id: string): Promise<any> {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", id)
      .executeTakeFirst() ?? null;
  }

  // Override the inherited load to match the original single-arg signature
  public async load(id: string): Promise<any> {
    return this.loadById(id);
  }

  public async loadByIds(ids: string[]): Promise<any[]> {
    if (ids.length === 0) return [];
    return this.db.selectFrom(this.tableName).selectAll()
      .where("id", "in", ids)
      .orderBy("name")
      .execute();
  }

  public async loadForUser(userId: string) {
    const result = await sql`select c.*, p.id as personId, p.membershipStatus from userChurches uc
      inner join churches c on c.id=uc.churchId and c.archivedDate IS NULL
      LEFT JOIN people p on p.id=uc.personId AND (p.removed=0 OR p.removed IS NULL)
      where uc.userId=${userId}`.execute(this.db);
    const rows = result.rows as any[];
    const resultArr: LoginUserChurch[] = [];
    rows.forEach((row: any) => {
      const apis: Api[] = [];
      const addChurch = {
        church: {
          id: row.id,
          name: row.name,
          subDomain: row.subDomain,
          archivedDate: row.archivedDate,
          address1: row.address1,
          address2: row.address2,
          city: row.city,
          state: row.state,
          zip: row.zip,
          country: row.country
        },
        person: {
          id: row.personId,
          membershipStatus: row.membershipStatus
        },
        apis
      };
      resultArr.push(addChurch);
    });
    return resultArr;
  }

  public async getAbandoned(noMonths = 6) {
    const result = await sql`SELECT churchId FROM (SELECT churchId, MAX(lastAccessed) lastAccessed FROM userChurches GROUP BY churchId) groupedChurches WHERE lastAccessed <= DATE_SUB(NOW(), INTERVAL ${sql.lit(noMonths)} MONTH)`.execute(this.db);
    return result.rows;
  }

  public async deleteAbandoned(noMonths = 7) {
    await sql`DELETE churches FROM churches LEFT JOIN (SELECT churchId, MAX(lastAccessed) lastAccessed FROM userChurches GROUP BY churchId) groupedChurches ON churches.id = groupedChurches.churchId WHERE groupedChurches.lastAccessed <= DATE_SUB(NOW(), INTERVAL ${sql.lit(noMonths)} MONTH)`.execute(this.db);
  }

  // For compatibility with existing controllers
  public convertToModel(_churchId: string, data: any): Church {
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      registrationDate: data.registrationDate,
      subDomain: data.subDomain,
      archivedDate: data.archivedDate,
      latitude: data.latitude,
      longitude: data.longitude
    };
  }
}
