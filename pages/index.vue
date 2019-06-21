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
      <button @click="fire()">
        fire
      </button>
    </div>
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
</template>

<script lang="ts">
import firebase from '@/plugins/firebase';
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import  attemitaModule from '@/store/attemita';

import { firestore } from 'firebase';

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

@Component
export default class Index extends Vue {
    private name: string = '';
    private people: Person[] = [];

    private attemitaStore = getModule(attemitaModule, this.$store);


    fire() {
        console.log(this.attemitaStore.hoge);
    }

    mounted () {
        firebase.auth().onAuthStateChanged(user => {
            if(user !== null){
                console.log(user.uid);
                firebase.firestore().collection('people').where('ownerUser', '==', user.uid).onSnapshot(qSnap => {
                    const updated: Person[] = [];
                    let idx = 0;
                    qSnap.forEach((dSnap) => {
                        updated[idx] = Person.fromDocData(dSnap.data());
                        idx++;
                    });
                    this.people = updated;
                });
            } else {
                this.people = [];
            }
        });
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
