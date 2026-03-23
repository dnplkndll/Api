import { injectable } from "inversify";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class CuratedCalendarRepo extends KyselyRepo {
  protected readonly tableName = "curatedCalendars";
  protected readonly moduleName = "content";
  protected readonly softDelete = false;
}
