<template>
  <div class="container">
    <div>
      <button @click="logout()">
        ログアウト
      </button>
    </div>
    <input
      v-model="name"
      type="text" />
    <button
      type="submit"
      @click="submit()">
      送信
    </button>
    <div>
      <input
        v-model="teamname"
        type="text" />
      <button @click="createTeam()">
        チームを作る
      </button>
    </div>
    <div>
      <h3>teams</h3>
      <div
        v-for="team in teams"
        :key="team.id">
        <nuxt-link :to="`/team/${team.id}`">
          {{ team.name }} | {{ team.id }}
        </nuxt-link>
      </div>
    </div>
    <div>
      <h3>people</h3>
      <div
        v-for="person in people"
        :key="person.name">
        <table>
          <tr
            v-for="(val, key) in person"
            :key="key">
            <td>{{ key }}</td>
            <td>{{ val }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from '@/plugins/firebase';
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import  attemitaModule, { User } from '@/store/attemita';

import { firestore } from 'firebase';

class Team {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

class Person {
    name: string;
    ownerUser: string | null = null;
    ownerTeam: string | null = null;
    createdAt: Date;

    constructor(name: string, ownerUser: string, ownerTeam: string, createdAt: Date) {
        this.name = name;
        this.ownerUser = ownerUser;
        this.ownerTeam = ownerTeam;
        this.createdAt = createdAt;
    }

    static fromDocData(data: firestore.DocumentData): Person {
        return new Person(data['name'], data['ownerUser'], data['ownerTeam'], (data['createdAt'] as firestore.Timestamp).toDate());
    }
}

@Component({
    middleware: ['authenticate'],
})
export default class Index extends Vue {
    private attemitaStore = getModule(attemitaModule, this.$store);

    private name: string = '';
    private people: Person[] = [];
    private teams: Team[] = [];
    private unsubscribe: firebase.Unsubscribe | null = null;
    private teamname: string = '';


    get user(): User | null{
        return this.attemitaStore.user;
    }

    mounted () {
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if(user !== null){
                this.attemitaStore.setUser(user);
                firebase.firestore().collection('people').where('ownerUser', '==', user.uid).onSnapshot(qSnap => {
                    const updated: Person[] = [];
                    let idx = 0;
                    qSnap.forEach((dSnap) => {
                        updated[idx] = Person.fromDocData(dSnap.data());
                        idx++;
                    });
                    this.people = updated;
                });

                firebase.firestore().collection('belongs').where('user', '==', user.uid).onSnapshot(qSnap => {
                    const updated: Team[] = [];
                    qSnap.forEach(dSnap => {
                        const teamRef: firestore.DocumentReference = dSnap.data()['team'];
                        teamRef.get().then(teamSnap => {
                            const data = teamSnap.data();
                            if(data !== undefined){
                                updated.push(new Team(teamSnap.id, data['name']));
                            }
                        });
                    });
                    this.teams = updated;
                });
            } else {
                this.people = [];
                this.teams = [];
                if(this.unsubscribe !== null) this.unsubscribe();
            }
        });
    }

    async createTeam() {
        if(this.user !== null){
            const ref = await firebase.firestore().collection('teams').add({
                name: this.teamname
            });

            firebase.firestore().collection('belongs').add({
                team: ref,
                user: this.user.uid,
            });
        }
    }

    logout() {
        firebase.auth().signOut();
    }

    submit() {
        const user = firebase.auth().currentUser;
        if(user !== null){
            firebase.firestore().collection('people').add({
                name: this.name,
                ownerUser: user.uid,
                ownerTeam: null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });}
    }
}
</script>
