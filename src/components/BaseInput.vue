<template>
  <!-- 이 최상위 div는 네온 효과를 보장하기 위한 최소 padding을 설정 -->
  <div class="px-3 py-3">
    <div
      class="neon-border mt-2 rounded-md p-2"
      :style="{ '--neon-color': neonColor }"
    >
      <input
        v-bind="$attrs"
        :value="modelValue"
        class="sm:text-md/6 block w-full rounded-md px-3 py-1.5 text-base text-white outline-0 placeholder:text-gray-400"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
// ############## 사용 예시 ##############
// <BaseInput
//     type="email"
//     name="email"
//     autocomplete="email"
//     placeholder="example@example.com"
//     v-model="emailValue"
//     neonColor="#f148fb">
// </BaseInput>
// 기존의 <input>과 동일하게 사용
// neonColor를 통해 네온 색상 지정
// ######################################

// Input을 분리하기 위해 필요한 값들
// 1. v-model을 위한 함수 => v-model(양방향 바인딩)의 생명 범위(scope)는 단일 컴포넌트 내이기 때문에
//    부모와 자식 관계에서는 직접 연결해줘야 한다. --> 대체로 react에서 자주 구현
// 2. type , name, id, autocomplete, placeholder
// 목표 : 기존 input과 분간이 안가는 편안한 사용

// 1번의 자세한 구현에 대한 내용
// https://ko.vuejs.org/guide/components/v-model
// 위 링크의 항목 중 '내부구조' 부분을 잘 보는 것
// 아래의 defineProps와 defineEmits은 v-model의 기능을
// '오버라이드' 해줘서 커스텀한 것

// 추후 수정 ---> Vue 3.4 부터 지원되는 defineModel을 사용해서 더욱 간소화

// 부모 --> 자식 : 값 전달
const props = defineProps({
  modelValue: {
    type : null,
  },
  neonColor: {
    type: null,
    default: "#f148fb",
  },
});

const neonColor = computed(() => props.neonColor);

// 자식 --> 부모 : 이벤트 전달
// 자식이 부모한테 input이 발생하는 이벤트를 전달
// 자세한 것 : https://ko.vuejs.org/guide/components/events
defineEmits(["update:modelValue"]);
</script>

<style scoped>
@import "../styles/neon.css";
</style>