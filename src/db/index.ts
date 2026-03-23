import { Kysely, MysqlDialect, PostgresDialect } from "kysely";
import { createPool } from "mysql2";
import pg from "pg";
import { Environment } from "../shared/helpers/Environment.js";

export type DbDialect = "mysql" | "postgres";

export function getDialect(): DbDialect {
  const d = (process.env.DB_DIALECT || "mysql").toLowerCase();
  if (d === "postgres" || d === "postgresql" || d === "pg") return "postgres";
  return "mysql";
}

const instances = new Map<string, Kysely<any>>();

export function getDb(moduleName: string): Kysely<any> {
  let db = instances.get(moduleName);
  if (!db) {
    const dbConfig = Environment.getDatabaseConfig(moduleName);
    if (!dbConfig) throw new Error(`No database config for module: ${moduleName}`);

    if (getDialect() === "postgres") {
      db = new Kysely<any>({
        dialect: new PostgresDialect({
          pool: new pg.Pool({
            host: dbConfig.host,
            port: dbConfig.port || 5432,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            max: dbConfig.connectionLimit || 10
          })
        })
      });
    } else {
      db = new Kysely<any>({
        dialect: new MysqlDialect({
          pool: createPool({
            host: dbConfig.host,
            port: dbConfig.port || 3306,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            connectionLimit: dbConfig.connectionLimit || 10,
            charset: "utf8mb4",
            // MySQL stores booleans as BIT(1); convert to JS booleans at the driver level.
            // PostgreSQL uses native boolean — no typeCast needed.
            typeCast(field: any, next: () => unknown) {
              if (field.type === "BIT" && field.length === 1) {
                const bytes = field.buffer();
                return bytes ? bytes[0] === 1 : null;
              }
              return next();
            }
          })
        })
      });
    }
    instances.set(moduleName, db);
  }
  return db;
}

export async function destroyAllDbs() {
  for (const db of instances.values()) {
    try { await db.destroy(); } catch (_) { /* pool may already be closed */ }
  }
  instances.clear();
}
