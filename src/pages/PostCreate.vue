<template>
  <div class="min-h-screen text-white p-6" id="bg">
    <div class="max-w-2xl mx-auto bg-gray-800/90 p-8 rounded-2xl shadow-lg space-y-6 overflow-visible">
      <h1 class="text-3xl font-bold text-pink-400 text-center">🍶 술자리 기록 작성</h1>

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
          <div class="flex gap-2">
            <select
              v-model="entry.drink.type"
              :class="['w-1/2 p-2 bg-gray-700 rounded neon-border', { 'has-value': entry.drink.type }]"
              required
            >
              <option disabled value="">주종 선택</option>
              <option value="소주">소주</option>
              <option value="맥주">맥주</option>
            </select>
            <input
              v-model.number="entry.drink.quantity"
              type="number"
              min="0"
              placeholder="병 수"
              required
              :class="['w-1/2 p-2 bg-gray-700 rounded neon-border', { 'has-value': entry.drink.quantity > 0 }]"
            />
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
            v-if="entry.image"
            :src="entry.image"
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
          ✍️ 작성 완료
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
import { ref } from 'vue';
import axios from 'axios';

const entry = ref({
  userId: 1,
  drinkingDate: new Date().toISOString().slice(0, 10),
  memo: "",
  totalPrice: 0,
  drink: { type: '', quantity: 0 },
  image: null,
});

const handleImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    entry.value.rawImageFile = file; // 👈 FormData용 원본 파일 저장

    const reader = new FileReader();
    reader.onload = () => {
      entry.value.image = reader.result; // 미리보기용 base64
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  const token = localStorage.getItem("accessToken");
  // console.log(token)
  // if (!token) {
  //   alert("❌ 로그인 정보가 없습니다. 토큰이 없습니다.");
  //   return;
  // }

  // const payload = {
  //   userId: entry.value.userId,
  //   drinkingDate: entry.value.drinkingDate,
  //   memo: entry.value.memo,
  //   totalPrice: entry.value.totalPrice,
  //   drinks: [{ type: entry.value.drink.type, quantity: entry.value.drink.quantity }],
  //   photoUrl: null,
  // };

const formData = new FormData();

// 문자열 또는 숫자 데이터
formData.append("drinkingDate", entry.value.drinkingDate);
formData.append("memo", entry.value.memo);
formData.append("totalPrice", entry.value.totalPrice.toString());
formData.append("drinks[0].type",  entry.value.drink.type);
formData.append("drinks[0].type", entry.value.drink.quantity);

// 이미지가 있으면 포함
if (entry.value.rawImageFile) {
  formData.append("image", entry.value.rawImageFile); // key는 서버 요구사항에 맞춰 변경
}

  try {
    await axios.post(
      'https://api.ddalkkug.kro.kr/api/v1/calendar-entries',
      formData,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzQ5NzA2NjExfQ.yIPqkLtDvgz5W152DAQjCDbAgFTccw7ToUAxDzsWbR8djuBc7weCL_puupXdqan0ekz8JbXdWkjLxmvcIdZAVA`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    alert("✅ 기록이 성공적으로 저장되었습니다!");
  } catch (err) {
    console.error("❌ 오류:", err.response?.data || err.message);
    if (err.response?.status === 401) {
      alert("❌ 인증 실패: 유효하지 않은 토큰입니다.");
    } else {
      alert("❌ 저장 실패: 서버 오류입니다.");
    }
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
  border: 2px solid #f472b6; /* 부드러운 분홍 */
  background-color: #1f2937; /* 어두운 배경 (gray-800) */
  color: #fff;
  box-shadow:
    0 0 4px #f472b6,
    0 0 8px #f472b6;
  transition: all 0.25s ease-in-out;
  outline: none;
}

.neon-border.has-value {
  border-color: #3b82f6; /* cyan-400 */
  box-shadow:
    0 0 4px #3b82f6,
    0 0 10px #3b82f6,
    0 0 15px #3b82f6;
}

.neon-border:focus {
  transform: scale(1.01); /* 약간 커지게 */
  border-color: #3b82f6; /* blue-500 */
  box-shadow:
    0 0 6px #3b82f6,
    0 0 12px #3b82f6,
    0 0 20px #3b82f6;
}

</style>