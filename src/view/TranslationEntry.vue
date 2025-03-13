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

function undo() {
  workingFile.value.set(translationKey, previousValue);
}
</script>

<template>
  <div :class="{
    'translation-entry': true,
    'warning': warning
  }">
    <div class="entry-header">
      <span class="key">{{ translationKey }}</span>
      <button @click="undo" :disabled="workingFile.get(translationKey) === previousValue">Undo</button>
    </div>
    <div @click="editing = true">
      <p class="value">{{ referenceFile.get(translationKey) }}</p>
      <input
          v-if="editing"
          :value="workingFile.get(translationKey)"
          :placeholder="previousValue"
          @change="update"
          @blur="update"
          @keyup.enter="update"
          @vue:mounted="({ el }) => el.focus()"
      >
      <p v-else>{{ workingFile.get(translationKey) ?? "&nbsp;" }}</p>
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
}

.warning {
  border: 1px solid red;
}

input {
  border: none;
  outline: none;
  flex-grow: 1;
}
</style>