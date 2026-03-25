import { injectable } from "inversify";
import { sql } from "kysely";
import { DateHelper, PersonHelper, UniqueIdHelper } from "../helpers/index.js";
import { Person } from "../models/index.js";
import { CollectionHelper } from "../../../shared/helpers/index.js";
import { KyselyRepo } from "../../../shared/infrastructure/KyselyRepo.js";

@injectable()
export class PersonRepo extends KyselyRepo {
  protected readonly tableName = "people";
  protected readonly moduleName = "membership";
  protected readonly softDelete = true;

  public async save(person: any) {
    person.name = person.name || {};
    person.name.display = PersonHelper.getDisplayNameFromPerson(person);
    this.prepareContactFields(person);
    this.prepareDateFields(person);

    if (person.id) {
      const { id: _id, churchId: _cid, ...setData } = person;
      // Remove nested objects that aren't DB columns
      delete setData.name;
      delete setData.contactInfo;
      delete setData.photo;
      delete setData.importKey;
      await this.db.updateTable(this.tableName).set(setData)
        .where("id", "=", person.id).where("churchId", "=", person.churchId).execute();
    } else {
      person.id = this.createId();
      const values: any = {
        id: person.id,
        churchId: person.churchId,
        displayName: person.displayName,
        firstName: person.firstName,
        middleName: person.middleName,
        lastName: person.lastName,
        nickName: person.nickName,
        prefix: person.prefix,
        suffix: person.suffix,
        birthDate: person.birthDate,
        gender: person.gender,
        maritalStatus: person.maritalStatus,
        anniversary: person.anniversary,
        membershipStatus: person.membershipStatus,
        homePhone: person.homePhone,
        mobilePhone: person.mobilePhone,
        workPhone: person.workPhone,
        email: person.email,
        nametagNotes: person.nametagNotes,
        donorNumber: person.donorNumber,
        address1: person.address1,
        address2: person.address2,
        city: person.city,
        state: person.state,
        zip: person.zip,
        photoUpdated: person.photoUpdated,
        householdId: person.householdId,
        householdRole: person.householdRole,
        conversationId: person.conversationId,
        optedOut: person.optedOut,
        removed: false
      };
      await this.db.insertInto(this.tableName).values(values).execute();
    }
    return person;
  }

  private prepareDateFields(person: any) {
    person.birthDate = DateHelper.toMysqlDateOnly(person.birthDate);
    person.anniversary = DateHelper.toMysqlDateOnly(person.anniversary);
    person.photoUpdated = DateHelper.toMysqlDate(person.photoUpdated);
  }

  private prepareContactFields(person: any) {
    person.homePhone = person.contactInfo?.homePhone;
    person.mobilePhone = person.contactInfo?.mobilePhone;
    person.workPhone = person.contactInfo?.workPhone;
    person.email = person.contactInfo?.email;
    person.address1 = person.contactInfo?.address1;
    person.address2 = person.contactInfo?.address2;
    person.city = person.contactInfo?.city;
    person.state = person.contactInfo?.state;
    person.zip = person.contactInfo?.zip;

    person.displayName = person.name?.display;
    person.firstName = person.name?.first;
    person.middleName = person.name?.middle;
    person.lastName = person.name?.last;
    person.nickName = person.name?.nick;
    person.prefix = person.name?.prefix;
    person.suffix = person.name?.suffix;
  }

  public async updateOptedOut(personId: string, optedOut: boolean) {
    await this.db.updateTable(this.tableName).set({ optedOut } as any)
      .where("id", "=", personId).execute();
  }

  public async updateHousehold(person: any) {
    await this.db.updateTable(this.tableName)
      .set({ householdId: person.householdId, householdRole: person.householdRole } as any)
      .where("id", "=", person.id)
      .where("churchId", "=", person.churchId)
      .execute();
    return person;
  }

  public async restore(churchId: string, id: string) {
    await this.db.updateTable(this.tableName).set({ removed: false } as any)
      .where("id", "=", id).where("churchId", "=", churchId).execute();
  }

