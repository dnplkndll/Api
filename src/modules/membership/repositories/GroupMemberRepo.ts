import { injectable } from "inversify";
import { sql } from "kysely";
import { GroupMember } from "../models/index.js";
import { PersonHelper } from "../helpers/index.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class GroupMemberRepo extends KyselyRepo {
  protected readonly tableName = "groupMembers";
  protected readonly moduleName = "membership";
  protected readonly softDelete = false;

  public async save(model: any) {
    if (model.id) {
      const { id: _id, churchId: _cid, ...setData } = model;
      await this.db.updateTable(this.tableName).set(setData)
        .where("id", "=", model.id).where("churchId", "=", model.churchId).execute();
    } else {
      model.id = this.createId();
      await sql`INSERT INTO groupMembers (id, churchId, groupId, personId, leader, joinDate) VALUES (${model.id}, ${model.churchId}, ${model.groupId}, ${model.personId}, ${model.leader}, NOW())`.execute(this.db);
    }
    return model;
  }

  public async loadForGroup(churchId: string, groupId: string) {
    const result = await sql`SELECT gm.*,
      p.photoUpdated, p.displayName, p.email, p.homePhone, p.mobilePhone, p.workPhone, p.optedOut,
      p.address1, p.address2, p.city, p.state, p.zip,
      p.householdId, p.householdRole
      FROM groupMembers gm
      INNER JOIN people p on p.id=gm.personId AND (p.removed=0 OR p.removed IS NULL)
      WHERE gm.churchId=${churchId} AND gm.groupId=${groupId}
      ORDER BY gm.leader DESC, p.lastName, p.firstName`.execute(this.db);
    return result.rows;
  }

  public async loadLeadersForGroup(churchId: string, groupId: string) {
    const result = await sql`SELECT gm.*, p.photoUpdated, p.displayName
      FROM groupMembers gm
      INNER JOIN people p on p.id=gm.personId AND (p.removed=0 OR p.removed IS NULL)
      WHERE gm.churchId=${churchId} AND gm.groupId=${groupId} and gm.leader=1
      ORDER BY p.lastName, p.firstName`.execute(this.db);
    return result.rows;
  }

  public async loadForGroups(churchId: string, groupIds: string[]) {
    if (groupIds.length === 0) return [];
    const result = await sql`SELECT gm.*, p.photoUpdated, p.displayName, p.email
      FROM groupMembers gm
      INNER JOIN people p on p.id=gm.personId AND (p.removed=0 OR p.removed IS NULL)
      WHERE gm.churchId=${churchId} AND gm.groupId IN (${sql.join(groupIds)})
      ORDER BY gm.leader desc, p.lastName, p.firstName`.execute(this.db);
    return result.rows;
  }

  public async loadForPerson(churchId: string, personId: string) {
    const result = await sql`SELECT gm.*, g.name as groupName
      FROM groupMembers gm
      INNER JOIN \`groups\` g on g.Id=gm.groupId
      WHERE gm.churchId=${churchId} AND gm.personId=${personId} AND g.removed=0
      ORDER BY g.name`.execute(this.db);
    return result.rows;
  }

  public async loadForPeople(peopleIds: string[]) {
    if (peopleIds.length === 0) return [];
    const result = await sql`SELECT gm.*, g.name, g.tags
      FROM groupMembers gm
      INNER JOIN \`groups\` g on g.Id=gm.groupId
      WHERE gm.personId IN (${sql.join(peopleIds)})`.execute(this.db);
    return result.rows;
  }

  public convertToModel(_churchId: string, data: any) {
    const result: GroupMember = {
      id: data.id,
      churchId: data.churchId,
      groupId: data.groupId,
      personId: data.personId,
      joinDate: data.joinDate,
      leader: data.leader
    };
    if (data.displayName !== undefined) {
      result.person = {
        id: result.personId,
        photoUpdated: data.photoUpdated,
        name: { display: data.displayName },
        contactInfo: {
          email: data.email,
          homePhone: data.homePhone,
          mobilePhone: data.mobilePhone,
          workPhone: data.workPhone,
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          state: data.state,
          zip: data.zip
        },
        householdId: data.householdId,
        householdRole: data.householdRole,
        optedOut: data.optedOut
      };
      result.person.photo = PersonHelper.getPhotoPath(data.churchId, result.person);
    }
    if (data.groupName !== undefined) result.group = { id: result.groupId, name: data.groupName };
    return result;
  }

  public convertAllToBasicModel(churchId: string, data: any[]) {
    const result: GroupMember[] = [];
    data.forEach((d) => result.push(this.convertToBasicModel(churchId, d)));
    return result;
  }

  public convertToBasicModel(_churchId: string, data: any) {
    const result = { id: data.id, groupId: data.groupId, personId: data.personId, displayName: data.displayName };
    return result;
  }
}
