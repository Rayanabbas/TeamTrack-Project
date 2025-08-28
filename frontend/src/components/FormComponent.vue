<template>
  <form @submit.prevent="submit">
    <div class="mb-3">
      <label class="form-label">{{ titleLabel }}</label>
      <input v-model="form.title" type="text" class="form-control" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Description</label>
      <textarea v-model="form.description" class="form-control"></textarea>
    </div>
    <slot></slot>
    <button type="submit" class="btn btn-primary">Soumettre</button>
  </form>
</template>

<script>
export default {
  props: ['titleLabel'],
  data() {
    return {
      form: { title: '', description: '' },
    };
  },
  methods: {
    submit() {
      this.$emit('submit', this.form);
      this.form = { title: '', description: '' };
    },
  },
};
</script>