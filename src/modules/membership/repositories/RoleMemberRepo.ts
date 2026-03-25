import { injectable } from "inversify";
import { sql } from "kysely";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class RoleMemberRepo extends KyselyRepo {
  protected readonly tableName = "roleMembers";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable(this.tableName).set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = this.createId();
      await sql`INSERT INTO "roleMembers" (id, "churchId", "roleId", "userId", "addedBy", "dateAdded") VALUES (${model.id}, ${model.churchId}, ${model.roleId}, ${model.userId}, ${model.addedBy}, NOW())`.execute(this.db);
    }
    return model;
  }

  public async loadByRoleId(roleId: string, churchId: string): Promise<any[]> {
    const result = await sql`SELECT rm.*, uc."personId" FROM "roleMembers" rm LEFT JOIN "userChurches" uc ON rm."userId"=uc."userId" AND rm."churchId"=uc."churchId" WHERE "roleId"=${roleId} AND rm."churchId"=${churchId} ORDER BY rm."dateAdded"`.execute(this.db);
    return result.rows as any[];
  }

  public async delete(id: string, churchId: string): Promise<any> {
    await this.db.deleteFrom(this.tableName)
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .execute();
  }

  public async loadById(id: string, churchId: string) {
    return this.loadOne(churchId, id);
  }

  public async deleteForRole(churchId: string, roleId: string) {
    await this.db.deleteFrom(this.tableName)
      .where("churchId", "=", churchId)
      .where("roleId", "=", roleId)
      .execute();
  }

  public async deleteUser(userId: string) {
    await this.db.deleteFrom(this.tableName)
      .where("userId", "=", userId)
      .execute();
  }

  public async deleteSelf(churchId: string, userId: string) {
    await this.db.deleteFrom(this.tableName)
      .where("churchId", "=", churchId)
      .where("userId", "=", userId)
      .execute();
  }
}
