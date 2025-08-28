<template>
  <div class="container">
    <h2>Profil</h2>
    <form @submit.prevent="updateProfile">
      <div class="mb-3">
        <label>Email</label>
        <input v-model="form.email" type="email" class="form-control">
      </div>
      <div class="mb-3">
        <label>Nouveau mot de passe</label>
        <input v-model="form.password" type="password" class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">Mettre à jour</button>
    </form>
    <p v-if="success">Profil mis à jour !</p>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: { email: '', password: '' },
      success: false,
      error: null,
    };
  },
  methods: {
    async updateProfile() {
      try {
        await axios.put('/auth/profile', this.form);
        this.success = true;
      } catch (err) {
        this.error = 'Erreur de mise à jour';
      }
    },
  },
};
</script>