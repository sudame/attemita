<template>
  <div>
    <atmt-header :user="user" />
    <div
      v-if="person !== null"
      id="peron">
      <h1>{{ person.name }} さん</h1>
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
      <section v-if="person.ownerTeam">
        <h2>共有中のチーム</h2>
        <p>{{ team(person.ownerTeam) }}</p>
      </section>
      <section>
        <h2>Topics</h2>
        <div
          v-for="topic in extractTopics(person.extra)"
          :key="topic">
          <h3 v-if="topic.title">
            {{ topic.title }}
          </h3>
          <p v-if="topic.content">
            {{ topic.content }}
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { isNullOrUndefined } from 'util';
import AtmtHeader from '@/components/header.vue';
import  attemitModule from '@/store/attemita';
import { getModule } from 'vuex-module-decorators';
import { User, Person, Team } from '../../models';
import moment from 'moment';

class Topic {
  public title: string;
  public content: string;

  public constructor(title: string, content: string) {
    if(title.indexOf('## ') === 0)
      title = title.substr(3);
    this.title = title;
    this.content = content;
  }
}

@Component({
  validate: function({ params }): boolean {
    const id = params['id'];
    return !isNullOrUndefined(id) && id !== '';
  },
  components: {
    AtmtHeader
  }
})
export default class PersonPage extends Vue {
  private attemitaStore = getModule(attemitModule, this.$store);

  get id(): string {
    return this.$route.params['id'];
  }

  get person(): Person | null{
    const people: Person[] = this.attemitaStore.people;
    const person: Person | undefined =  people.filter(p => p.id === this.id)[0];
    return person ? person : null;
  }

  get user(): User | null{
    return this.attemitaStore.user;
  }

  team(teamID: string | null): Team | null {
    if(teamID === null) return null;
    const team: Team | undefined = this.attemitaStore.teams.filter(t => teamID === t.id)[0];
    if(team === undefined) return null;
    return team;
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
        content += lines[i];
      }
    }
    if(topic !== '' || content !== '')
      topics.push(new Topic(topic, content));
    return topics;
  }
}

</script>
