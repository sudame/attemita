<template>
  <div>
    <h1>signup page</h1>
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
    <input
      v-model="username"
      type="text" />
    <button
      type="submit"
      @click="signup()">
      ログイン
    </button>

    <p v-if="user">
      {{ user }}
    </p>
  </div>
</template>

<script lang="ts">
import firebase from '@/plugins/firebase';
import { Vue, Component } from 'vue-property-decorator';
import { User } from 'firebase';

@Component
export default class LoginPage extends Vue {

    private email: string = '';
    private password: string = '';
    private username: string = '';
    private user: User | null  = null;

    async signup() {
        const res =  await firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
        if(res.user !== null) {
            await res.user.updateProfile({
                displayName: this.username,
            });
            this.user = res.user;
            firebase.firestore().collection('users').doc(res.user.uid).set({
                email: this.user.email,
            });
        }
    }
}
</script>
