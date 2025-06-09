<template>
  <div class="absolute inset-0 bg-black/30" id="flicker"></div>
  <div
    class="flex h-[100vh] w-[100%] flex-col items-center justify-center"
    id="bg"
  >
    <img src="../assets/logo_2.png" class="z-100 w-[600px]" id="logo" />
    <button
      @click="() => router.push('/main')"
      class="z-300 mb-[100px] h-[50px] w-[140px] cursor-pointer rounded-[20px] border border-white bg-white/40 text-[16px] text-white hover:bg-white/50"
    >
      딸꾹 시작하기
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(30px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes logoFlicker {
  0% {
    opacity: 1;
  }
  10% {
    opacity: 0.8;
  }
  20% {
    opacity: 1;
  }
  30% {
    opacity: 0.8;
  }
  40% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  60% {
    opacity: 1;
  }
  70% {
    opacity: 0.8;
  }
  80% {
    opacity: 1;
  }
  90% {
    opacity: 0.9;
  }
  100% {
    opacity: 1;
  }
}

@keyframes flicker {
  0% {
    background-color: rgba(0, 0, 0, 0.4);
  }
  3% {
    background-color: rgba(0, 0, 0, 0.8);
  }
  6% {
    background-color: rgba(0, 0, 0, 0.2);
  }
  9% {
    background-color: rgba(0, 0, 0, 0.7);
  }
  12% {
    background-color: rgba(0, 0, 0, 0.3);
  }
  15% {
    background-color: rgba(0, 0, 0, 0.6);
  }
  20% {
    background-color: rgba(0, 0, 0, 0.4);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.3);
  } /* 안정 상태 */
}

#bg {
  background-image: url("../assets/background-img.png");
  background-size: cover;
  background-position: center;
}

#flicker {
  animation: flicker 4s linear;
}

#logo {
  /* animation: float 3s ease-in-out infinite; */

  filter: drop-shadow(0 0 5px #f148fb) drop-shadow(0 0 10px #f148fb)
    drop-shadow(0 0 10px #f148fb);
  animation: logoFlicker 1s infinite;
}
</style>
