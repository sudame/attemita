<template>
  <div>
    <h1>team page {{ id }}</h1>
    <div>
      <input
        v-model="email"
        type="email" />
      <button @click="addUser()">
        ユーザを追加する
      </button>
    </div>
    <div
      v-for="user in users"
      :key="user">
      {{ user }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { isNullOrUndefined } from 'util';
import firebase from '@/plugins/firebase';

@Component({
    validate: function({ params }): boolean {
        const id = params['id'];
        return !isNullOrUndefined(id) && id !== '';
    }
})
export default class TeamPage extends Vue {

    private users: string[] = [];
    private email: string = '';

    mounted() {
        firebase.firestore().collection('belongs').where('team', '==', this.teamRef).get().then(qSnap => {
            const updated: string[] = [];
            qSnap.forEach(dSnap => {
                updated.push(dSnap.data()['user']);
            });
            this.users = updated;
        });
    }

    addUser() {
        firebase.firestore().collection('users').where('email', '==', this.email).get().then(qSnap => {
            qSnap.forEach(dSnap => {
                firebase.firestore().collection('belongs').add({
                    team: this.teamRef,
                    user: dSnap.id,
                });
            });
        });
    }

    get id(): string {
        return this.$route.params['id'];
    }

    get teamRef(): firebase.firestore.DocumentReference {
        return firebase.firestore().collection('teams').doc(this.id);
    }
}

</script>
