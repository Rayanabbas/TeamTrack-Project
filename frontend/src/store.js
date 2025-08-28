import { createStore } from 'vuex';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api';

const store = createStore({
  state: {
    token: localStorage.getItem('token') || null,
    user: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      const res = await axios.post('/auth/login', credentials);
      commit('setToken', res.data.token);
    },
    async register({ commit }, userData) {
      const res = await axios.post('/auth/register', userData);
      commit('setToken', res.data.token);
    },
    logout({ commit }) {
      commit('clearToken');
    },
  },
});

export default store;