<template>
  <div id="header">
    <h1>Attemita.com</h1>
    <div class="space"></div>
    <p
      v-if="user"
      class="user">
      <span class="bold">{{ user.displayName }}</span> さんでログイン中
    </p>
    <nuxt-link
      v-if="user"
      class="button"
      to="/teams">
      チーム管理
    </nuxt-link>
    <logout />
  </div>
</template>

<script lang="ts">
import Logout from '@/components/logout.vue';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { User } from '../models';

@Component({
  components: {
    Logout,
  }
})
export default class AtmtHeader extends Vue {
  @Prop(undefined) readonly user: User | undefined;
}
</script>

<style lang="scss" scoped>
#header {
  height: 75px;
  padding: 18px;
  border-bottom: 1px solid $black;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .space {
    flex: 1;
  }

  & > * {
    margin: 0 6px;
  }
}
</style>
