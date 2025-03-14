<script setup>
import Config from '@/page/Config.vue';
import Editor from '@/page/Editor.vue';
import {locales, showConfig, translationEntries} from '@/Global.js';
import {onMounted, ref} from 'vue';
import {getLang, getLocales, SOURCE} from '@/Networking.js';

const preparing = ref(true);
const fetching = ref(false);

function prepareLocales() {
  if (locales.value) return;
  fetching.value = true;
  getLocales().then(array => {
    locales.value = array;
    fetching.value = false;
    preparing.value = false;
    getLang(SOURCE);
  }).catch(error => {
    console.error('Failed to fetch locales:', error);
    fetching.value = false;
  });
}

onMounted(prepareLocales);
</script>

<template>
  <main>
    <div v-if="preparing" class="init-screen">
      <p v-if="fetching">Loading locales</p>
      <div v-else>
        <p>Fail to load locales</p>
        <button @click="prepareLocales">Reload</button>
      </div>
    </div>
    <Config v-else-if="showConfig || !translationEntries.length"/>
    <Editor v-else/>
  </main>
</template>

<style>
.init-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}
</style>