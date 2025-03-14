<script setup>
import {computed, ref} from 'vue';
import {referenceFile, workingFile} from '../Global.js';

const {
  translationKey,
  previousValue,
  mark,
  warning
} = defineProps({
  translationKey: String,
  previousValue: String,
  mark: String,
  warning: Boolean
});

const editing = ref(false);
const unchanged = ref(true);
const showWarning = computed(() => warning && unchanged.value && mark === 'missing');

function update(event) {
  editing.value = false;
  const value = event.target.value.trim();
  if (value.length) {
    workingFile.value.set(translationKey, value);
    unchanged.value = value === previousValue;
  } else {
    unchanged.value = true;
    workingFile.value.set(translationKey, previousValue);
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
    'warning': showWarning
  }">
    <div class="entry-header" @click="editing = true">
      <span class="key">{{ translationKey }}</span>
      <button @click="undo" :disabled="unchanged">Undo</button>
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
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
}

.key {
  font-size: 1.25rem;
  flex: 1;
  min-width: 0;
  white-space: normal;
  word-wrap: break-word;
}

.entry-header button {
  align-self: flex-start;
  flex-shrink: 0;
}

.warning {
  border: 1px solid var(--color-error);
  box-shadow: 0 4px 8px var(--color-error-shadow);
}

.translation-entry p {
  font-size: 1rem;
}

.translation-entry textarea {
  border: none;
  outline: none;
  resize: none;
  width: 100%;
  min-height: 1rem;
  height: 1rem;
  font-size: 1rem;
}
</style>