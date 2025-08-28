<template>
  <div class="container">
    <h2>Inscription</h2>
    <form @submit.prevent="register">
      <div class="mb-3">
        <label>Nom</label>
        <input v-model="form.name" type="text" class="form-control" required>
      </div>
      <div class="mb-3">
        <label>Email</label>
        <input v-model="form.email" type="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label>Mot de passe</label>
        <input v-model="form.password" type="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary">S'inscrire</button>
    </form>
    <p><router-link to="/login">Se connecter</router-link></p>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: { name: '', email: '', password: '' },
      error: null,
    };
  },
  methods: {
    async register() {
      try {
        await this.$store.dispatch('register', this.form);
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = 'Erreur d\'inscription';
      }
    },
  },
};
</script>