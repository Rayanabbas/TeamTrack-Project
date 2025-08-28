<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ task.title }}</h5>
      <p class="card-text">{{ task.description }}</p>
      <p>Statut: {{ task.status }}</p>
      <button @click="$emit('edit', task)" class="btn btn-warning">Éditer</button>
      <button @click="$emit('delete', task._id)" class="btn btn-danger">Supprimer</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['task'],
};
</script>