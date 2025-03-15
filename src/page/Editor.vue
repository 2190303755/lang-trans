<script setup>
import {computed, onBeforeUnmount, onMounted, ref, useTemplateRef} from 'vue';
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
  if (window.confirm("Do you really want to leave?")) {
    showConfig.value = true;
  }
}

function syncHeight() {
  const height = header.value.offsetHeight;
  glass.value.style.minHeight = height + parseInt(getComputedStyle(document.documentElement).fontSize) * 0.5 + 'px';
  placeholder.value.style.minHeight = height + 'px';
}

function requireConfirmation(event) {
  event.preventDefault();
  event.returnValue = "";
}

onMounted(() => {
  window.addEventListener('resize', syncHeight);
  window.addEventListener('load', syncHeight);
  window.addEventListener("beforeunload", requireConfirmation);
  syncHeight();
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', syncHeight);
  window.removeEventListener('load', syncHeight);
  window.removeEventListener("beforeunload", requireConfirmation);
});
</script>

<template>
  <div class="glass" ref="glass"/>
  <div class="header" ref="header">
    <div class="panel">
      <button @click="openConfig" class="round-button" title="Back">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,11H7.83l5.59,-5.59L12,4l-8,8 8,8 1.41,-1.41L7.83,13H20v-2z"/>
        </svg>
      </button>
      <div class="switches">
        <Switch name="switch-show-missing" text="Show Missing" v-model="showMissing"/>
        <Switch name="switch-show-equal" text="Show Equal" v-model="showEqual"/>
      </div>
      <button @click="dumpEntries" class="round-button" title="Export">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M19,12v7L5,19v-7L3,12v7c0,1.1 0.9,2 2,2h14c1.1,0 2,-0.9 2,-2v-7h-2zM13,12.67l2.59,-2.58L17,11.5l-5,5 -5,-5 1.41,-1.41L11,12.67L11,3h2z"/>
        </svg>
      </button>
    </div>
  </div>
  <div class="entry-list">
    <div ref="placeholder" style="margin-bottom: -0.5rem"/>
    <TranslationEntry
        v-for="entry in filtered"
        :key="entry.key"
        :translation-key="entry.key"
        :previous-value="entry.value"
        :mark="entry.mark"
        :warning="!showMissing"
    />
    <div v-if="filtered.length" style="height: 1rem"/>
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
  gap: 10px;
  height: fit-content;
  width: 100%;
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  background-color: white;
  padding: 5px 10px 5px 10px;
}

.entry-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  scrollbar-width: none;
}

.round-button {
  padding: 8px;
  border-radius: 50%;
  text-align: center;
  text-decoration: none;
  line-height: 0;
  font-size: 0;
}

.round-button path {
  fill: var(--color-text)
}

.round-button:hover path {
  fill: var(--color-button-hovered-text);
}

.round-button:active path {
  fill: var(--color-text);
}

.panel button {
  flex: 0 0 auto
}

.switches {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>