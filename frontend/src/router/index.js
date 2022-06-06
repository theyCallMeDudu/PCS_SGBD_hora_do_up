import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from '@/firebase'

Vue.use(VueRouter);

const routes = [
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../components/Home.vue')
    },
    {
        path: '/criar-conta',
        name: 'criar-conta',
        component: () => import(/* webpackChunkName: "criar-conta" */ '../components/login/CriarConta.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../components/login/Login.vue')
    },
    {
        path: '/minha-conta',
        name: 'minha-conta',
        component: () => import(/* webpackChunkName: "minha-conta" */ '../components/usuario/MinhaConta.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/pesquisa',
        name: 'pesquisa',
        component: () => import(/* webpackChunkName: "pesquisa" */ '../components/produto/Pesquisa.vue')
    },
    {
        path: '/produto/:id',
        name: 'produto',
        component: () => import(/* webpackChunkName: "produto" */ '../components/produto/Produto.vue'),
    },
    {
        path: '/admin/marcas',
        name: 'marcas',
        component: () => import(/* webpackChunkName: "marcas" */ '../components/adm/Marcas.vue'),
        meta: {
          requiresAdminAuth: true
        }
    },
    {
        path: '/admin/lojas',
        name: 'lojas',
        component: () => import(/* webpackChunkName: "lojas" */ '../components/adm/Lojas.vue'),
        meta: {
          requiresAdminAuth: true
        }
    },
    {
        path: '/admin/produtos',
        name: 'produtos',
        component: ()  => import(/* webpackChunkName: "produto" */ '../components/adm/Produtos.vue'),
        meta: {
          requiresAdminAuth: true
        }
    },
    {
      path: '/recuperar-senha',
      name: 'recuperar-senha',
      component: ()  => import(/* webpackChunkName: "recuperar-senha" */ '../components/login/RecuperarSenha.vue'),
      
   },
    {
      path: '/admin/ofertas',
      name: 'ofertas',
      component: ()  => import(/* webpackChunkName: "ofertas" */ '../components/adm/Ofertas.vue'),
      meta: {
        requiresAdminAuth: true
    }
    
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    let isAdmin = false
  
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdminAuth = to.matched.some(record => record.meta.requiresAdminAuth);
  
    if (currentUser) {
      let db = firebase.firestore();
      db.collection('admins').where('uid', '==', currentUser.uid).get()
        .then((adminsSnap) => {
          isAdmin = adminsSnap.size == 1;
        
          if (requiresAuth && !currentUser) next('login')
          else if (currentUser && (to.name == 'login' || to.name == 'criar-conta')) next('home')
          else if (requiresAdminAuth && !isAdmin) next('login')
          else next();
        })
        .catch((err) => {
          alert('Falha ao autenticar usuário: ', err);
          next('login');
        })
    } else {
      if (requiresAuth && !currentUser) next('login')
      else if (currentUser && (to.name == 'login' || to.name == 'criar-conta')) next('home')
      else if (requiresAdminAuth && !isAdmin) next('login')
      else next();
    }
  })

export default router