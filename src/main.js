import { createApp } from 'vue'
import {Quasar, Notify} from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {
  Notify
  }, // import Quasar plugins and add here
})

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
