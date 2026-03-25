import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class CustomerRepo extends KyselyRepo {
  protected readonly tableName = "customers";
  protected readonly moduleName = "giving";
  protected readonly softDelete = false;

  // Customer ID comes from external system, don't auto-generate on insert
  public override async save(model: any) {
    const existing = await this.loadByPersonId(model.churchId, model.personId);

    if (existing) {
      const oldId = (existing as any).id;
      const newId = model.id || oldId;

      if (newId !== oldId) {
        await this.delete(model.churchId, oldId);
        return this.createWithExternalId(model);
      } else {
        model.id = oldId;
        const metadata = model.metadata ? JSON.stringify(model.metadata) : null;
        await this.db.updateTable("customers")
          .set({ personId: model.personId, provider: model.provider ?? "stripe", metadata })
          .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
        return model;
      }
    } else {
      return this.createWithExternalId(model);
    }
  }

  private async createWithExternalId(model: any) {
    const provider = model.provider ?? "stripe";
    const metadata = model.metadata ? JSON.stringify(model.metadata) : null;
    await this.db.insertInto("customers")
      .values({ id: model.id, churchId: model.churchId, personId: model.personId, provider, metadata })
      .execute();
    return model;
  }

  public async loadByPersonId(churchId: string, personId: string) {
    const row = await this.db.selectFrom("customers").selectAll()
      .where("personId", "=", personId).where("churchId", "=", churchId)
      .executeTakeFirst() ?? null;
    return row ? this.convertToModel(churchId, row) : null;
  }

  public async loadByPersonAndProvider(churchId: string, personId: string, provider: string) {
    const row = await this.db.selectFrom("customers").selectAll()
      .where("personId", "=", personId).where("churchId", "=", churchId).where("provider", "=", provider)
      .executeTakeFirst() ?? null;
    return row ? this.convertToModel(churchId, row) : null;
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      personId: data.personId,
      provider: data.provider,
      metadata: this.parseJson(data.metadata)
    };
  }

  private parseJson(value: unknown) {
    if (value === null || value === undefined) return null;
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }
    return value as Record<string, unknown>;
  }
}
