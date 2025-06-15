<template>
  <div class="min-h-screen text-white p-6" id="bg">
    <div class="max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
    <BaseButton
    class="px-5"
    @click="()=>{router.push('/')}"
    >
      홈
    </BaseButton>

    <div class="p-3">
    <h1 class="text-3xl text-center"
    style="filter: drop-shadow(0 0 3px #00f0ff) drop-shadow(0 0 5px #00f0ff);">
      전체 게시글
    </h1>
  </div>

    <BaseButton
    @click="()=> {router.push('/posts/new')}"
    >
      글 작성
    </BaseButton>
  </div>

      <div class="mb-4 flex">
        <BaseButton
          v-for="type in ['전체', '소주', '맥주']"
          :key="type"
          @click="selectedType = type"
          class="px-5"
        >
          {{ type }}
        </BaseButton>
      </div>

      <div class="space-y-6 p-4">
        <router-link
          v-for="post in visiblePosts"
          :key="post.id"
          :to="`/posts/${post.id}`"
          class="flex flex-col md:flex-row justify-between gap-6 p-6 bg-gray-800/70 rounded-lg hover:bg-gray-700/90 transition overflow-hidden neon-border"
          
        >
          <div class="flex-1 space-y-3">
            <p class="text-cyan-300 font-semibold text-lg">📅 날짜: {{ post.drinkingDate }}</p>
            <p class="text-cyan-300 font-semibold text-lg">💰 총 가격: {{ post.totalPrice.toLocaleString() }}원</p>
            <div>
              <p class="font-semibold text-pink-400">📝 메모</p>
              <p class="text-gray-200 whitespace-pre-line leading-relaxed text-lg break-words">{{ post.memo }}</p>
            </div>
            <div>
              <p class="font-semibold text-green-400">🍶 주류 종류</p>
              <ul class="ml-6 list-disc text-white">
                <li v-for="drink in post.drinks" :key="drink.id">{{ drink.type }} ({{ drink.quantity }}병)</li>
              </ul>
            </div>
          </div>
          <div v-if="post.photoUrl" class="w-full md:w-40 h-40 flex-shrink-0 self-center md:self-start">
            <img :src="post.photoUrl" alt="photo" class="w-full h-full object-cover rounded border border-white" />
          </div>
        </router-link>
      </div>

      <!-- 무한 스크롤 감지 영역 -->
      <div ref="observerTarget" class="h-10"></div>
      
<button
  @click="scrollToTop"
  class="fixed bottom-6 right-6 w-12 h-12 bg-pink-500 hover:bg-pink-600 text-white 
         rounded-full shadow-md flex items-center justify-center text-xl transition 
         duration-200 ease-in-out border border-white/20 hover:scale-105"
  aria-label="맨 위로 이동"
  title="맨 위로"
>↑</button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import BaseButton from "../components/BaseButton.vue";
import router from "../router";

const posts = ref([]);
const visibleCount = ref(5);
const selectedType = ref("전체");
const observerTarget = ref(null);

const fetchPosts = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get("https://api.ddalkkug.kro.kr/api/v1/calendar-entries", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    posts.value = res.data.data.sort(
      (a, b) => new Date(b.drinkingDate) - new Date(a.drinkingDate)
    );
  } catch (err) {
    console.error("불러오기 실패", err);
  }
};

const filteredPosts = computed(() => {
  if (selectedType.value === "전체") return posts.value;
  return posts.value.filter((post) =>
    post.drinks.some((drink) => drink.type === selectedType.value)
  );
});

const visiblePosts = computed(() => filteredPosts.value.slice(0, visibleCount.value));

// 무한 스크롤 로직
const setupObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && visibleCount.value < filteredPosts.value.length) {
      visibleCount.value += 5;
    }
  });
  if (observerTarget.value) observer.observe(observerTarget.value);
};

const scrollToTop = () => {
  const bg = document.getElementById("bg");
  if (bg) {
    bg.scrollTo({ top: 0, behavior: "smooth" });
  }
};

onMounted(() => {
  fetchPosts();
  setupObserver();
});

watch(selectedType, () => {
  visibleCount.value = 5; // 필터 바뀌면 초기화
});
</script>

<style scoped>
@import "../styles/neon.css";
#bg {
  overflow-y: auto; /* 세로 스크롤 가능 */
  max-height: 100vh; /* 화면 높이 제한 */
  background-image: url('../assets/background-img.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

#post-neon {
  border: 2px solid #3b82f6;
  animation: borderFlicker 1s infinite;
box-shadow:
  0 0 6px #3b82f6,
  0 0 12px #3b82f6,
  0 0 18px #3b82f6;
}

@keyframes borderFlicker {
  0% {
    box-shadow:
      0 0 6px #3b82f6,
      0 0 12px #3b82f6,
      0 0 18px #3b82f6;

  }

  50% {
    box-shadow:
      0 0 3px #3b82f6,
      0 0 6px #3b82f6,
      0 0 9px #3b82f6;

  }

  100% {
    box-shadow:
      0 0 6px #3b82f6,
      0 0 12px #3b82f6,
      0 0 18px #3b82f6;

  }
}

</style>