  public async loadByIds(churchId: string, ids: string[]) {
    if (ids.length === 0) return [];
    return this.db.selectFrom(this.tableName).selectAll()
      .where("id", "in", ids)
      .where("churchId", "=", churchId)
      .execute();
  }

  public async loadByIdsOnly(ids: string[]) {
    if (ids.length === 0) return [];
    return this.db.selectFrom(this.tableName).selectAll()
      .where("id", "in", ids)
      .execute();
  }

  public async loadMembers(churchId: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("removed", "=", false as any)
      .where("membershipStatus", "in", ["Member", "Staff"])
      .execute();
  }

  public async loadMembersByVisibility(churchId: string, directoryVisibility: string) {
    let statusFilter: string[];
    switch (directoryVisibility) {
      case "Staff": statusFilter = ["Staff"]; break;
      case "Members": statusFilter = ["Member", "Staff"]; break;
      case "Regular Attendees": statusFilter = ["Regular Attendee", "Member", "Staff"]; break;
      case "Everyone": statusFilter = ["Visitor", "Regular Attendee", "Member", "Staff"]; break;
      default: statusFilter = ["Member", "Staff"]; break;
    }
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("removed", "=", false as any)
      .where("membershipStatus", "in", statusFilter)
      .execute();
  }

  public async loadRecent(churchId: string, filterOptedOut?: boolean) {
    const filterClause = filterOptedOut ? " AND (\"optedOut\" = FALSE OR \"optedOut\" IS NULL)" : "";
    const result = await sql`SELECT * FROM (SELECT * FROM people WHERE "churchId"=${churchId} AND removed=false${sql.raw(filterClause)} order by id desc limit 25) people ORDER BY "lastName", "firstName"`.execute(this.db);
    return result.rows;
  }

  public async loadByHousehold(churchId: string, householdId: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("householdId", "=", householdId)
      .where("removed", "=", false as any)
      .execute();
  }

  public async search(churchId: string, term: string, filterOptedOut?: boolean) {
    const filterClause = filterOptedOut ? " AND (\"optedOut\" = FALSE OR \"optedOut\" IS NULL)" : "";
    const searchTerm = "%" + term.replace(" ", "%") + "%";
    const result = await sql`SELECT * FROM people WHERE "churchId"=${churchId} AND concat(COALESCE("firstName",''), ' ', COALESCE("middleName",''), ' ', COALESCE("nickName",''), ' ', COALESCE("lastName",''), ' ', COALESCE("donorNumber",'')) LIKE ${searchTerm} AND removed=false${sql.raw(filterClause)} LIMIT 100`.execute(this.db);
    return result.rows;
  }

  public async searchPhone(churchId: string, phonestring: string) {
    const phoneSearch = "%" + phonestring.replace(/ |-/g, "%") + "%";
    const result = await sql`SELECT * FROM people WHERE "churchId"=${churchId} AND (REPLACE(REPLACE("homePhone",'-',''), ' ', '') LIKE ${phoneSearch} OR REPLACE(REPLACE("workPhone",'-',''), ' ', '') LIKE ${phoneSearch} OR REPLACE(REPLACE("mobilePhone",'-',''), ' ', '') LIKE ${phoneSearch}) AND removed=false LIMIT 100`.execute(this.db);
    return result.rows;
  }

  public async searchEmail(churchId: string, email: string) {
    return this.db.selectFrom(this.tableName).selectAll()
      .where("churchId", "=", churchId)
      .where("email", "like", "%" + email + "%")
      .where("removed", "=", false as any)
      .limit(100)
      .execute();
  }

