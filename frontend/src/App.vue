<template>
  <div id="app">
    <b-navbar class="fixed-top" toggleable="lg" type="dark" variant="dark">
      <div class="container">
        <b-navbar-brand :to="{name: 'home'}" style="display: flex">
          <img src="./assets/hora_do_up_logo.png" height="30px">
        </b-navbar-brand>

        <b-navbar-toggle target="collapse"></b-navbar-toggle>

        <b-collapse id="collapse" is-nav>
          <b-nav-form @submit.prevent="pesquisar()">
            <b-form-input size="sm" class="mr-sm-2" placeholder="Pesquise um produto" v-model="textoPesquisa"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit" variant="outline-success" v-b-toggle.collapse>Pesquisar</b-button>
          </b-nav-form>

          <b-navbar-nav>
            <b-nav-item v-if="isAdmin" :to="{name: 'produtos'}">Produtos</b-nav-item>
            <b-nav-item v-if="isAdmin" :to="{name: 'lojas'}">Lojas</b-nav-item>
            <b-nav-item v-if="isAdmin" :to="{name: 'marcas'}">Marcas</b-nav-item>
            <b-nav-item v-if="isAdmin" :to="{name: 'ofertas'}">Ofertas</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="user" :to="{name: 'minha-conta'}">Minha Conta</b-nav-item>
            <b-nav-item v-if="user" id='sair' @click="sair()">Sair</b-nav-item>
            <b-nav-item v-if="!user" :to="{name: 'login'}">Login</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>

    <div class="container" style="margin-top: 68px;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import firebase from '@/firebase'

  export default {
    data() {
      return {
        user: null,
        textoPesquisa: '',
        isAdmin: false
      }
    },

    created: function () {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.user = user;
          const db = firebase.firestore();

          db.collection('admins').where('uid', '==', user.uid).get()
            .then((doc) => {
              this.isAdmin = doc.size == 1;
            })
            .catch((err) => {
              alert('Falha ao autenticar usuário: ', err);
            })
        } else {
          this.user = null;
        }
      });
    },

    methods: {
      sair: function() {
        firebase.auth().signOut().then(() => {
          this.user = null;
          this.isAdmin = false;
          this.$router.push({
            name: 'home',
          });
        })
      },

      pesquisar: function() {
        this.$router.replace({
          name: 'home',
          query: { texto: this.textoPesquisa }
        });
      }
    }
  }
</script>

<style>
  #app {
    height: 100%;
    /* overflow-y: scroll; */
  }

  .div-login, .div-cadastro {
    /* width: 100vw; */
    height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center
  }

  .form-signin, .form-signup, .form-recuperar-senha {
    max-width: 330px;
    /* padding: 15px;
    margin: auto; */
    width: 300px;
    height: 300px;
  }

  .cad-product, .cad-sale, .cad-brand, .edicao-perfil{
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  body {
    margin: 0px;
    overflow-y: scroll;
  }

  .sidebar {
    float: left;
    margin: 0;
    padding: 0;
    margin-right: 20px;
  }

  .avatar {
    width: 180px;
    height: 180px;
    display: flex;
    flex-direction: row;
    justify-content: center !important;
    background-color: cadetblue;
    float: left;
  }

  .user-data{
    padding: 10px;
  }

  @media screen and (max-width: 600px) {
    body {
      flex-direction: column;
    }
    
    .sidebar {
        float: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        clear: both;
        margin: 0 0 5% 0;
    }

    .avatar {
      width: 100%;
    }

  }

  #sair > a {
    color: red;
  }

  .preco {
    color: #28a745;
  }

  .avaliacao {
    color: #000
  }

  .table-media {
    display: flex;
    flex-direction: column;
    width: 50%;
    float: left;
  }

  .div-avaliacao {
    width: 50%;
    float: left;
  }

  .div-input-alerta {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .modal-edit-alerta {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  #notificacao-produto:hover {
    text-shadow: 1px 1px 1px #000;
  }
</style>