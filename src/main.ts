import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { initAuth } from './graphql/auth';
import './styles/base.scss';

// Initialise authentication before mounting the app. This will set
// the Authorization header on the GraphQL client if a token is
// present in localStorage.
initAuth();

const app = createApp(App);
app.use(router);
app.mount('#app');