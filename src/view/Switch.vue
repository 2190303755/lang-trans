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
  width: 60px;
  height: 34px;
  background-color: #ccc;
  border-radius: 34px;
  cursor: pointer;
  transition: background-color 0.25s;
}

.switch label:after {
  content: '';
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: white;
  top: 4px;
  left: 4px;
  transition: transform 0.25s;
}

.switch input:checked + label {
  background-color: hsla(160, 100%, 35%, 1);
}

.switch input:checked + label:after {
  transform: translateX(26px);
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>