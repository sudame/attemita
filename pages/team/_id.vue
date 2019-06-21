<template>
  <div>
    <h1>team page {{ id }}</h1>
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

    mounted() {
        const teamRef: firebase.firestore.DocumentReference = firebase.firestore().collection('teams').doc(this.id);
        firebase.firestore().collection('belongs').where('team', '==', teamRef).get().then(qSnap => {
            const updated: string[] = [];
            qSnap.forEach(dSnap => {
                updated.push(dSnap.data()['user']);
            });
            this.users = updated;
        });
    }

    private users: string[] = [];

    get id(): string {
        return this.$route.params['id'];
    }
}

</script>
