const compA = {
  name: "compA",
  props: ["id"],
  template: `
  <div>
    <p>{{ id }}</p>
    <p>compA</p>
  </div>
  `,
};

const compB = {
  name: "compB",
  template: `
      <p>compB</p>
  `,
};

const App = {
  name: "app",
  template: `
  <div>
  <h1>Hello App!</h1>
  <p>
    <router-link to="/comp-a">Go to compA</router-link>
    <router-link to="/comp-b">Go to compB</router-link>
    <router-link to="/comp-a/1">Go to compA/1</router-link>
    <router-link to="/comp-a/2">Go to compA/2</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
  </div>
  `,
};

const routes = [
  {
    path: "/comp-a/:id",
    name: "comp-a",
    props: true,
    component: compA,
    // 配置中的路由守卫
    beforeEnter: (to, from, next) => {
      console.log(to.name, ": beforeEnter");
      next();
    },
  },
  {
    path: "/comp-a",
    name: "comp-a",
    component: compA,
    // 配置中的路由守卫
    beforeEnter: (to, from, next) => {
      console.log(to.name, ": beforeEnter");
      next();
    },
  },
  {
    path: "/comp-b",
    name: "comp-b",
    component: compB,
    beforeEnter: (to, from, next) => {
      console.log(to.name, ": beforeEnter");
      next();
    },
  },
];

const router = new VueRouter({
  routes,
});

// 注册组件路由
[compA, compB].forEach((comp) => {
  comp["beforeRouteEnter"] = function (to, from, next) {
    console.log(to.name, ": beforeRouteEnter");
    next((vm) => console.log(to.name, ": beforeRouteEnter next"));
  };

  ["beforeRouteUpdate", "beforeRouteLeave"].forEach((guard) => {
    comp[guard] = function (to, from, next) {
      if (guard === "beforeRouteLeave") {
        console.log(from.name, ":", guard);
      } else {
        console.log(to.name, ":", guard, ", ", this.$route.params.id);
      }
      next();
    };
  });
});

// 注册全局路由守卫
["beforeEach", "beforeResolve", "afterEach"].forEach((guard) => {
  router[guard]((to, from, next) => {
    console.log(to.name, ":", guard);
    if (next) next();
  });
});

let vm = new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
