<template>
  <div class="container">
    <h2>{{ project.title }}</h2>
    <p>{{ project.description }}</p>
    <router-link :to="`/project/${$route.params.id}/team`" class="btn btn-secondary">Équipe</router-link>
    <h3>Tâches</h3>
    <TaskCard v-for="task in tasks" :key="task._id" :task="task" @edit="editTask" @delete="deleteTask" />
    <h3>Créer une Tâche</h3>
    <FormComponent titleLabel="Titre" @submit="createTask">
      <div class="mb-3">
        <label>Statut</label>
        <select v-model="form.status" class="form-control">
          <option>à faire</option>
          <option>en cours</option>
          <option>terminé</option>
        </select>
      </div>
      <div class="mb-3">
        <label>Assigné à (ID utilisateur)</label>
        <input v-model="form.assignedTo" type="text" class="form-control">
      </div>
    </FormComponent>
    <button @click="deleteProject" class="btn btn-danger">Supprimer Projet</button>
    <p v-if="loading">Chargement...</p>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import TaskCard from '../components/TaskCard.vue';
import FormComponent from '../components/FormComponent.vue';

export default {
  components: { TaskCard, FormComponent },
  data() {
    return {
      project: {},
      tasks: [],
      form: { status: 'à faire', assignedTo: '' },
      loading: false,
      error: null,
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const projectRes = await axios.get(`/projects/${this.$route.params.id}`);
      this.project = projectRes.data;
      const tasksRes = await axios.get(`/tasks/${this.$route.params.id}`);
      this.tasks = tasksRes.data;
    } catch (err) {
      this.error = 'Erreur de chargement';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async createTask(form) {
      try {
        const res = await axios.post(`/tasks/${this.$route.params.id}`, { ...form, ...this.form });
        this.tasks.push(res.data);
      } catch (err) {
        this.error = 'Erreur de création';
      }
    },
    async editTask(task) {
      const newTitle = prompt('Nouveau titre', task.title);
      if (newTitle) {
        try {
          const res = await axios.put(`/tasks/${task._id}`, { title: newTitle });
          const index = this.tasks.findIndex(t => t._id === task._id);
          this.tasks[index] = res.data;
        } catch (err) {
          this.error = 'Erreur d\'édition';
        }
      }
    },
    async deleteTask(id) {
      if (confirm('Supprimer ?')) {
        try {
          await axios.delete(`/tasks/${id}`);
          this.tasks = this.tasks.filter(t => t._id !== id);
        } catch (err) {
          this.error = 'Erreur de suppression';
        }
      }
    },
    async deleteProject() {
      if (confirm('Supprimer le projet ?')) {
        try {
          await axios.delete(`/projects/${this.$route.params.id}`);
          this.$router.push('/dashboard');
        } catch (err) {
          this.error = 'Erreur de suppression';
        }
      }
    },
  },
};
</script>