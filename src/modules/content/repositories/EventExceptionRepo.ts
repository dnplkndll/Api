import { DateHelper } from "@churchapps/apihelper";
import { UniqueIdHelper } from "@churchapps/apihelper";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";
import { injectable } from "inversify";

@injectable()
export class EventExceptionRepo extends KyselyRepo {
  protected readonly tableName = "eventExceptions";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.exceptionDate) {
      model.exceptionDate = DateHelper.toMysqlDate(model.exceptionDate);
    }
    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable("eventExceptions").set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = UniqueIdHelper.shortId();
      await this.db.insertInto("eventExceptions").values(model).execute();
    }
    return model;
  }

  public async loadForEvents(churchId: string, eventIds: string[]) {
    return this.db.selectFrom("eventExceptions").selectAll()
      .where("churchId", "=", churchId)
      .where("eventId", "in", eventIds)
      .execute();
  }
}
