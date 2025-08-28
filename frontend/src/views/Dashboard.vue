<template>
  <div class="container">
    <h2>Dashboard</h2>
    <h3>Mes Projets</h3>
    <ProjectCard v-for="project in projects" :key="project._id" :project="project" />
    <h3>Créer un Projet</h3>
    <FormComponent titleLabel="Titre" @submit="createProject" />
    <p v-if="loading">Chargement...</p>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import ProjectCard from '../components/ProjectCard.vue';
import FormComponent from '../components/FormComponent.vue';

export default {
  components: { ProjectCard, FormComponent },
  data() {
    return {
      projects: [],
      loading: false,
      error: null,
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const res = await axios.get('/projects');
      this.projects = res.data;
    } catch (err) {
      this.error = 'Erreur de chargement';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async createProject(form) {
      try {
        const res = await axios.post('/projects', form);
        this.projects.push(res.data);
      } catch (err) {
        this.error = 'Erreur de création';
      }
    },
  },
};
</script>