<template>
  <div>
    <button @click="logout()">
      ログアウト
    </button>
  </div>
</template>

<script lang="ts">
import firebase from '@/plugins/firebase';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class LogoutButton extends Vue {
  logout() {
    firebase.auth().signOut();
  }
}
</script>
