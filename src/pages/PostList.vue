<template>
  <div class="min-h-screen p-4 text-white sm:p-6" id="bg">
    <div class="mx-auto max-w-6xl">
      <!-- 상단 헤더 -->
      <div
        class="relative mb-6 flex flex-wrap items-center justify-between gap-4"
      >
        <h1
          class="flex-1 text-center text-2xl font-bold sm:text-3xl"
          style="
            filter: drop-shadow(0 0 3px #00f0ff) drop-shadow(0 0 5px #00f0ff);
          "
        >
          게시글 목록
        </h1>
      </div>

      <div class="flex justify-between">
        <BaseButton
          class="min-w-[90px] text-sm sm:text-lg"
          @click="() => router.push('/main')"
        >
          홈
        </BaseButton>
        <BaseButton
          class="min-w-[102px] text-sm sm:text-lg"
          @click="() => router.push({ path: '/posts', query: {} })"
        >
          전체 게시글
        </BaseButton>
        <BaseButton
          class="min-w-[90px] text-sm sm:text-lg"
          @click="() => router.push('/posts/new')"
        >
          글 작성
        </BaseButton>
      </div>

      <!-- 게시글 리스트 -->
      <div class="space-y-6 p-2 sm:p-4">
        <router-link
          v-for="post in visiblePosts"
          :key="post.id"
          :to="`/posts/${post.id}`"
          class="neon-border flex flex-col justify-between gap-6 overflow-hidden rounded-lg bg-gray-800/70 p-4 transition hover:bg-gray-700/90 sm:p-6 md:flex-row"
        >
          <div class="ml-3 flex-1 space-y-3">
            <p
              class="text-lg font-semibold"
              style="
                text-shadow:
                  0 0 2px #00aa00,
                  0 0 4px #00aa00,
                  0 0 8px #00aa00;
              "
            >
              적신 날 : {{ post.drinkingDate }}
            </p>
            <p
              class="text-lg font-semibold"
              style="
                text-shadow:
                  0 0 2px #00aa00,
                  0 0 4px #00aa00,
                  0 0 8px #00aa00;
              "
            >
              총 가격 : {{ post.totalPrice.toLocaleString() }}원
            </p>

            <div>
              <p
                class="text-lg font-semibold"
                style="
                  text-shadow:
                    0 0 2px #fb64b6,
                    0 0 4px #fb64b6,
                    0 0 8px #fb64b6;
                "
              >
                메모
              </p>
              <p
                class="text-base leading-relaxed break-all whitespace-pre-line text-gray-200 sm:text-lg"
              >
                {{ post.memo }}
              </p>
            </div>

            <div>
              <p
                class="text-lg font-semibold text-green-400"
                style="
                  text-shadow:
                    0 0 2px #00aa00,
                    0 0 4px #00aa00,
                    0 0 8px #00aa00;
                "
              >
                술 정보
              </p>
              <ul
                class="ml-6"
                style="
                  text-shadow:
                    0 0 2px #00aa00,
                    0 0 4px #00aa00,
                    0 0 8px #00aa00;
                "
              >
                <li
                  v-for="drink in post.drinks"
                  :key="drink.id"
                  class="font-semibold"
                  :style="{
                    textShadow:
                      drink.type === '소주'
                        ? '0 0 2px #00ff00, 0 0 4px #00ff00, 0 0 8px #00ff00'
                        : drink.type === '맥주'
                          ? '0 0 2px #facc15, 0 0 4px #facc15, 0 0 8px #facc15'
                          : '0 0 2px #ffffff, 0 0 4px #ffffff, 0 0 8px #ffffff',
                  }"
                >
                  {{ drink.type }} ({{ drink.quantity }}병)
                </li>
              </ul>
              <p
                class="my-3 font-semibold"
                style="
                  text-shadow:
                    0 0 2px #00aa00,
                    0 0 4px #00aa00,
                    0 0 8px #00aa00;
                "
              >
                {{
                  groupMap[post.groupId]
                    ? "소속 - " + groupMap[post.groupId]
                    : "솔플"
                }}
              </p>
            </div>
          </div>

          <div
            v-if="post.photoUrl"
            class="mr-3 aspect-square w-full flex-shrink-0 self-center md:w-40 md:self-start"
          >
            <img
              :src="post.photoUrl"
              alt="photo"
              class="h-full w-full rounded border border-white object-contain"
            />
          </div>
        </router-link>
      </div>

      <div ref="observerTarget" class="h-10"></div>

      <button
        @click="scrollToTop"
        class="fixed right-6 bottom-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-pink-500 text-xl text-white shadow-md transition duration-200 ease-in-out hover:scale-105 hover:bg-pink-600"
        aria-label="맨 위로 이동"
        title="맨 위로"
      >
        ↑
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import BaseButton from "../components/BaseButton.vue";
import router from "../router";
import { useRoute } from "vue-router";

const posts = ref([]);
const visibleCount = ref(5);
const selectedType = ref("전체");
const observerTarget = ref(null);
const groupMap = ref({});

const route = useRoute();

const year = route.query.year;
const month = route.query.month;
const day = route.query.day;

const fetchPosts = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get(
      "https://api.ddalkkug.kro.kr/api/v1/calendar-entries",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    posts.value = res.data.data.sort(
      (a, b) => new Date(b.drinkingDate) - new Date(a.drinkingDate),
    );
  } catch (err) {
    console.error("불러오기 실패", err);
  }
};

const fetchDayPosts = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    // 쿼리 스트링 조합
    const queryString = `?year=${year}&month=${month}&day=${day}`;

    const res = await axios.get(
      `https://api.ddalkkug.kro.kr/api/v1/calendar-entries/day${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    posts.value = res.data.data.sort(
      (a, b) => new Date(b.drinkingDate) - new Date(a.drinkingDate),
    );
  } catch (err) {
    console.error("게시글 불러오기 실패", err);
    alert("게시글 정보를 불러오는 데 실패했습니다.");
    router.push("/main");
  }
};

const fetchGroups = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get(
      "https://api.ddalkkug.kro.kr/api/v1/group-info",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const map = {};
    for (const group of res.data.data) {
      map[group.id] = group.name;
    }
    groupMap.value = map;
  } catch (err) {
    console.error("그룹 정보 불러오기 실패", err);
  }
};

const visiblePosts = computed(() => posts.value.slice(0, visibleCount.value));

// 무한 스크롤 로직
const setupObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && visibleCount.value < posts.value.length) {
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

watch(
  () => route.query,
  () => {
    if (route.query.year && route.query.month && route.query.day) {
      fetchDayPosts();
    } else {
      fetchPosts();
    }
  },
);

onMounted(() => {
  fetchGroups();
  setupObserver();

  if (year && month && day) {
    fetchDayPosts();
  } else {
    fetchPosts();
  }
});

watch(selectedType, () => {
  visibleCount.value = 5; // 필터 바뀌면 초기화
});
</script>

<style scoped>
@import "../styles/neon.css";

* {
  overflow: visible;
}

#bg {
  overflow-y: auto; /* 세로 스크롤 가능 */
  max-height: 100vh; /* 화면 높이 제한 */
  background-image: url("../assets/background-img.png");
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
