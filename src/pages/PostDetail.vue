<template>
  <div class="min-h-screen text-white p-6" id="bg">
    <div v-if="post" class="max-w-3xl mx-auto bg-gray-900/95 p-8 rounded-xl shadow-lg neon-border" >
      <div class="flex justify-end items-center">
        <BaseButton
        style="font-size: smaller;"
        @click="()=>{router.push('/posts')}"
        >
          전체 기록 보기
        </BaseButton>
      </div>

      <div class="mb-3">
        <h1 class="text-4xl font-extrabold text-pink-400 tracking-wide mb-3">
          날짜 : {{ formattedDate }}
        </h1>
        <div class="flex gap-6 text-gray-400 text-sm font-medium">
          <p>작성자 : <span class="text-white">{{ userInfo.nickname }}</span></p>
          <p>그룹 : <span class="text-white">{{ groupMap[post.groupId] || '솔플' }}</span></p>
          <p>작성일 : <span class="text-white">{{ formattedCreatedAt }}</span></p>
        </div>
      </div>

      <hr class="border-gray-700 mb-3" />

      <section class="mb-8">
        <p class="text-gray-200 whitespace-pre-line leading-relaxed text-lg break-words">
          {{ post.memo }}
        </p>
      </section>

      <section v-if="post.photoUrl" class="mb-8 flex justify-center">
        <img
          :src="post.photoUrl"
          alt="게시글 사진"
          class="max-w-full max-h-full object-contain rounded border border-white"
        />
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-green-400 mb-3">주류 정보</h2>
        <ul class="ml-6 text-white space-y-1 text-lg">
          <li v-for="drink in post.drinks" :key="drink.id">
            <span class="font-semibold">{{ drink.type }} - {{drink.quantity}}병</span>
          </li>
        </ul>
      </section>

      <section class="mt-8 text-center">
        <p class="inline-block  px-6 py-3 rounded-lg text-2xl font-bold shadow-lg">
          총 가격 : {{ post.totalPrice.toLocaleString() }} 원
        </p>
      </section>
  
      <div class="mt-6 flex gap-4 justify-center">
        <BaseButton
          @click="router.push(`/posts/${postId}/edit`)"
        >
          수정
        </BaseButton>
        <BaseButton
          @click="handleDelete"
        >
          삭제
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import BaseButton from "../components/BaseButton.vue";

const route = useRoute();
const router = useRouter();
const postId = route.params.id;

const post = ref(null);
const userInfo = ref(null);
const groupMap = ref({});


const fetchPostDetail = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get(
      `https://api.ddalkkug.kro.kr/api/v1/calendar-entries/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    post.value = res.data.data;
  } catch (err) {
    console.error("게시글 불러오기 실패", err);
    alert("게시글 정보를 불러오는 데 실패했습니다.");
    router.push("/posts");
  }
};

const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get(
      "https://api.ddalkkug.kro.kr/api/v1/member/user-info",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    userInfo.value = res.data.data;
  } catch (err) {
    console.error("유저정보 불러오기 실패", err);
    alert("유저 정보를 불러오는 데 실패했습니다.");
  }
}

const fetchGroups = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get("https://api.ddalkkug.kro.kr/api/v1/group-info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const map = {};
    for (const group of res.data.data) {
      map[group.id] = group.name;
    }
    groupMap.value = map;
  } catch (err) {
    console.error("그룹 정보 불러오기 실패", err);
  }
};

const handleDelete = async () => {
  const confirmed = confirm("정말 삭제하시겠습니까?");
  if (!confirmed) return;

  const token = localStorage.getItem("accessToken");
  try {
    await axios.delete(
      `https://api.ddalkkug.kro.kr/api/v1/calendar-entries/${postId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("삭제 완료!");
    router.push("/posts");
  } catch (err) {
    console.error("삭제 실패", err);
    alert("삭제에 실패했습니다.");
  }
};

const formattedDate = computed(() => {
  if (!post.value.drinkingDate) return "";
  return new Date(post.value.drinkingDate).toLocaleDateString();
});

const formattedCreatedAt = computed(() => {
  if (!post.value.createdAt) return "";
  return new Date(post.value.createdAt).toLocaleString();
});

onMounted(() => {
  fetchPostDetail();
  fetchUserInfo();
  fetchGroups();
});
</script>

<style scoped>
@import "../styles/neon.css";

* {
  overflow: visible;
}

#bg {
  overflow-y: auto;
  max-height: 100vh;
  background-image: url('../assets/background-img.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

#post-neon {
  border: 2px solid #3b82f6;
  animation: borderFlicker 1.5s infinite;
  box-shadow:
    0 0 8px #3b82f6,
    0 0 16px #3b82f6,
    0 0 24px #3b82f6;
  transition: box-shadow 0.1s ease;
}

#post-neon:hover {
  box-shadow:
    0 0 120px #3b82f6,
    0 0 280px #3b82f6,
    0 0 360px #3b82f6;
}

@keyframes borderFlicker {
  0%, 100% {
    box-shadow:
      0 0 8px #3b82f6,
      0 0 16px #3b82f6,
      0 0 24px #3b82f6;
  }
  50% {
    box-shadow:
      0 0 4px #3b82f6,
      0 0 10px #3b82f6,
      0 0 14px #3b82f6;
  }
}
</style>