<template>
  <div>
    <atmt-header :user="user" />
    <div id="team-manage">
      <h1>チーム管理</h1>
      <table>
        <thead>
          <tr>
            <th>チーム名</th>
            <th>編集</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="team in teams"
            :key="team.id">
            <td class="bold">
              {{ team.name }}
            </td>
            <td>
              <nuxt-link
                no-prefetch
                class="edit-link"
                :to="`team/${team.id} `">
                <i class="fas fa-edit"></i>
              </nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import atmtModule from '@/store/attemita';
import AtmtHeader from '@/components/header.vue';
import { User, Team } from '@/models';

@Component({
  components: {
    AtmtHeader
  }
})
export default class TeamManagementPage extends Vue {
  private atmtStore: atmtModule = getModule(atmtModule, this.$store);

  get user(): User | null{
    return this.atmtStore.user;
  }

  get teams(): Team[] {
    return this.atmtStore.teams;
  }

}
</script>
<style lang="scss">
#team-manage {
  padding: 24px;
  max-width: 1024px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .edit-link {
    color: inherit;
    display: block;
    text-align: center;
  }

  table {
    border-collapse: collapse;
    margin: 24px 0;

    td,
    th {
      border: 1px solid $black;
      padding: 12px 24px;
    }

    th {
      background-color: $black;
      color: white;
      border-color: white;
      border-top: none;
      border-bottom: none;

      &:first-of-type {
        border-left-color: $black;
      }

      &:last-of-type {
        border-right-color: $black;
      }
    }
  }
}
</style>
