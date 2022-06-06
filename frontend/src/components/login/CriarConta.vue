<template>
    <div class="div-cadastro text-center">
        <form @submit.prevent="criarConta" class="form-signup">
            <h1 class="h3 mb-3 font-weight-normal">Criar conta</h1>

            <div class='form-group'>
                <label for="inputNick" class="sr-only">Nickname</label>
                <input id="inputNick" class='form-control' type="text" placeholder="Nickname" v-model='nick' required>
            </div>

            <div class='form-group'>
                <label for="inputEmail" class="sr-only">Email</label>
                <input id="inputEmail" class='form-control' type="email" placeholder="Email" v-model='email' autocomplete="username" required>
            </div>

            <div class='form-group'>
                <label for="inputSenha" class="sr-only">Senha</label>
                <input id="inputSenha" class='form-control' @keyup.enter="criarConta" type="password" placeholder="Senha" v-model="senha" autocomplete="new-password" required>
                <small id="passwordHelpBlock" class="form-text text-muted">
                    Mínimo de 6 caracteres.
                </small>
            </div>

            <div class='form-group'>
                <label for="inputConfirmaSenha" class="sr-only">Repita a Senha</label>
                <input id="inputConfirmaSenha" class='form-control' @keyup.enter="criarConta" type="password" placeholder="Repita a Senha" v-model="senhaCheck" autocomplete="new-password" required>
                <small id="passwordHelpBlock" class="form-text text-muted">
                    Mínimo de 6 caracteres.
                </small>
            </div>

            <div class="form-group">
                <button type="submit" class="btn btn-lg btn-success btn-block">Registrar</button>

                <router-link :to="{name:'login'}">Voltar ao login</router-link>
            </div>
        </form>

        <div class="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5>

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" @click="status = ''">&times;</span>
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

    export default {
        data() {
            return {
                email: '',
                senha: '',
                nick: '',
                senhaCheck: '',
                status: ''
            }
        },

        mounted() {
            // eslint-disable-next-line no-undef
            $("#Modal").on('hidden.bs.modal', this.entrar);
        },

        methods: {
            criarConta: function() {
                this.status = 'Processando...';

                // eslint-disable-next-line no-undef
                $('#Modal').modal();
                const getNick = () => this.nick;
                const setStatus = (status) => this.status = status;
                const entrar = () => this.entrar();

                if (this.email != '' && this.senha != '' && this.senhaCheck != '' && this.senha == this.senhaCheck) {
                    firebase.auth().createUserWithEmailAndPassword(this.email, this.senha)
                        .then(() => {
                            let defaultImage = '';
                            const storage = firebase.storage();
                            const storageRef = storage.ref('default.jpg');

                            storageRef.getDownloadURL()
                                .then((url) => {
                                    defaultImage = url;
                                    firebase.auth().currentUser.updateProfile({displayName: getNick(), photoURL: defaultImage})
                                        .then(() => {
                                            // Update successful.
                                            setStatus('Conta criada com sucesso');
                                            // eslint-disable-next-line no-undef
                                            $('#Modal').modal('hide');
                                            entrar();
                                        })
                                        .catch((error) => {
                                            // An error happened.
                                            console.log('Falha ao atualizar: ' + error.message);
                                            setStatus('Falha ao atualizar: ' + error.message);
                                        });
                                })
                        }, (err) => setStatus(err.message.toString()))
                        .catch((err) => {
                            console.log('Algo deu errado: ', err.message);
                            setStatus('Algo deu errado: ', err.message);
                        })
                } else {
                    if (this.senha == this.senhaCheck) {
                        this.status = 'Algo não foi preenchido';
                    } else {
                        this.status = 'Senhas não conferem';
                    }
                }
            },

            entrar: function() {
                if (this.status == 'Conta criada com sucesso') {
                    this.status = ''
                    this.$router.push({
                        name: 'minha-conta',
                    });
                }
            },

            getDefaultImage: async function() {
                const storage = firebase.storage();
                const storageRef = storage.ref('default.jpg');
                let imageURL = '';

                await storageRef.getDownloadURL()
                    .then((url) => {
                        imageURL = url;
                    })

                return imageURL;
            }
        }
    }
</script>