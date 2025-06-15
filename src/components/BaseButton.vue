<template>
  <div class="px-3 py-3">
    <button
      class="neon-border flex w-full justify-center rounded-md px-3 py-3 text-lg font-extrabold text-white shadow-xs hover:cursor-pointer disabled:text-gray-500"
      :style="{ '--neon-color': currentColor }"
      v-bind="$attrs"
      :value="modelValue"
      @click="$emit('click', $event)"
      @mouseover="handleHover"
      @mouseleave="handleLeave"
    >
      <slot />
    </button>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

// ############## 사용 예시 ##############ㅁ
// <BaseButton
//     :neonColor="#f148fb" // 기본 네온
//     :hoverColor="#00b8ff" // hove시 네온
// >
// ** 텍스트 **
// </BaseButton>
// 기존의 <Button>과 동일하게 사용
// neonColor과 hoverColor를 통해 네온 색상 지정
// ######################################

const props = defineProps({
  neonColor: {
    default: "#00f0ff",
  },
  hoverColor: { default: "#00b8ff", type: String },
});

const currentColor = ref(props.neonColor);

const handleHover = () => {
  currentColor.value = props.hoverColor;
};

const handleLeave = () => {
  currentColor.value = props.neonColor;
};

defineEmits(["click"]);
</script>

<style scoped>
@import "../styles/neon.css";
</style>