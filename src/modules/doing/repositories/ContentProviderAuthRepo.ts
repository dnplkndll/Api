import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class ContentProviderAuthRepo extends KyselyRepo {
  protected readonly tableName = "contentProviderAuths";
  protected readonly moduleName = "doing";
  protected readonly softDelete = false;

  public async loadByIds(churchId: string, ids: string[]) {
    return this.db.selectFrom("contentProviderAuths").selectAll()
      .where("churchId", "=", churchId).where("id", "in", ids).execute();
  }

  public async loadByMinistry(churchId: string, ministryId: string) {
    return this.db.selectFrom("contentProviderAuths").selectAll()
      .where("churchId", "=", churchId).where("ministryId", "=", ministryId).execute();
  }

  public async loadByMinistryAndProvider(churchId: string, ministryId: string, providerId: string) {
    return await this.db.selectFrom("contentProviderAuths").selectAll()
      .where("churchId", "=", churchId).where("ministryId", "=", ministryId).where("providerId", "=", providerId)
      .executeTakeFirst() ?? null;
  }

  public convertToModel(_churchId: string, data: any) {
    return {
      id: data.id,
      churchId: data.churchId,
      ministryId: data.ministryId,
      providerId: data.providerId,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      tokenType: data.tokenType,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      scope: data.scope
    };
  }
}
