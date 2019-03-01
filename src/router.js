import Vue from "vue";
import Router from "vue-router";
import home from "./views/home.vue";

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/note",
      name: "note",
      component: () => import("./views/note.vue")
    },
    {
      path: "/help",
      name: "help",
      component: () => import("./views/help.vue")
    }
  ]
});
