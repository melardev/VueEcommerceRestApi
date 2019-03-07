import Vue from 'vue'
import App from './App.vue'
import router from './router';
Vue.config.productionTip = false;
import {UsersService} from "@/services/local/users.service";
import Toasted from 'vue-toasted';
import VueCarousel from 'vue-carousel';

Vue.use(Toasted);
Vue.use(VueCarousel);
UsersService.init();
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
