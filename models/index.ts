import { firestore } from 'firebase';

export interface User {
  uid: string | null;
  displayName: string | null;
  email: string | null;
}

export class Team {
  public id: string;
  public name: string;

  public constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class Person {
  public id: string;
  public name: string;
  public ownerUser: string | null = null;
  public ownerTeam: string | null = null;
  public createdAt: Date;
  public what: string = '';

  public constructor(id: string, name: string, ownerUser: string, ownerTeam: string, createdAt: Date, what: string) {
    this.id = id;
    this.name = name;
    this.ownerUser = ownerUser;
    this.ownerTeam = ownerTeam;
    this.createdAt = createdAt;
    if(what !== null) this.what = what;
  }

  public static fromDocData(id: string, data: firestore.DocumentData): Person {
    if(data['createdAt'] === null) data['createdAt'] = new Date();
    else data['createdAt'] = (data['createdAt'] as firestore.Timestamp).toDate();
    return new Person(id, data['name'], data['ownerUser'], data['ownerTeam'], data['createdAt'] , data['what']);
  }
}
