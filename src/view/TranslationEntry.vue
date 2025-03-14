<script setup>
import {ref} from 'vue';
import {referenceFile, workingFile} from '../Global.js';

const {
  translationKey,
  previousValue,
  warning
} = defineProps({
  translationKey: String,
  previousValue: String,
  warning: Boolean
});

const editing = ref(false);

function update(event) {
  editing.value = false;
  const value = event.target.value.trim();
  if (value.length) {
    workingFile.value.set(translationKey, value);
  }
}

function finish(event) {
  event.preventDefault();
  update(event);
}

function undo() {
  workingFile.value.set(translationKey, previousValue);
}

function resize(event) {
  const field = event.target;
  if (field.scrollHeight > field.clientHeight) {
    field.style.height = field.scrollHeight + "px";
  }
}

function getFocus({el}) {
  el.focus();
  resize({target: el});
}
</script>

<template>
  <div :class="{
    'translation-entry': true,
    'warning': warning
  }">
    <div class="entry-header" @click="editing = true">
      <span class="key">{{ translationKey }}</span>
      <button @click="undo" :disabled="workingFile.get(translationKey) === previousValue">Undo</button>
    </div>
    <div @click="editing = true">
      <p class="value">{{ referenceFile.get(translationKey) }}</p>
      <p v-show="!editing">{{ workingFile.get(translationKey) ?? "&nbsp;" }}</p>
      <textarea
          v-if="editing"
          :value="workingFile.get(translationKey)"
          :placeholder="previousValue"
          @change="update"
          @blur="update"
          @keydown.enter="finish"
          @input="resize"
          autocomplete="off"
          spellcheck="true"
          rows="1"
          @vue:mounted="getFocus"
      />
    </div>
  </div>
</template>

<style>
.translation-entry {
  border: 1px solid #ccc;
  border-radius: 8px;
  height: fit-content;
  margin: 0 1rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.entry-header {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr max-content;
  grid-template-rows: auto;
}

.key {
  font-size: 1.25rem;
  width: 100%;
  grid-row: 1/ 2;
  grid-column: 1 /2;
}

.entry-header button {
  grid-row: 1/ 2;
  grid-column: 2 /3;
  display: flex;
  gap: 5px;
}

.warning {
  border: 1px solid var(--color-error);
  box-shadow: 0 4px 8px var(--color-error-shadow);
}

textarea {
  border: none;
  outline: none;
  resize: none;
  width: 100%;
  min-height: 1rem;
  height: 1rem;
}
</style>