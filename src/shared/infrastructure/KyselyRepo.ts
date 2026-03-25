import { UniqueIdHelper } from "@churchapps/apihelper";
import { getDb } from "../../db/index.js";

/**
 * Base for any repo backed by a Kysely table in a named module.
 * Provides the db connection and id generation.
 *
 * Use `KyselyRepo` (below) for tables with `id` + `churchId`.
 * Use `GlobalKyselyRepo` for tables with `id` only (no churchId).
 */
abstract class BaseKyselyRepo {
  protected abstract readonly tableName: string;
  protected abstract readonly moduleName: string;

  protected get db() { return getDb(this.moduleName); }

  public createId(): string { return UniqueIdHelper.shortId(); }

  /**
   * Convert a single DB row to a model. Override in subclasses that need
   * field transformations (e.g. nested objects from flat columns).
   *
   * Accepts either `(data)` or `(churchId, data)` — global repos omit churchId.
   */
  public convertToModel(churchIdOrData?: any, data?: any) {
    return data !== undefined ? data : churchIdOrData;
  }

  /**
   * Convert an array of DB rows to models. Delegates to `convertToModel` for
   * each element when a subclass overrides it.
   */
  public convertAllToModel(churchIdOrData?: any, data?: any) {
    const rows = data !== undefined ? data : churchIdOrData;
    if (!Array.isArray(rows)) return [];
    // If convertToModel is overridden, map through it; otherwise return as-is
    if (data !== undefined) return rows.map((r: any) => this.convertToModel(churchIdOrData, r));
    return rows.map((r: any) => this.convertToModel(r));
  }
}

/**
 * Base repository for tables that have `id` and `churchId` columns.
 * Provides standard CRUD: save, delete, load, loadOne, loadAll.
 *
 * Set `protected readonly softDelete = true` in subclasses whose table has a
 * `removed` column. When enabled:
 *   - `delete()` sets `removed = true` instead of deleting the row.
 *   - `load()`, `loadOne()`, and `loadAll()` automatically exclude removed rows.
 */
export abstract class KyselyRepo extends BaseKyselyRepo {
  protected readonly softDelete: boolean = false;
  protected readonly defaultOrderBy?: string;

  public async save(model: any) {
    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable(this.tableName).set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = this.createId();
      const values = this.softDelete ? { ...model, removed: false } : model;
      await this.db.insertInto(this.tableName).values(values).execute();
    }
    return model;
  }

  public async delete(churchId: string, id: string) {
    if (this.softDelete) {
      await this.db.updateTable(this.tableName).set({ removed: true } as any)
        .where("id", "=", id).where("churchId", "=", churchId).execute();
    } else {
      await this.db.deleteFrom(this.tableName)
        .where("id", "=", id).where("churchId", "=", churchId).execute();
    }
  }

  public async loadOne(churchId: string, id: string, includeRemoved = false): Promise<any> {
    let q = this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", id).where("churchId", "=", churchId);
    if (this.softDelete && !includeRemoved) q = q.where("removed", "=", false as any);
    return await q.executeTakeFirst() ?? null;
  }

  public load(churchId: string, id: string): Promise<any> {
    return this.loadOne(churchId, id);
  }

  public async loadAll(churchId: string, orderBy?: string): Promise<any[]> {
    let q = this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId);
    if (this.softDelete) q = q.where("removed", "=", false as any);
    const order = orderBy || this.defaultOrderBy;
    if (order) q = q.orderBy(order as any);
    return await q.execute();
  }

  public saveAll(models: any[]) {
    return Promise.all(models.map(m => this.save(m)));
  }

  /** Force-insert a model, bypassing save()'s update-if-id-exists logic. */
  public async insert(model: any) {
    if (!model.id) model.id = this.createId();
    const values = this.softDelete ? { ...model, removed: false } : model;
    await this.db.insertInto(this.tableName).values(values).execute();
    return model;
  }
}

/**
 * Base repository for global tables that have `id` but no `churchId`.
 * Provides save, delete, load, loadAll keyed by `id` only.
 */
export abstract class GlobalKyselyRepo extends BaseKyselyRepo {

  public async save(model: any) {
    if (model.id) {
      const { id: _id, ...setData } = model;
      await this.db.updateTable(this.tableName).set(setData)
        .where("id", "=", model.id).execute();
    } else {
      model.id = this.createId();
      await this.db.insertInto(this.tableName).values(model).execute();
    }
    return model;
  }

  public async delete(id: string) {
    await this.db.deleteFrom(this.tableName).where("id", "=", id).execute();
  }

  public async load(id: string): Promise<any> {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", id).executeTakeFirst() ?? null;
  }

  public async loadAll(): Promise<any[]> {
    return await this.db.selectFrom(this.tableName).selectAll().execute();
  }

  public saveAll(models: any[]) {
    return Promise.all(models.map(m => this.save(m)));
  }
}
