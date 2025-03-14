<script setup>
const model = defineModel();
const {
  name,
  text
} = defineProps({
  name: String,
  text: String
});
</script>

<template>
  <div class="switch-container">
    <span>{{ text }}</span>
    <div class="switch">
      <input type="checkbox" :id="name" v-model="model">
      <label :for="name"></label>
    </div>
  </div>
</template>

<style scoped>
.switch input {
  display: none;
}

.switch label {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 32px;
  background-color: var(--color-switch-off);
  border-radius: 32px;
  cursor: pointer;
  transition: border 0.25s, background-color 0.25s;
  border: 2px solid #b0b0b0;
}

.switch label:after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--color-outline);
  top: 6px;
  left: 6px;
  transition: background-color 0.25s, width 0.25s, height 0.25s, transform 0.25s;
}

.switch input:checked + label {
  border: 2px solid var(--color-primary);
  background-color: var(--color-primary);
}

.switch input:checked + label:after {
  width: 24px;
  height: 24px;
  background-color: var(--color-on-primary);
  transform: translateX(16px) translateY(-4px);
}

.switch-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
</style>