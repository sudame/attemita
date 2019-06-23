<template>
  <textarea
    id="textarea"
    :value="value"
    name=""
    @input="onInput"></textarea>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ResizableTextArea extends Vue {
    @Prop(String) readonly value: string | undefined;

    mounted () {
      const t: HTMLTextAreaElement = this.$el as HTMLTextAreaElement;
      t.style.height = '';
      t.style.height = t.scrollHeight + 5 + 'px';
      this.$emit('input', t.value);
    }

    onInput(e: UIEvent) {
      const t = e.target as HTMLTextAreaElement;
      t.style.height = '';
      t.style.height = t.scrollHeight + 5 + 'px';
      this.$emit('input', t.value);
    }
}
</script>

<style lang="scss" scoped>
#textarea {
  padding: 0.5em;
}
</style>

