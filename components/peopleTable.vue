<template>
  <table>
    <thead>
      <tr>
        <th>誰</th>
        <th>いつ</th>
        <th>何の人</th>
        <th>トピック</th>
      </tr>
    </thead>
    <tbody>
      <nuxt-link
        v-for="person in people"
        :key="person.id"
        :to="`/person/${person.id}`"
        tag="tr">
        <td class="bold">
          {{ person.name }}
        </td>
        <td>
          {{ formatDate(person.createdAt) }}
        </td>
        <td>
          {{ person.what }}
        </td>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <td>
          <ul>
            <li
              v-for="(topic, idx) in extractTopics(person.extra)"
              :key="topic + idx">
              {{ topic }}
            </li>
          </ul>
        </td>
      </nuxt-link>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Person } from '@/models';
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import atmtModule from '@/store/attemita';
import moment from 'moment';

@Component
export default class PeopleTable extends Vue {
  private atmtStore: atmtModule = getModule(atmtModule, this.$store);

  get people(): Person[] {
    return this.atmtStore.people;
  }

  extractTopics(text: string): string[] {
    if(text === undefined) return [];
    const lines: string[] = text.split('\n');
    const rawTopics = lines.filter(l => l.indexOf('## ') === 0);
    const topics: string[] = rawTopics.map(topic => topic.substr(3)).filter(d => !!d && d.length > 0);
    return topics;
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
table {
  border-collapse: collapse;
  width: 798px;
  max-width: 100%;
  margin: auto;

  td,
  th {
    border: 1px solid $black;
    padding: 1em;

    ul,
    ol {
      padding: 0;
    }

    ul {
      list-style: "・" inside;
    }

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
