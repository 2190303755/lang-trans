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
const failure = ref(false);
const promises = [];

function setReference(event) {
  promises[0] = getLang(reference.value = event.target.value);
  translationEntries.value = [];
}

function setWorking(event) {
  promises[1] = getLang(working.value = event.target.value);
  translationEntries.value = [];
}

function closeConfig() {
  loading.value = true;
  promises[0] = getLang(reference.value);
  promises[1] = getLang(working.value);
  setTimeout(async () => {
    try {
      const values = await Promise.all(promises);
      if (values) {
        referenceFile.value = values[0];
        workingFile.value = new Map(values[1]);
        populateEntries();
        showConfig.value = false;
        loading.value = false;
        return;
      }
    } catch (error) {
      console.error("Failed to fetch lang", error);
    }
    loading.value = false;
    failure.value = true;
  }, 0);
}
</script>

<template>
  <div class="config-container">
    <p v-if="loading" style="margin: auto">Loading</p>
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
      <div class="confirmation">
        <p v-if="failure">Failed to load data</p>
        <button @click="closeConfig" :disabled="!reference || !working || reference === working">
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-container {
  display: flex;
  height: 100vh;
  justify-items: center;
  align-items: center;
}

.config-menu {
  display: grid;
  height: max-content;
  width: max-content;
  gap: 15px;
  padding: 15px;
  margin: auto;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
}

.reference-selection {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  width: 40vw;
  max-width: 256px;
  align-self: center;
  justify-self: end;
}

.working-selection {
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  width: 40vw;
  max-width: 256px;
  align-self: center;
  justify-self: start;
}

.confirmation {
  grid-row: 2 / 3;
  grid-column: 1 / 3;
  align-self: start;
  justify-self: center;
  text-align: center;
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