<template>
    <div class="div-login text-center">
        
        <form @submit.prevent="login" class="form-signin">
            <h1 class="h3 mb-3 font-weight-normal">Login</h1>

            <div class='form-group'>
                <label for="inputEmail" class="sr-only">Email</label>
                <input class='form-control' v-model="email" type="email" placeholder="Email" id="inputEmail" autocomplete="username" required>
            </div>

            <div class='form-group'>
                <label for="inputSenha" class="sr-only">Senha</label>
                <input class='form-control' @keyup.enter="login" v-model="senha" type="password" placeholder="Senha" id="inputSenha" autocomplete="current-password" required>
            </div>
             <div class='form-group'>
                <router-link :to="{name:'recuperar-senha'}" class="link">Esqueceu sua senha?</router-link>
            </div>
            
            <div class='form-group'>
                <button type="submit" class="btn btn-lg btn-success btn-block">Entrar</button>

                <router-link :to="{name:'criar-conta'}" class="link">Criar conta</router-link>
                
            </div>

            <button class="btn btn-lg btn-google btn-block btn-outline" @click="loginGoogle()">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48">
                    <g>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path>
                    </g>
                </svg>
                Entrar com Google
            </button>
        </form>
        
        <div class="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5>

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        
                        <div v-if="status != 'Processando...'" class="modal-footer">
                            <button type="button" class="btn btn-success" data-dismiss="modal" @click="entrar()">OK</button>
                        </div>
                    </b-overlay>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from '@/firebase';
    let provider = new firebase.auth.GoogleAuthProvider();

    export default {
        data() {
            return {
                email: '',
                senha: '',
                status: ''
            }
        },

        mounted() {
            // eslint-disable-next-line no-undef
            $("#Modal").on('hidden.bs.modal', this.entrar);
        },

        methods: {
            login: function() {
                this.status = 'Processando...';

                // eslint-disable-next-line no-undef
                $('#Modal').modal();

                if (this.email != '' && this.senha != '') {
                    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
                    .then(() => {
                        return firebase.auth().signInWithEmailAndPassword(this.email, this.senha)
                            .then(() => {
                                this.status = 'Login realizado com sucesso';
                                // eslint-disable-next-line no-undef
                                $('#Modal').modal('hide');
                                this.entrar();
                            },(err) => {this.status = err.message})
                            .catch((err) => {
                                this.status = err.message;
                            });
                    })
                    .catch((error) => {
                        this.status = error.message;
                    });
                } else {
                    if (this.email == '') {
                        this.status = 'Email não foi preenchido';
                    } else {
                        this.status = 'Senha não foi preenchida';
                    }
                }
            },

            entrar: function() {
                if (this.status == 'Login realizado com sucesso') {
                    this.status = ''
                    this.$router.push({
                        name: 'minha-conta',
                    });
                }
            },

            loginGoogle: function() {
                this.status = 'Processando...';

                // eslint-disable-next-line no-undef
                $('#Modal').modal();

                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
                    .then(() => {
                        return firebase.auth()
                            .signInWithPopup(provider)
                            .then(() => {
                                this.status = 'Login realizado com sucesso';
                                // eslint-disable-next-line no-undef
                                $('#Modal').modal('hide');
                                this.entrar();
                            }).catch((error) => {
                                this.status = error.message;
                            });
                    })
                    .catch((err) => {
                        this.status = err.message;
                    });
            }
        }
    }
</script>

<style>
    .btn-google {
        color: #545454;
        background-color: #ffffff;
        box-shadow: 0 1px 3px 0 #dddddd
    }
    .btn-google:hover {
        color: #000000;
        background-color: #dddddd;
        box-shadow: 0 1px 3px 0 #bbbbbb
    }
</style>