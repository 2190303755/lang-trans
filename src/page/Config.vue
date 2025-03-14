<script setup>
import {
  locales,
  populateEntries,
  reference,
  referenceFile,
  showConfig,
  translationEntries,
  working,
  workingFile
} from '@/Global.js';
import {getLang} from '@/Networking.js';
import {ref} from 'vue';

const loading = ref(false);
let referencePromise;
let workingPromise;

async function prepareLang(locale) {
  return getLang(locale).catch(error => {
    console.error("Failed to fetch lang", error);
    setTimeout(prepareLang, 100, locale);
  });
}

function setReference(event) {
  referencePromise = prepareLang(reference.value = event.target.value);
  translationEntries.value = [];
}

function setWorking(event) {
  workingPromise = prepareLang(working.value = event.target.value);
  translationEntries.value = [];
}

function closeConfig() {
  loading.value = true;
  showConfig.value = false;
  setTimeout(async () => {
    let value = await referencePromise;
    if (value) {
      referenceFile.value = value;
    }
    value = await workingPromise;
    if (value) {
      workingFile.value = value;
    }
    populateEntries();
    loading.value = false;
  }, 0);
}
</script>

<template>
  <div v-if="loading">
    <p>Loading</p>
  </div>
  <div v-else class="config-menu">
    <div class="reference-selection">
      <label for="referenceFile">Reference:</label>
      <select id="referenceFile" :value="reference" @input="setReference">
        <option v-for="(locale, index) in locales" :key="index" :value="locale" :disabled="locale === working">
          {{ locale }}
        </option>
      </select>
    </div>
    <div class="working-selection">
      <label for="workingFile">Working:</label>
      <select id="workingFile" :value="working" @input="setWorking">
        <option v-for="(locale, index) in locales" :key="index" :value="locale" :disabled="locale === reference">
          {{ locale }}
        </option>
      </select>
    </div>
    <button class="confirm" @click="closeConfig" :disabled="!reference || !working || reference === working">Continue
    </button>
  </div>
</template>

<style scoped>
.config-menu {
  display: grid;
  height: 100vh;
  width: 100vw;
  gap: 15px;
  padding: 15px;
  place-items: center;
  grid-template-columns: auto auto;
  grid-template-rows: 3fr 1fr;
}

.reference-selection {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  width: 100%;
  margin: 20px auto;
}

.working-selection {
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  width: 100%;
  margin: 20px auto;
}

.confirm {
  grid-row: 2 / 3;
  grid-column: 1 / 3;
}

.config-menu select {
  width: 100%;
  padding: 10px 2px;
  font-size: 16px;
  color: var(--color-text);
  background-color: transparent;
  border: 1px solid var(--color-outline);
  border-radius: 8px;
  cursor: pointer;
}

.config-menu select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.config-menu option {
  padding: 10px;
}
</style>