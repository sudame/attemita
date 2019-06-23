<template>
  <textarea
    id="textarea"
    :value="value"
    :placeholder="placeholder"
    name=""
    @input="onInput"
    @keydown.meta.enter="metaEnter"></textarea>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ResizableTextArea extends Vue {
    @Prop(String) readonly placeholder: string | undefined;

    value: string = '';

    mounted () {
      const t: HTMLTextAreaElement = this.$el as HTMLTextAreaElement;
      t.style.minHeight = '';
      t.style.minHeight = t.scrollHeight + 5 + 'px';
      this.$emit('input', t.value);
    }

    onInput(e: UIEvent) {
      const t = e.target as HTMLTextAreaElement;
      t.style.minHeight = '';
      t.style.minHeight = t.scrollHeight + 5 + 'px';
      this.value = t.value;
      this.$emit('input', t.value);
    }

    metaEnter(e: UIEvent) {
      if(this.value  === undefined) return;
      const textarea: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
      const sentence: string = this.value;
      const len: number = sentence.length;
      const pos: number = textarea.selectionStart;
      const endPos: number = textarea.selectionEnd;

      const before: string = sentence.substr(0, pos);
      const word = '## ';
      const after: string = sentence.substr(pos, len);
      this.value = before + word + after;
      this.$emit('input', this.value);
      this.$nextTick(() => {
        textarea.focus();
        textarea.selectionEnd = endPos + word.length;
        const t = e.target as HTMLTextAreaElement;
        t.style.minHeight = '';
        t.style.minHeight = t.scrollHeight + 5 + 'px';
      });
    }
}
</script>

<style lang="scss" scoped>
#textarea {
  padding: 0.5em;
}
</style>

