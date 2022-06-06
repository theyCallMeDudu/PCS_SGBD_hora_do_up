<template>
    <div class="edicao-perfil text-center">
        <form @submit.prevent="salvar" class="form-signup">
            <h1 class="h3 mb-3 font-weight-normal">Editar perfil</h1>

            <div class="form-group">
                <label for="inputNome">Nickname</label>
                <input class="form-control" placeholder="Nome" type="text" id='inputNome' v-model='nick' required>
            </div>

            <div class="form-group">
                <label for="inputEmail">Email</label>
                <input class="form-control" placeholder="Email" v-model="email" type="email" id='inputEmail' required>
            </div>

            <!-- <div class="form-group">
                <label for="inputNiver">Aniversário</label>
                <input class="form-control" placeholder="Aniversário" v-model="niver" type="date" id='inputNiver'>
            </div> -->
            
            <!-- <div class="form-group">
                <label for="inputAvatar">Avatar</label>
                <input class="form-control" placeholder="Avatar" v-model="avatar" type="image" id='inputAvatar'>
            </div> -->

            <div class="form-group">
                <button type="submit" class="btn btn-lg btn-success btn-block">Salvar</button>
                <button>Cancelar edição</button>
            </div>
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
                            <button type="button" class="btn btn-success" data-dismiss="modal" @click="limpa()">OK</button>
                        </div>
                    </b-overlay>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                nick: '',
                email: '',
                niver: '',
                status: ''
            }
        },

        created: function() {
            this.getUsuario();
        },

        mounted() {
            // eslint-disable-next-line no-undef
            $("#Modal").on('hidden.bs.modal', this.limpa);
        },

        methods: {
            getUsuario: function() {
                let idUsuario = '';
                const currentUser = this.$auth.currentUser;

                this.$db.collection('usuarios').where('uid', '==', currentUser.uid).get()
                    .then((usuariosSnap) => {
                        for (let usuario of usuariosSnap.docs) {
                            let data = usuario.data();

                            this.nick = data.nick;
                            this.email = data.email;
                            this.niver = data.niver;

                            idUsuario = usuario.id;
                        }
                    })
                    .catch((err) => {
                        console.log('Falha ao buscar usuário: ', err.message);
                    })
                return idUsuario;
            },

            salvar: function() {
                this.status = 'Processando...';

                // eslint-disable-next-line no-undef
                $('#Modal').modal();

                const currentUser = this.$auth.currentUser;
                let usuarioId = '';
                this.niver = '01/01/1900';
                
                this.$db.collection('usuarios').where('uid', '==', currentUser.uid).get()
                    .then((usuariosSnap) => {
                        for (let usuario of usuariosSnap.docs) {
                            usuarioId = usuario.id;
                            break;
                        }

                        if (this.nick && this.email && this.niver) {
                            this.$db.doc(`usuarios/${usuarioId}`).update({
                                'nick': this.nick,
                                'email': this.email,
                                'niver': this.niver
                            })
                            .then(() => {
                                this.status = 'Dados atualizados com sucesso.';
                            })
                            .catch((err) => {
                                this.status = 'Falha ao atualizar dados. ' + err.message;
                            })
                        }
                    })
                    .catch((err) => {
                        console.log('Falha ao buscar usuário: ', err.message);
                    })
            },

            limpa: function() {
                this.status = ''
            }
        }
    }

</script>