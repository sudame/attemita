import atmtModule from '@/store/attemita';
import { getModule } from 'vuex-module-decorators';
import firebase from '@/plugins/firebase';
import { Person, Team } from '~/models';


const listenPeople = (uid: string, atmtStore: atmtModule): void => {
  firebase.firestore().collection('people').where('ownerUser', '==', uid).onSnapshot((qSnap): void => {
    const updated: Person[] = [];
    let idx = 0;
    qSnap.forEach((dSnap): void => {
      updated[idx] = Person.fromDocData(dSnap.id, dSnap.data());
      idx++;
    });
    updated.sort((a, b): number => {
      return b.createdAt.getTime() - a.createdAt.getTime() ;
    });
    atmtStore.setPeople(updated);
  });
};

const listenTeamPeople = (tid: string, atmtStore: atmtModule): void => {
  firebase.firestore().collection('people').where('ownerTeam', '==', tid).onSnapshot((qSnap): void => {
    const updated: Person[] = [];
    let idx = 0;
    qSnap.forEach((dSnap): void => {
      updated[idx] = Person.fromDocData(dSnap.id, dSnap.data());
      idx++;
    });
    updated.sort((a, b): number => {
      return b.createdAt.getTime() - a.createdAt.getTime() ;
    });
    atmtStore.setTeamPeople({
      teamID: tid,
      people: updated,
    });
  });
};

const getTeam = (dSnap: firebase.firestore.DocumentSnapshot): Promise<Team | null> => {
  const data = dSnap.data();
  if(data === null || data === undefined) return Promise.reject();
  const teamRef: firebase.firestore.DocumentReference = data['team'];
  return teamRef.get().then((teamSnap): Team | null => {
    const data = teamSnap.data();
    if(data === undefined) return null;
    return new Team(teamSnap.id, data['name']);
  });
};

const listenTeam = (uid: string, atmtStore: atmtModule): void => {
  firebase.firestore().collection('belongs').where('user', '==', uid).onSnapshot(async (qSnap): Promise<void> => {
    const queue: Promise<Team | null>[] = [];
    qSnap.forEach((dSnap): void => {
      console.log(dSnap.data());
      queue.push(getTeam(dSnap));
    });
    const updated: Team[] = (await Promise.all(queue)).filter((v): boolean => !!v) as Team[];
    updated.forEach((team): void => {
      listenTeamPeople(team.id, atmtStore);
    });
    atmtStore.setTeams(Object.freeze(updated) as Team[]);
  });
};

export default ({ store }): void => {
  const atmtStore = getModule(atmtModule, store);

  let unsubscribe: firebase.Unsubscribe | null = null;

  firebase.auth().onAuthStateChanged((user): void => {
    if(user === null) {
      atmtStore.setPeople([]);
      if(unsubscribe !==  null) unsubscribe();
    } else {
      listenPeople(user.uid, atmtStore);
      listenTeam(user.uid, atmtStore);
    }
  });
};
