import { injectable } from "inversify";
import { sql } from "kysely";
import { Group } from "../models/index.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class GroupRepo extends KyselyRepo {
  protected readonly tableName = "groups";
  protected readonly moduleName = "membership";
  protected readonly softDelete = true;

  public async save(group: any) {
    this.convertFromModel(group);
    return super.save(group);
  }

  public async deleteByIds(churchId: string, ids: string[]) {
    if (ids.length === 0) return;
    await this.db.updateTable(this.tableName).set({ removed: 1 } as any)
      .where("id", "in", ids)
      .where("churchId", "=", churchId)
      .execute();
  }

  public async load(churchId: string, id: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("id", "=", id)
      .where("churchId", "=", churchId)
      .where("removed", "=", 0)
      .executeTakeFirst() ?? null;
  }

  public async loadPublicSlug(churchId: string, slug: string) {
    return await this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("slug", "=", slug)
      .where("removed", "=", 0)
      .executeTakeFirst() ?? null;
  }

  public async loadByTag(churchId: string, tag: string) {
    const result = await sql`SELECT *, (SELECT COUNT(*) FROM groupMembers gm WHERE gm.groupId=g.id) AS memberCount FROM \`groups\` g WHERE churchId=${churchId} AND removed=0 AND tags like ${"%" + tag + "%"} ORDER by categoryName, name`.execute(this.db);
    return result.rows;
  }

  public async loadAll(churchId: string) {
    const result = await sql`SELECT *, (SELECT COUNT(*) FROM groupMembers gm WHERE gm.groupId=g.id) AS memberCount FROM \`groups\` g WHERE churchId=${churchId} AND removed=0 ORDER by categoryName, name`.execute(this.db);
    return result.rows;
  }

  public async loadAllForPerson(personId: string) {
    const result = await sql`SELECT distinct g.* FROM groupMembers gm INNER JOIN \`groups\` g on g.id=gm.groupId WHERE personId=${personId} and g.removed=0 ORDER BY name`.execute(this.db);
    return result.rows;
  }

  public async loadForPerson(personId: string) {
    const result = await sql`SELECT distinct g.* FROM groupMembers gm INNER JOIN \`groups\` g on g.id=gm.groupId WHERE personId=${personId} and g.removed=0 and g.tags like '%standard%' ORDER BY name`.execute(this.db);
    return result.rows;
  }

  public async loadByIds(churchId: string, ids: string[]) {
    if (ids.length === 0) return [];
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("id", "in", ids)
      .orderBy("name")
      .execute();
  }

  public async publicLabel(churchId: string, label: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("labels", "like", "%" + label + "%")
      .where("removed", "=", 0)
      .orderBy("name")
      .execute();
  }

  public async search(churchId: string, campusId: string, serviceId: string, serviceTimeId: string) {
    const result = await sql`SELECT g.id, g.categoryName, g.name
      FROM \`groups\` g
      LEFT OUTER JOIN groupServiceTimes gst on gst.groupId=g.id
      LEFT OUTER JOIN serviceTimes st on st.id=gst.serviceTimeId
      LEFT OUTER JOIN services s on s.id=st.serviceId
      WHERE g.churchId = ${churchId} AND (${serviceTimeId}=0 OR gst.serviceTimeId=${serviceTimeId}) AND (${serviceId}=0 OR st.serviceId=${serviceId}) AND (${campusId} = 0 OR s.campusId = ${campusId}) and g.removed=0
      GROUP BY g.id, g.categoryName, g.name ORDER BY g.name`.execute(this.db);
    return result.rows;
  }

  public convertFromModel(group: Group) {
    group.labels = null;
    if (group.labelArray?.length > 0) group.labels = group.labelArray.join(",");
  }

  public convertToModel(_churchId: string, data: any) {
    const result: Group = {
      id: data.id,
      churchId: data.churchId,
      categoryName: data.categoryName,
      name: data.name,
      trackAttendance: data.trackAttendance,
      parentPickup: data.parentPickup,
      printNametag: data.printNametag,
      memberCount: data.memberCount,
      about: data.about,
      photoUrl: data.photoUrl,
      tags: data.tags,
      meetingTime: data.meetingTime,
      meetingLocation: data.meetingLocation,
      labelArray: [],
      slug: data.slug
    };
    data.labels?.split(",").forEach((label: string) => result.labelArray.push(label.trim()));
    return result;
  }
}
