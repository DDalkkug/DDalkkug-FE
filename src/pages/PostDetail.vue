<template>
  <div class="min-h-screen text-white p-6" id="bg">
    <div class="max-w-3xl mx-auto bg-gray-900/95 p-8 rounded-xl shadow-lg" id="post-neon">
      <div class="flex justify-between items-center mb-6">
        <router-link
          to="/posts"
          class="inline-block text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
        >
          📜 전체 기록 보기
        </router-link>
      </div>

      <!-- 제목과 날짜 flex -->
      <div class="mb-4">
        <h1 class="text-4xl font-extrabold text-pink-400 tracking-wide mb-1">
          날짜: {{ formattedDate }}
        </h1>
        <div class="flex gap-6 text-gray-400 text-sm font-medium">
          <p>작성자 ID: <span class="text-white">{{ post?.userId }}</span></p>
          <p>작성일: <span class="text-white">{{ formattedCreatedAt }}</span></p>
        </div>
      </div>

      <hr class="border-gray-700 my-6" />

      <section class="mb-8">
        <p class="text-gray-200 whitespace-pre-line leading-relaxed text-lg">
          {{ post?.memo }}
        </p>
      </section>

      <section v-if="post?.photoUrl" class="mb-8 flex justify-center">
        <img
          :src="post.photoUrl"
          alt="게시글 사진"
          class="max-w-full max-h-96 rounded-lg border-2 border-white shadow-lg object-contain"
        />
      </section>

      <section v-if="post?.drinks?.length" class="mb-8">
        <h2 class="text-xl font-semibold text-green-400 mb-3">🍶 주류 정보</h2>
        <ul class="list-disc list-inside text-white space-y-1 text-lg">
          <li v-for="drink in post.drinks" :key="drink.id">
            종류: <span class="font-semibold">{{ drink.type }}</span> / 이름: <span class="font-semibold">{{ drink.name }}</span> / 수량: <span class="font-semibold">{{ drink.quantity }}</span>병
          </li>
        </ul>
      </section>

      <section class="mt-8 text-center">
        <p class="inline-block bg-cyan-700 bg-opacity-80 px-6 py-3 rounded-lg text-2xl font-bold text-cyan-300 shadow-lg">
          총 가격: {{ post?.totalPrice?.toLocaleString() }} 원
        </p>
      </section>

<!-- 삭제 기능 추가해야 함 -->
      
      <div v-if="isPostUser" class="mt-6 flex gap-4 justify-center">
        <router-link
          :to="`/posts/${postId}/edit`"
          class="px-5 py-2 bg-pink-500 hover:bg-pink-600 rounded text-white text-sm font-semibold shadow-md"
        >
          ✏️ 수정
        </router-link>
        <button
          @click="handleDelete"
          class="px-5 py-2 bg-red-500 hover:bg-red-600 rounded text-white text-sm font-semibold shadow-md"
        >
          🗑 삭제
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const postId = route.params.id;

const post = ref(null);
const userInfo = ref(null);


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
    console.log(userInfo.value);
  } catch (err) {
    console.error("유저정보 불러오기 실패", err);
    alert("유저 정보를 불러오는 데 실패했습니다.");
  }
}

const isPostUser = computed(()=> {
  return post.value && userInfo.value && post.value.userId === userInfo.value.id;
})

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
  if (!post.value?.drinkingDate) return "";
  return new Date(post.value.drinkingDate).toLocaleDateString();
});

const formattedCreatedAt = computed(() => {
  if (!post.value?.createdAt) return "";
  return new Date(post.value.createdAt).toLocaleString();
});

onMounted(() => {
  fetchPostDetail();
  fetchUserInfo();
});
</script>

<style scoped>
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