<template>
  <div>
    <h1>person page {{ id }}</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { isNullOrUndefined } from 'util';

@Component({
    validate: function({ params }): boolean {
        const id = params['id'];
        return !isNullOrUndefined(id) && id !== '';
    }
})
export default class TeamPage extends Vue {
    get id(): string {
        return this.$route.params['id'];
    }
}

</script>
