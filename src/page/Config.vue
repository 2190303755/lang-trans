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
  <div v-else>
    <label for="referenceFile">Reference:</label>
    <select id="referenceFile" :value="reference" @input="setReference">
      <option v-for="(locale, index) in locales" :key="index" :value="locale" :disabled="locale === working">
        {{ locale }}
      </option>
    </select>
    <label for="workingFile">Working:</label>
    <select id="workingFile" :value="working" @input="setWorking">
      <option v-for="(locale, index) in locales" :key="index" :value="locale" :disabled="locale === reference">
        {{ locale }}
      </option>
    </select>
    <button @click="closeConfig" :disabled="!reference || !working || reference === working">Continue</button>
  </div>
</template>

<style scoped>
ul {
  display: flex;
  gap: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  list-style-type: none;
  margin-top: 5px;
  padding: 5px;
  position: absolute;
  overflow-y: auto;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

li {
  padding: 8px;
  cursor: pointer;
  width: 100%;
}

li:hover {
  color: hsla(160, 100%, 35%, 1);
}

li:active {
  color: hsla(160, 100%, 25%, 1);
}
</style>