import type { App } from 'vue'
import TransfromDom from './TransfromDom.vue';

export default {
  install(app: App) {
    app.component('transform-dom', TransfromDom);
  }
} 
