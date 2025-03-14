<script setup>
import {computed, onMounted, onUnmounted, ref, useTemplateRef} from 'vue';
import {dumpEntries, showConfig, translationEntries as entries} from '@/Global.js';
import TranslationEntry from '@/view/TranslationEntry.vue';
import Switch from '@/view/Switch.vue';

const header = useTemplateRef('header');
const glass = useTemplateRef('glass');
const placeholder = useTemplateRef('placeholder');
const showMissing = ref(false);
const showEqual = ref(false);
const filtered = computed(() => {
  return showMissing.value
      ? showEqual.value
          ? entries.value.filter(entry => entry.mark === 'missing' || entry.mark === 'equal')
          : entries.value.filter(entry => entry.mark === 'missing')
      : showEqual.value
          ? entries.value.filter(entry => entry.mark === 'equal')
          : entries.value;
});

function openConfig() {
  showConfig.value = true;
}

function syncHeight() {
  const height = header.value.offsetHeight;
  glass.value.style.minHeight = height + parseInt(getComputedStyle(document.documentElement).fontSize) * 0.5 + 'px';
  placeholder.value.style.minHeight = height + 'px';
}

onMounted(() => {
  window.addEventListener('resize', syncHeight);
  window.addEventListener('load', syncHeight);
  syncHeight();
});
onUnmounted(() => {
  window.removeEventListener('resize', syncHeight);
  window.removeEventListener('load', syncHeight);
});
</script>

<template>
  <div class="glass" ref="glass"/>
  <div class="header" ref="header">
    <div class="panel">
      <button @click="openConfig">Back</button>
      <div class="switches">
        <Switch name="switch-show-missing" text="Show Missing" v-model="showMissing"/>
        <Switch name="switch-show-equal" text="Show Equal" v-model="showEqual"/>
      </div>
      <button @click="dumpEntries">Export</button>
    </div>
  </div>
  <div class="entry-list">
    <div ref="placeholder" style="margin-bottom: -15px"/>
    <TranslationEntry
        v-for="(entry, index) in filtered"
        :key="index"
        :translation-key="entry.key"
        :previous-value="entry.value"
        :warning="!showMissing && entry.mark === 'missing'"
    />
  </div>
</template>

<style scoped>
.glass {
  width: 100%;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 1) 80%, rgba(255, 255, 255, 0));
  mask: linear-gradient(to bottom, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0));
  backdrop-filter: blur(2px);
  position: fixed;
  z-index: 999;
}

.header {
  position: fixed;
  height: fit-content;
  width: 100%;
  padding: 1rem;
  z-index: 1000;
}

.panel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  height: fit-content;
  width: 100%;
  border: 1px solid #b0b0b0;
  border-radius: 8px;
  background-color: white;
  padding: 5px 15px 5px 15px;
}

.entry-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: auto;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  scrollbar-width: none;
}

.panel button {
  flex: 0 0 auto
}

.switches {
  flex: 1 1 auto
}
</style>