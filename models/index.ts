import { firestore } from 'firebase';

export interface User {
  uid: string | null;
  displayName: string | null;
  email: string | null;
}

export class CUser implements User {
  public uid: string | null;
  public displayName: string | null;
  public email: string | null;

  public constructor(uid: string, displayName: string, email: string) {
    this.uid =uid;
    this.displayName = displayName;
    this.email = email;
  }

  public static fromFirebase(fUser: firebase.User | null): CUser | null {
    if(fUser === null) return null;
    const uid: string | null = fUser.uid;
    const displayName: string  = fUser.displayName || '';
    const email: string = fUser.email || '';
    return new CUser(uid, displayName, email);
  }

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
  public extra: string = '';

  public constructor(id: string, name: string, ownerUser: string, ownerTeam: string, createdAt: Date, what?: string, extra?: string) {
    this.id = id;
    this.name = name;
    this.ownerUser = ownerUser;
    this.ownerTeam = ownerTeam;
    this.createdAt = createdAt;
    if(what !== undefined && extra !== null) this.what = what;
    if(extra !== undefined && extra !== null) this.extra = extra;
  }

  public static fromDocData(id: string, data: firestore.DocumentData): Person {
    if(data['createdAt'] === null) data['createdAt'] = new Date();
    else data['createdAt'] = (data['createdAt'] as firestore.Timestamp).toDate();
    return new Person(id, data['name'], data['ownerUser'], data['ownerTeam'], data['createdAt'] , data['what'], data['extra']);
  }
}
