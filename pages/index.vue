<template>
  <div class="container">
    <atmt-header :user="user" />
    <input
      v-model="name"
      type="text" />
    <button
      type="submit"
      @click="submit()">
      人を登録する
    </button>
    <div>
      <input
        v-model="teamname"
        type="text" />
      <button @click="createTeam()">
        チームを作る
      </button>
    </div>
    <resizable-text-area
      v-model="textAreaText" />
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
        :key="person.id">
        <nuxt-link :to="`/person/${person.id}`">
          {{ person.name }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from '@/plugins/firebase';
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import  attemitaModule from '@/store/attemita';
import { User } from '@/models';

import resizableTextArea from '@/components/resizableTextArea.vue';
import atmtHeader from '@/components/header.vue';

import { firestore } from 'firebase';

import { Person, Team } from '@/models';

@Component({
  middleware: ['authenticate'],
  components: {
    resizableTextArea,
    atmtHeader,
  }
})
export default class Index extends Vue {
  private attemitaStore = getModule(attemitaModule, this.$store);

  private name: string = '';
  private people: Person[] = [];
  private teams: Team[] = [];
  private unsubscribe: firebase.Unsubscribe | null = null;
  private teamname: string = '';

  private textAreaText: string = '';


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
            updated[idx] = Person.fromDocData(dSnap.id, dSnap.data());
            idx++;
          });

          updated.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime() ;
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
    if(this.user !== null && this.teamname !== ''){
      const ref = await firebase.firestore().collection('teams').add({
        name: this.teamname
      });

      firebase.firestore().collection('belongs').add({
        team: ref,
        user: this.user.uid,
      });
    }
  }

  submit() {
    if(this.user !== null && this.name !== ''){
      firebase.firestore().collection('people').add({
        name: this.name,
        ownerUser: this.user.uid,
        ownerTeam: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });}
  }
}
</script>
