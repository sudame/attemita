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
      <!-- <div>
        <h3>teams</h3>
        <div
          v-for="team in teams"
          :key="team.id">
          <nuxt-link :to="`/team/${team.id}`">
            {{ team.name }} | {{ team.id }}
          </nuxt-link>
        </div>
      </div> -->
      <div>
        <!-- <h3>people</h3> -->
        <people-table />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from '@/plugins/firebase';
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import  attemitaModule from '@/store/attemita';
import { User, Team } from '@/models';
import peopleTable from '@/components/peopleTable.vue';

import resizableTextArea from '@/components/resizableTextArea.vue';
import atmtHeader from '@/components/header.vue';

@Component({
  middleware: ['authenticate'],
  components: {
    resizableTextArea,
    atmtHeader,
    peopleTable
  }
})
export default class Index extends Vue {
  private attemitaStore = getModule(attemitaModule, this.$store);

  private name: string = '';
  private what: string = '';
  private unsubscribe: firebase.Unsubscribe | null = null;
  private teamname: string = '';

  private textAreaText: string = '';


  get user(): User | null{
    return this.attemitaStore.user;
  }

  get teams(): Team[] {
    return this.attemitaStore.teams;
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
        extra: this.textAreaText === '## ' ? '' : this.textAreaText,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });}
  }
}
</script>

<style lang="scss" scoped>
#main {
  padding: 0 5vw;
  max-width: 1024px;
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
</style>

