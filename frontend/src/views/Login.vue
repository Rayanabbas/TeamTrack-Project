<template>
  <div class="container">
    <h2>Connexion</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label>Email</label>
        <input v-model="form.email" type="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label>Mot de passe</label>
        <input v-model="form.password" type="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary">Se connecter</button>
    </form>
    <p><router-link to="/register">S'inscrire</router-link></p>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: { email: '', password: '' },
      error: null,
    };
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', this.form);
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = 'Erreur de connexion';
      }
    },
  },
};
</script>