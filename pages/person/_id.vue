<template>
  <div>
    <atmt-header :user="user" />
    <div
      v-if="person !== null"
      id="person">
      <h1>{{ person.name }} さん</h1>
      <div class="manager">
        <vue-select
          v-model="selectedTeam"
          placeholder="共有チーム"
          :options="teams"
          label="name" />
        <button @click="updateBelong(true)">
          更新
        </button>
        <button @click="updateBelong(false)">
          共有をやめる
        </button>
      </div>
      <section>
        <h2>会った日時</h2>
        <p>
          {{ readableDate(person.createdAt) }}
        </p>
      </section>
      <section>
        <h2>何の人</h2>
        <p>{{ person.what }}</p>
      </section>
      <section v-if="person.ownerTeam !== null">
        <h2>共有中のチーム</h2>
        <p>{{ teamName(person.ownerTeam) }}</p>
      </section>
      <section>
        <h2>トピック</h2>
        <div
          v-for="topic in extractTopics(person.extra)"
          :key="topic.title + topic.content"
          class="topic">
          <h3 v-if="topic.title">
            {{ topic.title }}
          </h3>
          <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
          <p v-if="topic.content">{{ topic.content }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { isNullOrUndefined } from 'util';
import AtmtHeader from '@/components/header.vue';
import  attemitModule from '@/store/attemita';
import { getModule } from 'vuex-module-decorators';
import { User, Person, Team } from '../../models';
import moment from 'moment';
import VueSelect from 'vue-select';
import firebase from '@/plugins/firebase';

moment.locale('ja');

class Topic {
  public title: string;
  public content: string;

  public constructor(title: string, content: string) {
    if(title.indexOf('## ') === 0)
      title = title.substr(3);
    this.title = title;
    if(content.indexOf('\n') === 0)
      content = content.substr(1);
    this.content = content;
  }
}

@Component({
  validate: function({ params }): boolean {
    const id = params['id'];
    return !isNullOrUndefined(id) && id !== '';
  },
  components: {
    AtmtHeader,
    VueSelect
  }
})
export default class PersonPage extends Vue {
  private attemitaStore = getModule(attemitModule, this.$store);
  private selectedTeam: Team | null = null;

  get id(): string {
    return this.$route.params['id'];
  }

  get person(): Person | null{
    const people: Person[] = this.attemitaStore.people;
    const person: Person | undefined =  people.filter(p => p.id === this.id)[0];
    return person ? person : null;
  }

  @Watch('person', { immediate: true })
  onPersonChanged() {
    if(this.person === null) return;
    this.selectedTeam = this.team(this.person.ownerTeam);
  }

  get user(): User | null{
    return this.attemitaStore.user;
  }

  get teams(): Team[] {
    return this.attemitaStore.teams;
  }

  team(teamID: string | null): Team | null {
    if(teamID === null) return null;
    const team: Team | undefined = this.attemitaStore.teams.filter(t => teamID === t.id)[0];
    if(team === undefined) return null;
    return team;
  }

  teamName(teamID: string | null): string | null {
    if(teamID === null) return null;
    const team: Team | undefined = this.attemitaStore.teams.filter(t => teamID === t.id)[0];
    if(team === undefined) return null;
    return team.name;
  }

  readableDate(d: Date): string {
    const full: string =  moment(d).format('YYYY年MM月DD日(dd) HH時mm分');
    const diff: string = moment(d).fromNow();
    return `${full} (${diff})`;
  }

  extractTopics(t: string): Topic[] {
    const topics: Topic[] = [];

    const lines: string[] = t.split('\n');

    let topic = '';
    let content = '';
    for(let i = 0; i < lines.length; i++) {
      if(lines[i].indexOf('## ') === 0){
        if(topic !== '' || content !== '')
          topics.push(new Topic(topic, content));
        topic = lines[i];
        content = '';
      } else {
        content += '\n' + lines[i];
        console.log(content);
      }
    }
    if(topic !== '' || content !== '')
      topics.push(new Topic(topic, content));
    return topics;
  }

  updateBelong(isTeam: boolean): void {
    const target = firebase.firestore().collection('people').doc(this.id);
    if(isTeam) {
      if(this.selectedTeam === null) return;
      target.set({
        ownerTeam: this.selectedTeam.id,
        ownerUser: null,
      }, { merge: true });
    } else {
      if(this.user === null) return;
      target.set({
        ownerTeam: null,
        ownerUser: this.user.uid,
      }, { merge: true });
    }
  }
}

</script>

<style lang="scss">
/* setting for v-select */
$vs-controls-color: $black;
$vs-border-radius: 0;
$vs-border-color: $black;

@import '@/node_modules/vue-select/src/scss/vue-select.scss';
</style>

<style lang="scss" scoped>

.manager {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  button {
    padding: 12px 1.5em;
  }
}

.v-select {
  min-width: 200px;
  margin-right: 12px;
}

#person {
  max-width: 798px;
  width: 95vw;
  margin: auto;

  h1 {
    margin: 24px 0;
    padding: 0 24px;
    border-bottom: 5px double $black;
  }

  section {
    margin: 24px auto;
    border: 1px solid $black;
    padding: 12px 0;

    h2 {
      padding: 0 24px 12px;
      margin-bottom: 12px;
      border-bottom: 2px dashed $black;
    }

    & > p {
      padding: 0 24px;
    }

    .topic {
      padding: 12px 24px 0;
      margin-bottom: 12px;

      h3 {
        margin-bottom: 0.5em;
      }

      p {
        white-space: pre-line;
      }

      &:first-of-type {
        padding-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>

