<template>
  <div class="min-h-screen text-white p-6" id="bg">
    <div class="max-w-2xl mx-auto bg-gray-800/90 p-8 rounded-2xl shadow-lg space-y-6 overflow-visible">
      <h1 class="text-3xl font-bold text-pink-400 text-center">
        {{ isEdit ? '✏️ 술자리 기록 수정' : '🍶 술자리 기록 작성' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-4 overflow-visible">
        <!-- 날짜 -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">날짜</label>
          <input
            type="date"
            v-model="entry.drinkingDate"
            :class="['w-full p-2 bg-gray-700 rounded neon-border', { 'has-value': entry.drinkingDate }]"
            required
          />
        </div>

        <!-- 술 종류 및 병 수 -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">술 종류 및 병 수</label>
          <div class="space-y-2">
            <!-- 소주 -->
            <div class="flex items-center gap-2">
              <span class="w-1/4 text-white">소주</span>
              <input
                v-model.number="entry.sojus"
                type="number"
                min="0"
                placeholder="병 수"
                :class="['w-3/4 p-2 bg-gray-700 rounded neon-border', { 'has-value': entry.sojus > 0 }]"
              />
            </div>
            <!-- 맥주 -->
            <div class="flex items-center gap-2">
              <span class="w-1/4 text-white">맥주</span>
              <input
                v-model.number="entry.beers"
                type="number"
                min="0"
                placeholder="병 수"
                :class="['w-3/4 p-2 bg-gray-700 rounded neon-border', { 'has-value': entry.beers > 0 }]"
              />
            </div>
          </div>
        </div>

        <!-- 가격 -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">총 가격 (₩)</label>
          <input
            type="number"
            min="0"
            v-model.number="entry.totalPrice"
            placeholder="예: 25000"
            :class="['w-full p-2 bg-gray-700 rounded neon-border', { 'has-value': entry.totalPrice > 0 }]"
          />
        </div>

        <!-- 사진 -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">사진 (선택)</label>
          <input type="file" accept="image/*" @change="handleImage" class="text-sm" />
          <img
            v-if="entry.image || entry.photoUrl"
            :src="entry.image || entry.photoUrl"
            alt="미리보기"
            class="mt-2 rounded max-h-60 object-cover"
          />
        </div>

        <!-- 메모 -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">메모</label>
          <textarea
            v-model="entry.memo"
            rows="4"
            placeholder="어디서, 누구랑, 어떤 분위기였는지 간단히 기록해보세요."
            :class="['w-full p-2 bg-gray-700 rounded neon-border', { 'has-value': entry.memo.trim().length > 0 }]"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded font-semibold text-white"
        >
          {{ isEdit ? '✅ 수정 완료' : '✍️ 작성 완료' }}
        </button>
      </form>

      <div class="pt-4 text-center">
        <router-link
          to="/posts"
          class="inline-block text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
        >
          📜 전체 기록 보기
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const postId = route.params.id;
const isEdit = computed(() => !!postId);

const entry = ref({
  userId: 1,
  drinkingDate: new Date().toISOString().slice(0, 10),
  memo: "",
  totalPrice: 0,
  sojus: 0,
  beers: 0,
  image: null,
  rawImageFile: null,
  photoUrl: null,
});

const fetchPostDetail = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const res = await axios.get(`https://api.ddalkkug.kro.kr/api/v1/calendar-entries/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data.data;
    entry.value = {
      userId: data.userId,
      drinkingDate: data.drinkingDate,
      memo: data.memo,
      totalPrice: data.totalPrice,
      sojus: data.drinks.find(d => d.type === "소주")?.quantity || 0,
      beers: data.drinks.find(d => d.type === "맥주")?.quantity || 0,
      image: null,
      rawImageFile: null,
      photoUrl: data.photoUrl || null,
    };
  } catch (err) {
    console.error("불러오기 실패", err);
    alert("게시글을 불러오는 데 실패했습니다.");
    router.push("/posts");
  }
};

onMounted(() => {
  if (isEdit.value) fetchPostDetail();
});

const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    entry.value.rawImageFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      entry.value.image = reader.result;
      entry.value.photoUrl = null;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  const token = localStorage.getItem("accessToken");
  const formData = new FormData();

  formData.append("drinkingDate", entry.value.drinkingDate);
  formData.append("memo", entry.value.memo);
  formData.append("totalPrice", entry.value.totalPrice.toString());

  formData.append("drinks[0].type", "소주");
  formData.append("drinks[0].quantity", entry.value.sojus.toString());
  formData.append("drinks[1].type", "맥주");
  formData.append("drinks[1].quantity", entry.value.beers.toString());

  if (entry.value.rawImageFile) {
    formData.append("image", entry.value.rawImageFile);
  }

  try {
    if (isEdit.value) {
      await axios.put(
        `https://api.ddalkkug.kro.kr/api/v1/calendar-entries/${postId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert("✅ 게시글이 수정되었습니다!");
    } else {
      await axios.post(
        'https://api.ddalkkug.kro.kr/api/v1/calendar-entries',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert("✅ 기록이 저장되었습니다!");
    }
    router.push("/posts");
  } catch (err) {
    console.error("에러 발생:", err);
    alert("❌ 저장 또는 수정 중 오류가 발생했습니다.");
  }
};
</script>

<style scoped>
#bg {
  background-image: url('../assets/background-img.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.neon-border {
  border: 2px solid #f472b6;
  background-color: #1f2937;
  color: #fff;
  box-shadow:
    0 0 4px #f472b6,
    0 0 8px #f472b6;
  transition: all 0.25s ease-in-out;
  outline: none;
}

.neon-border.has-value {
  border-color: #3b82f6;
  box-shadow:
    0 0 4px #3b82f6,
    0 0 10px #3b82f6,
    0 0 15px #3b82f6;
}

.neon-border:focus {
  transform: scale(1.01);
  border-color: #3b82f6;
  box-shadow:
    0 0 6px #3b82f6,
    0 0 12px #3b82f6,
    0 0 20px #3b82f6;
}


</style>
