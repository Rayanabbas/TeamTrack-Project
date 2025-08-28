<template>
  <div class="container">
    <h2>Équipe pour Projet {{ project.title }}</h2>
    <ul>
      <li v-for="collab in project.collaborators" :key="collab">{{ collab }} <button @click="removeCollaborator(collab)" class="btn btn-sm btn-danger">Supprimer</button></li>
    </ul>
    <h3>Ajouter un Collaborateur</h3>
    <input v-model="userId" type="text" placeholder="ID utilisateur" class="form-control mb-2">
    <button @click="addCollaborator" class="btn btn-primary">Ajouter</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      project: {},
      userId: '',
      error: null,
    };
  },
  async mounted() {
    try {
      const res = await axios.get(`/projects/${this.$route.params.id}`);
      this.project = res.data;
    } catch (err) {
      this.error = 'Erreur de chargement';
    }
  },
  methods: {
    async addCollaborator() {
      try {
        const res = await axios.post(`/projects/${this.$route.params.id}/collaborators`, { userId: this.userId });
        this.project = res.data;
        this.userId = '';
      } catch (err) {
        this.error = 'Erreur d\'ajout';
      }
    },
    async removeCollaborator(userId) {
      if (confirm('Supprimer ?')) {
        try {
          const res = await axios.delete(`/projects/${this.$route.params.id}/collaborators`, { data: { userId } });
          this.project = res.data;
        } catch (err) {
          this.error = 'Erreur de suppression';
        }
      }
    },
  },
};
</script>