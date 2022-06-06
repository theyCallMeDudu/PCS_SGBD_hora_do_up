<template>
    <div class="div-cadastro text-center">
        <form @submit.prevent="recuperarSenha" class="form-recuperar-senha">
            <h1 class="h3 mb-3 font-weight-normal">Recuperar Senha</h1>

            <div class='form-group'>
                <label>Digite seu email</label>
                <input id="inputEmail" class='form-control' type="email" placeholder="Email" v-model='email' required>
                <b-form-invalid-feedback :state="emailNaoCadastrado == false">
                    E-mail não cadastrado.
                </b-form-invalid-feedback> 
            </div>
            <div class="form-group">
                <b-button block type="submit" variant="success">Enviar</b-button>
            </div>
            <router-link :to="{name:'login'}">Voltar ao login</router-link>
        </form>

        <div class="modal fade" id="ModalEnvioSenha" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" rounded="sm">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body text-center">
                            <div class="modal-body" style="padding: 0 24%;">
                                <p>
                                    Um email foi enviado para <strong>{{email}}</strong>
                                </p>
                            </div>
                        </div>
                        <div class="modal-body text-center">
                            <button class="btn btn-primary" type="submit" data-dismiss="modal" @click="goLogin()">Fazer login</button>
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
        return{
            email:'',
            status: '',
            emailNaoCadastrado: false
        }
    },  

    mounted() {
        // eslint-disable-next-line no-undef
        $("#ModalEnvioSenha").on("hidden.bs.modal", this.limpaFeedback);
    },
    
    methods: {
       
    
       recuperarSenha: async function(){
            firebase.auth().languageCode = 'pt';
            var auth = firebase.auth();
            var emailAddress = this.email;
            const setEmailNaoCadastrado = (aux) => this.emailNaoCadastrado = aux;

            await auth.sendPasswordResetEmail(emailAddress).then(function() {
                // eslint-disable-next-line no-undef
                $('#ModalEnvioSenha').modal();
            }).catch(function(error) {
                console.log(error.message);
                setEmailNaoCadastrado(true);
            });
       },
         
        goLogin: async function() {
            // eslint-disable-next-line no-undef
            $('#ModalAlert').modal('hide');

            await this.$router.push({
            name: 'login'
            });
        },
        
        limpaFeedback: function(){
            this.emailNaoCadastrado = false;
        }
    },
}
</script>

