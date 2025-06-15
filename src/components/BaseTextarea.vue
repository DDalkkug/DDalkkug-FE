<template>
  <div class="px-3 py-3">
    <div
      class="neon-border mt-2 rounded-md p-2"
      :style="{ '--neon-color': neonColor }"
    >
      <textarea
        v-bind="$attrs"
        :value="modelValue"
        rows="4"
        class="block w-full rounded-md px-3 py-1.5 text-base text-white outline-0 placeholder:text-gray-400 resize-none bg-transparent"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type : null,
  },
  neonColor: {
    type: String,
    default: "#f148fb",
  },
});
const neonColor = computed(() => props.neonColor);

defineEmits(["update:modelValue"]);
</script>

<style scoped>
@import "../styles/neon.css";
</style>