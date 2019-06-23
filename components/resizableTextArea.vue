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

    private textArea: HTMLTextAreaElement | null = null;

    mounted () {
      this.textArea = this.$el as HTMLTextAreaElement;
    }

    onInput(e: UIEvent) {
      const t = e.target as HTMLTextAreaElement;
      t.style.height = '';
      t.style.height = t.scrollHeight + 'px';
      this.$emit('input', t.value);
    }
}
</script>

<style lang="scss" scoped>
#textarea {
  padding: 0.5em;
}
</style>