  public async loadAttendees(churchId: string, campusId: string, serviceId: string, serviceTimeId: string, categoryName: string, groupId: string, startDate: Date, endDate: Date) {
    let conditions = sql`p."churchId" = ${churchId} AND v."visitDate" BETWEEN ${startDate} AND ${endDate}`;

    if (!UniqueIdHelper.isMissing(campusId)) conditions = sql`${conditions} AND ser."campusId"=${campusId}`;
    if (!UniqueIdHelper.isMissing(serviceId)) conditions = sql`${conditions} AND ser.id=${serviceId}`;
    if (!UniqueIdHelper.isMissing(serviceTimeId)) conditions = sql`${conditions} AND st.id=${serviceTimeId}`;
    if (categoryName !== "") conditions = sql`${conditions} AND g."categoryName"=${categoryName}`;
    if (!UniqueIdHelper.isMissing(groupId)) conditions = sql`${conditions} AND g.id=${groupId}`;

    const result = await sql`SELECT p.id, p."churchId", p."displayName", p."firstName", p."lastName", p."photoUpdated"
      FROM "visitSessions" vs
      INNER JOIN visits v on v.id = vs."visitId"
      INNER JOIN sessions s on s.id = vs."sessionId"
      INNER JOIN people p on p.id = v."personId"
      INNER JOIN "groups" g on g.id = s."groupId"
      LEFT OUTER JOIN "serviceTimes" st on st.id = s."serviceTimeId"
      LEFT OUTER JOIN services ser on ser.id = st."serviceId"
      WHERE ${conditions}
      GROUP BY p.id, p."churchId", p."displayName", p."firstName", p."lastName", p."photoUpdated"
      ORDER BY p."lastName", p."firstName"`.execute(this.db);
    return result.rows;
  }

  public convertToModel(_churchId: string, data: any): Person {
    const result: Person = {
      name: {
        display: data.displayName,
        first: data.firstName,
        last: data.lastName,
        middle: data.middleName,
        nick: data.nickName,
        prefix: data.prefix,
        suffix: data.suffix
      },
      contactInfo: {
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        homePhone: data.homePhone,
        workPhone: data.workPhone,
        email: data.email,
        mobilePhone: data.mobilePhone
      },
      photo: data.photo,
      anniversary: data.anniversary,
      birthDate: data.birthDate,
      gender: data.gender,
      householdId: data.householdId,
      householdRole: data.householdRole,
      maritalStatus: data.maritalStatus,
      nametagNotes: data.nametagNotes,
      donorNumber: data.donorNumber,
      membershipStatus: data.membershipStatus,
      photoUpdated: data.photoUpdated ? new Date(data.photoUpdated) : undefined,
      id: data.id,
      churchId: data.churchId,
      importKey: data.importKey,
      optedOut: data.optedOut,
      conversationId: data.conversationId
    };
    if (result.photo === undefined) result.photo = PersonHelper.getPhotoPath(data.churchId, result);
    return result;
  }

  public convertToModelWithPermissions(_churchId: string, data: any, canEdit: boolean) {
    const result = this.convertToModel(_churchId, data);
    if (!canEdit) delete result.conversationId;
    return result;
  }

  public convertAllToModelWithPermissions(churchId: string, data: any, canEdit: boolean) {
    return CollectionHelper.convertAll<Person>(data, (d: any) => this.convertToModelWithPermissions(churchId, d, canEdit));
  }

  public convertAllToBasicModel(churchId: string, data: any) {
    return CollectionHelper.convertAll<Person>(data, (d: any) => this.convertToBasicModel(churchId, d));
  }

  public convertToBasicModel(churchId: string, data: any) {
    const result: Person = {
      name: { display: data.displayName },
      contactInfo: {},
      photo: data.photo,
      photoUpdated: data.photoUpdated ? new Date(data.photoUpdated) : undefined,
      membershipStatus: data.membershipStatus,
      id: data.id
    };
    if (result.photo === undefined) result.photo = PersonHelper.getPhotoPath(churchId, result);
    return result;
  }

  public convertToPreferenceModel(churchId: string, data: Person) {
    const result: Person = {
      name: { display: data.name.display },
      contactInfo: data.contactInfo,
      photo: data.photo,
      photoUpdated: data.photoUpdated,
      membershipStatus: data.membershipStatus,
      id: data.id
    };
    if (result.photo === undefined) result.photo = PersonHelper.getPhotoPath(churchId, result);
    return result;
  }
}
