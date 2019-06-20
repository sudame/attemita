<template>
  <div>
    <h1>login page</h1>
    <input
      id="email"
      v-model="email"
      type="email"
      name="email" />
    <input
      id="password"
      v-model="password"
      type="password"
      name="password" />
    <button
      type="submit"
      @click="signin()">
      ログイン
    </button>
  </div>
</template>

<script lang="ts">
import firebase from '@/plugins/firebase';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class LoginPage extends Vue {

    private email: string = '';
    private password: string = '';

    async signin() {
        const res =  await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
        console.log(res.user);
    }

}
</script>
