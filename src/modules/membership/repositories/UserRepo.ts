import { injectable } from "inversify";
import { DateHelper } from "../helpers/index.js";
import { GlobalKyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class UserRepo extends GlobalKyselyRepo {
  protected readonly tableName = "users";
  protected readonly moduleName = "membership";

  public async save(model: any) {
    if (model.id) {
      const registrationDate = DateHelper.toMysqlDate(model.registrationDate);
      const lastLogin = DateHelper.toMysqlDate(model.lastLogin);
      await this.db.updateTable(this.tableName).set({
        email: model.email,
        password: model.password,
        authGuid: model.authGuid,
        firstName: model.firstName,
        lastName: model.lastName,
        registrationDate,
        lastLogin
      } as any).where("id", "=", model.id).execute();
    } else {
      model.id = this.createId();
      await this.db.insertInto(this.tableName).values({
        id: model.id,
        email: model.email,
        password: model.password,
        authGuid: model.authGuid,
        firstName: model.firstName,
        lastName: model.lastName
      }).execute();
    }
    return model;
  }

  public async load(id: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", id).executeTakeFirst() ?? null;
  }

  public async loadByEmail(email: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("email", "=", email).executeTakeFirst() ?? null;
  }

  public async loadByAuthGuid(authGuid: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("authGuid", "=", authGuid).executeTakeFirst() ?? null;
  }

  public async loadByEmailPassword(email: string, hashedPassword: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("email", "=", email)
      .where("password", "=", hashedPassword)
      .executeTakeFirst() ?? null;
  }

  public async loadByIds(ids: string[]) {
    if (ids.length === 0) return [];
    return this.db.selectFrom(this.tableName).selectAll()
      .where("id", "in", ids)
      .execute();
  }

  public async delete(id: string) {
    await this.db.deleteFrom(this.tableName)
      .where("id", "=", id).execute();
  }

  public async loadCount() {
    const result = await this.db.selectFrom(this.tableName)
      .select(this.db.fn.countAll().as("count"))
      .executeTakeFirst();
    return Number((result as any)?.count) || 0;
  }

  public async search(term: string): Promise<any[]> {
    const searchTerm = `%${term}%`;
    return this.db.selectFrom(this.tableName)
      .selectAll()
      .where((eb) =>
        eb.or([
          eb("email", "like", searchTerm),
          eb("firstName", "like", searchTerm),
          eb("lastName", "like", searchTerm)
        ])
      )
      .limit(50)
      .execute();
  }
}
