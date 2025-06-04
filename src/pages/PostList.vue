<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between itmes-center mb-6">
        <router-link
          to="/"
          class="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded text-white font-semibold"
        >
          <p>홈</p>
        </router-link>
        <h1 class="text-3xl font-bold text-cyan-400">전체 게시글</h1>
        <router-link
          to="/posts/new"
          class="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded text-white font-semibold"
        >
          <p>글 작성</p>
        </router-link>
      </div>
      <div class="space-y-4">
        <div
          v-for="post in posts"
          :key="post.id"
          class="p-4 bg-gray-800 rounded hover:bg-gray-700 transition border-2 border-cyan-400 shadow-[0_0_10px_#22d3ee]"
        >
          <!-- 네온사인 효과 추가 -->
          <router-link :to="`/posts/${post.id}`">
            <p>{{ post.id }}</p>
            <p>제목 : {{ post.title }}</p>
            <p>작성자 : {{ post.author }}</p>
            <p>내용 : {{ post.content }}</p>
            <p>작성일 : {{ post.date }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 데이터 예시
const posts = ref([
  {
    id: 1,
    title: "멕시칸 ㄱㄱ?",
    author: "추창우",
    date: "2024-06-01",
    content: "치맥 ㄱㄱ",
  },
  {
    id: 2,
    title: "문래 ㄱㄱ?",
    author: "권오윤",
    date: "2024-05-30",
    content: "오늘 재워준다. 다 드루와.",
  },
]);

// const posts = ref([]);

// const fetchPost = async () => {
//   try {
//     const res = await axios.get("");
//     posts.value = res.data;
//   } catch (err) {
//     console.error(err);
//   }
// };
</script>

<style scoped></style>