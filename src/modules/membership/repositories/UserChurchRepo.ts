import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class UserChurchRepo extends KyselyRepo {
  protected readonly tableName = "userChurches";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable(this.tableName).set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = this.createId();
      model.lastAccessed = new Date();
      await this.db.insertInto(this.tableName).values(model).execute();
    }
    return model;
  }

  public async delete(userId: string): Promise<any> {
    await this.db.deleteFrom(this.tableName)
      .where("userId", "=", userId)
      .execute();
  }

  public async deleteRecord(userId: string, churchId: string, personId: string) {
    await this.db.deleteFrom(this.tableName)
      .where("userId", "=", userId)
      .where("churchId", "=", churchId)
      .where("personId", "=", personId)
      .execute();
  }

  public async load(userChurchId: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", userChurchId)
      .executeTakeFirst() ?? null;
  }

  public async loadByUserId(userId: string, churchId: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("userId", "=", userId)
      .where("churchId", "=", churchId)
      .executeTakeFirst() ?? null;
  }

  public async loadByPersonId(personId: string, churchId: string): Promise<any> {
    const result = await sql`SELECT uc.*, u.email FROM userChurches uc
      INNER JOIN users u ON u.id = uc.userId
      WHERE uc.personId=${personId} AND uc.churchId=${churchId}`.execute(this.db);
    return (result.rows as any[])[0] ?? null;
  }

  public async loadForUser(userId: string): Promise<any[]> {
    const result = await sql`SELECT uc.*, c.id as churchId, c.name as churchName, c.subDomain, p.id as activePersonId, p.firstName, p.lastName, p.displayName
      FROM userChurches uc
      INNER JOIN churches c ON c.id = uc.churchId AND c.archivedDate IS NULL
      LEFT JOIN people p ON p.id = uc.personId AND p.churchId = uc.churchId AND (p.removed = 0 OR p.removed IS NULL)
      WHERE uc.userId = ${userId}`.execute(this.db);
    const rows = result.rows as any[];
    return rows.map((row: any) => ({
      id: row.id,
      userId: row.userId,
      personId: row.activePersonId,
      church: {
        id: row.churchId,
        name: row.churchName,
        subDomain: row.subDomain
      },
      person: row.activePersonId
        ? {
          id: row.activePersonId,
          name: {
            first: row.firstName,
            last: row.lastName,
            display: row.displayName
          }
        }
        : null
    }));
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      userId: data.userId,
      churchId: data.churchId,
      personId: data.personId,
      lastAccessed: data.lastAccessed
    };
  }
}
