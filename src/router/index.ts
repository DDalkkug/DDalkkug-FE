import {createRouter, createWebHistory} from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Home from "../pages/Home.vue";
<<<<<<< HEAD
import PostList from "../pages/PostList.vue";
// import PostDetail from "../pages/PostDetail.vue";
// import PostCreate from "../pages/PostCreate.vue";
=======
// import PostList from "../pages/PostList.vue";
// import PostDetail from "../pages/PostDetail.vue";
import PostCreate from "../pages/PostCreate.vue";
>>>>>>> feat/#8


const routes : RouteRecordRaw[] = [
    { path: "/" ,name:"Home", component: Home},
<<<<<<< HEAD
    { path: "/posts", name: "Posts", component: PostList},
    // { path: "/posts/:id", name:"PostDetail", component: PostDetail},
    // { path: "/posts/new", name: "PostCreate", component:PostCreate},
    // { path: "/posts/:id/edit", name: "PostEdit", component:PostCreate},
=======
    // { path: "/posts", name: "Posts", component: PostList},
    // { path: "/posts/:id", name:"PostDetail", component: PostDetail},
    { path: "/posts/new", name: "PostCreate", component:PostCreate},
    { path: "/posts/:id/edit", name: "PostEdit", component:PostCreate},
>>>>>>> feat/#8

]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router