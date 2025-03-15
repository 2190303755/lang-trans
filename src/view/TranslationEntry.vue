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
    'warning': showWarning,
    'modified': !unchanged
  }" @click="editing = true">
    <div class="entry-header">
      <samp class="key">{{ translationKey }}</samp>
    </div>
    <div style="line-height: 0">
      <samp class="value">{{ referenceFile.get(translationKey) }}</samp>
      <hr/>
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
      <samp class="value" v-else>{{ workingFile.get(translationKey) ?? "&nbsp;" }}</samp>
    </div>
  </div>
</template>

<style>
.translation-entry {
  border: 1px solid var(--color-outline-light);
  border-radius: 8px;
  height: fit-content;
  margin: 0 1rem 0;
  box-shadow: 0 2px 5px var(--color-primary-shadow);
  padding: 10px;
}

.entry-header {
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
}

.key {
  font-size: 0.825rem;
  line-height: 2;
  flex: 1;
  min-width: 0;
  white-space: normal;
  word-wrap: break-word;
}

.value {
  display: block;
  font-size: 1rem;
  line-height: 1.5;
  word-wrap: break-word;
}

.entry-header button {
  align-self: flex-start;
  flex-shrink: 0;
}

.warning {
  border: 1px solid var(--color-error);
  box-shadow: 0 2px 5px var(--color-error-shadow);
}

.modified {
  border: 1px solid var(--color-notice);
  box-shadow: 0 2px 5px var(--color-notice-shadow);
}

.translation-entry textarea {
  border: none;
  outline: none;
  resize: none;
  width: 100%;
  min-height: 1rem;
  height: 1rem;
  font-size: 1rem;
  font-family: monospace;
  padding: 0;
  line-height: 1.5;
}

.translation-entry hr {
  margin: 2px -2px;
  background-color: var(--color-primary-hr);
  border: none;
  height: 1px;
}

.warning hr {
  margin: 2px -2px;
  background-color: var(--color-error-hr);
}

.modified hr {
  margin: 2px -2px;
  background-color: var(--color-notice-hr);
}
</style>