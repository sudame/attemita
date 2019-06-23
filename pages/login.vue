<template>
  <div id="login-wrapper">
    <atmt-header />
    <div id="login">
      <div class="content">
        <h1>ログイン</h1>
        <div class="field">
          <label for="email">
            メールアドレス
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            name="email" />
        </div>
        <div class="field">
          <label for="password">パスワード</label>
          <input
            id="password"
            v-model="password"
            type="password"
            name="password" />
        </div>

        <button
          type="submit"
          @click="signin()">
          ログイン
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import atmtHeader from '@/components/header.vue';
import firebase from '@/plugins/firebase';
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import attemitaModule from '@/store/attemita';

@Component({
  middleware: ['authenticate'],
  components: {
    atmtHeader,
  }
})
export default class LoginPage extends Vue {
  private attemitaStore = getModule(attemitaModule, this.$store);

  private email: string = '';
  private password: string = '';

  async signin() {
    await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
    this.$router.push('/');
  }

}
</script>

<style lang="scss" scoped>
#login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#login {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    border: 1px solid $black;
    padding: 60px 120px;
  }

  h1 {
    text-align: center;
    width: 100%;
    margin-bottom: 75px;
  }
}
</style>

