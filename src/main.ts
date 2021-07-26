import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import "./index.css";
import "primevue/resources/themes/saga-blue/theme.css"       //theme
import "primevue/resources/primevue.min.css"                //core css

const app = createApp(App);
app.use(PrimeVue);
app.mount("#app");
