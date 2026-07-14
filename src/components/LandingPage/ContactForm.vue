<template>
  <div class="contact-form-container">
    <form @submit.prevent="handleSubmit" class="form-card">
      <h3 class="form-title">Humse Rabta Karein</h3>

      <div class="form-group">
        <label for="name">Naam</label>
        <input id="name" type="text" v-model="formData.name" placeholder="Aapka Naam" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="formData.email" placeholder="Aapka Email" required />
      </div>

      <div class="form-group">
        <label for="message">Paigham</label>
        <textarea id="message" v-model="formData.message" placeholder="Aapka Paigham..." rows="4" required></textarea>
      </div>

      <button type="submit" :disabled="status === 'Bhej rahe hain...'">
        {{ status || 'Bhejein' }}
      </button>

      <p v-if="resultMessage" class="result-message">{{ resultMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  name: '',
  email: '',
  message: '',
});

const status = ref('');
const resultMessage = ref('');

async function handleSubmit() {
  status.value = 'Bhej rahe hain...'; // Sending...
  resultMessage.value = '';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: 'YAHAN_APNA_ACCESS_KEY_DALEIN', // <-- Step 1 se copy kiya hua key yahan paste karein
        subject: 'Naya Form Submission!',
        name: formData.value.name,
        email: formData.value.email,
        message: formData.value.message,
      }),
    });

    const result = await response.json();

    if (result.success) {
      resultMessage.value = 'Shukriya! Aapka paigham bhej diya gaya hai.';
      formData.value = { name: '', email: '', message: '' }; // Form ko khali kar dein
    } else {
      resultMessage.value = 'Kuch ghalat ho gaya. Dobara koshish karein.';
    }
  } catch (error) {
    resultMessage.value = 'Error! Paigham nahi ja saka.';
  } finally {
    status.value = '';
  }
}
</script>

<style scoped>
.contact-form-container { display: flex; justify-content: center; padding: 2rem; }
.form-card { display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 500px; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); background: white; }
.form-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; text-align: center; }
.form-group { display: flex; flex-direction: column; }
label { margin-bottom: 0.5rem; font-weight: 500; }
input, textarea { padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
button { padding: 0.75rem; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; font-weight: bold; transition: background-color 0.2s; }
button:hover { background-color: #0056b3; }
button:disabled { background-color: #a0c3e6; cursor: not-allowed; }
.result-message { margin-top: 1rem; text-align: center; font-weight: 500; }
</style>
