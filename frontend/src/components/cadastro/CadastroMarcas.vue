<template>
    <div class="cad-brand text-center">
        <form @submit.prevent="cadastraMarca" class="form-signin">
            <h1 class="h3 mb-3 font-weight-normal">Cadastro de Marcas</h1>
            <div class="form-group">
                <label for="inputMarca">Marca</label>
                <input class="form-control" placeholder="Marca" v-model="marca" type="text" id='inputMarca' required>
            </div>

            <div class="form-group">
                <button type="submit" class="btn btn-lg btn-success btn-block">Cadastrar</button>
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
                            <button type="button" class="btn btn-success" data-dismiss="modal" @click="limpa">OK</button>
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
                marca: '',
                status: ''
            }
        },

        mounted() {
            // eslint-disable-next-line no-undef
            $("#Modal").on('hidden.bs.modal', this.limpa);
        },
        
        methods: {
            cadastraMarca: async function() {
                this.status = 'Processando...';

                // eslint-disable-next-line no-undef
                $('#Modal').modal();

                const db = firebase.firestore();

                const marcasSnap = await db.collection('marcas').where('nome', '==', this.marca).get()
                if (marcasSnap.docs.length == 0) {
                    db.collection('marcas').add({nome: this.marca})
                        .then(() => {
                            this.status = 'Marca cadastrada com sucesso.';
                        }).catch((err) => {
                            this.status = err.message;
                        })
                } else {
                    this.status = 'Marca já existe.';
                }
            },

            limpa: function() {
                this.status = '';
                this.marca = '';
            },
        }
    }
</script>