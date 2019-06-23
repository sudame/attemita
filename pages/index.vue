<template>
  <div class="container">
    <atmt-header :user="user" />
    <div id="main">
      <div class="container">
        <div class="field-group">
          <input
            v-model="name"
            placeholder="誰？"
            type="text" />
          <input
            v-model="what"
            placeholder="何の人？"
            type="text" />
          <resizable-text-area
            v-model="textAreaText"
            placeholder="何でも書こう！" />
          <p class="hint">
            ⌘ + ↵でトピック追加
          </p>
          <button
            type="submit"
            @click="submit()">
            登録
          </button>
        </div>
      </div>
      <!-- <div class="field-group">
          <input
            v-model="teamname"
            placeholder="チーム名"
            type="text" />
          <button @click="createTeam()">
            チームを作る
          </button>
        </div> -->
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
        <table>
          <thead>
            <tr>
              <th><i class="fas fa-link"></i></th>
              <th>誰</th>
              <th>いつ</th>
              <th>何の人</th>
            </tr>
          </thead>
          <tbody>
            <nuxt-link
              v-for="person in people"
              :key="person.id"
              :to="`/person/${person.id}`"
              tag="tr">
              <td class="link">
                <nuxt-link :to="`/person/${person.id}`">
                  <i class="fas fa-link"></i>
                </nuxt-link>
              </td>
              <td class="bold">
                {{ person.name }}
              </td>
              <td>
                {{ formatDate(person.createdAt) }}
              </td>
              <td>
                {{ person.what }}
              </td>
            </nuxt-link>
          </tbody>
        </table>
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
import moment from 'moment';

import resizableTextArea from '@/components/resizableTextArea.vue';
import atmtHeader from '@/components/header.vue';

import { firestore } from 'firebase';

import { Person, Team } from '@/models';

moment.locale('ja');

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
  private what: string = '';
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
            console.log(dSnap.data());
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
        what: this.what,
        ownerUser: this.user.uid,
        ownerTeam: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });}
  }

  formatDate(d: Date): string{
    if(moment().diff(moment(d), 'days') < 10)
      return moment(d).fromNow();
    if(moment(d).year() != moment().year())
      return moment(d).format('YY年MM月DD日');
    return moment(d).format('MM月DD日');
  }
}
</script>

<style lang="scss" scoped>
#main {
  padding: 0 5vw;
  max-width: 798px;
  margin: 24px auto auto;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .field-group {
    margin: 24px 0;
    max-width: 100%;

    .hint {
      text-align: right;
      font-size: 0.75rem;
      opacity: 0.75;
      margin: 6px;
    }

    & > * {
      display: block;
    }
  }
}

table {
  border-collapse: collapse;
  width: 798px;
  max-width: 100%;
  margin: auto;

  td,
  th {
    border: 1px solid $black;
    padding: 1em;

    &.link {
      a,
      a:visited {
        color: $black;
      }
    }
  }

  th {
    background-color: $black;
    color: white;
    border-color: white;
    border-top: none;
    border-bottom: none;

    &:first-child {
      border-left-color: $black;
    }

    &:last-child {
      border-right-color: $black;
    }
  }

  tr:hover {
    cursor: pointer;

    td {
      background-color: $black;
      color: white;
      border-color: white;

      &.link {
        a,
        a:visited {
          color: white;
        }
      }

      &:first-child {
        border-left-color: $black;
      }

      &:last-child {
        border-right-color: $black;
      }
    }
  }
}
</style>

