<template>
  <div>
    <atmt-header :user="user" />
    <h1 v-if="team">
      チーム「 {{ team.name }} 」
    </h1>
    <div>
      <input
        v-model="email"
        type="email" />
      <button @click="addUser()">
        ユーザを追加する
      </button>
    </div>
    <div
      v-for="(name, id) in users"
      :key="id">
      {{ name }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { isNullOrUndefined } from 'util';
import firebase from '@/plugins/firebase';
import atmtHeader from '@/components/header.vue';
import atmtModule from '@/store/attemita';
import { getModule } from 'vuex-module-decorators';
import { Team, User } from '../../models';

@Component({
  validate: function({ params }): boolean {
    const id = params['id'];
    return !isNullOrUndefined(id) && id !== '';
  },
  components: {
    atmtHeader
  }
})
export default class TeamPage extends Vue {

  private email: string = '';
  private atmtStore: atmtModule = getModule(atmtModule, this.$store);
  private users: {string: string} | {} = {};

  mounted() {
    const ref = firebase.firestore().collection('teams').doc(this.id);
    firebase.firestore().collection('belongs').where('team', '==', ref).get().then(qSnap => {
      console.log(qSnap.size);
      qSnap.forEach(dSnap => {
        console.log(dSnap.data());
        this.getUserName(dSnap.data()['user']).then(name => {
          this.$set(this.users, dSnap.data()['user'], name);
        });
      });
    });
  }

  addUser() {
    firebase.firestore().collection('users').where('email', '==', this.email).get().then(qSnap => {
      qSnap.forEach(dSnap => {
        firebase.firestore().collection('belongs').add({
          team: this.teamRef,
          user: dSnap.id,
        });
      });
    });
  }

  get user(): User | null {
    return this.atmtStore.user;
  }

  async getUserName(id: string): Promise<string> {
    const dSnap = await firebase.firestore().collection('users').doc(id).get();
    const data = dSnap.data();
    if(data === undefined || data === null) return '';
    return data['displayName'] || '';
  }

  get teams(): Team[] {
    return this.atmtStore.teams;
  }

  get team(): Team | null{
    const team = this.teams.filter(t => t.id === this.id)[0];
    return team || null;
  }

  get id(): string {
    return this.$route.params['id'];
  }

  get teamRef(): firebase.firestore.DocumentReference {
    return firebase.firestore().collection('teams').doc(this.id);
  }
}

</script>
