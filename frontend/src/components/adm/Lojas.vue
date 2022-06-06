<template>
    <div>
        <b-skeleton-wrapper :loading="loading" style="overflow-x:auto;">
            <template #loading>
                <div class="text-center" style="margin-bottom: 20px;">
                    <h3 class="h3 mb-3 font-weight-normal">Lojas</h3>
                    <b-skeleton class="btn btn-success" type="button" variant="success"></b-skeleton>
                </div>

                <table class="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th><b-skeleton variant="secondary"></b-skeleton></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="index in 12" :key='index'>
                            <th><b-skeleton variant="secondary"></b-skeleton></th>
                            <td class="text-center">
                                <b-skeleton type="button" class="btn btn-secondary" variant="secondary" style="margin-right: 10px;"></b-skeleton> 
                                <b-skeleton type="button" class="btn btn-danger" variant="danger"></b-skeleton>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>

            <div class="text-center" style="margin-bottom: 20px;">
                <h3 class="h3 mb-3 font-weight-normal">Lojas</h3>
                <button class="btn btn-success" @click="novaLoja()">Nova loja</button>
            </div>

            <div style="overflow-x: scroll">
                <table class="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th style="color: #343A40">_____Ações_____</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="l in lojas" :key='l.id' :value="l.id">
                            <th>{{l.data().nome}}</th>
                            <td class="text-center">
                                <button class="btn btn-secondary" v-b-tooltip.hover title="Editar" @click="editarLoja(l)" style="margin-right: 10px;"><b-icon icon="pencil"></b-icon></button> 
                                <button class="btn btn-danger" v-b-tooltip.hover title="Excluir" @click="deleteLoja(l.id)"><b-icon icon="trash"></b-icon></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </b-skeleton-wrapper>

        <!-- Modal nova loja -->
        <div class="modal fade" id="ModalCadLoja" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">Nova loja</h5>

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="cadastraLoja">
                                <div class="form-group">
                                    <label for="inputLoja">Loja</label>
                                    <input class="form-control" placeholder="Nome" v-model="lojaInput.nome" type="text" id='inputLoja' required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-success" @click="cadastraLoja()">Salvar</button>
                        </div>
                    </b-overlay>
                </div>
            </div>
        </div>

        <!-- Modal exclusao loja -->
        <div class="modal fade" id="ModalDel" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5>

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <p>Deseja realmente excluir esta loja?</p>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" data-dismiss="modal" @click='cancelaDeleteLoja()'>Não</button>
                            <button type="submit" class="btn btn-danger" data-dismiss="modal" @click='confirmaDeleteLoja()'>Sim</button>
                        </div>
                    </b-overlay>
                </div>
            </div>
        </div>

        <!-- Modal edicao loja -->
        <div class="modal fade" id="ModalEdit" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">Editar Loja</h5>

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <form @submit.prevent="confirmaEditarLoja">
                                <div class="form-group">
                                    <label for="inputLoja">Nome</label>
                                    <input v-if="loja" class="form-control" :placeholder="loja.nome" v-model="loja.nome" type="text" id='inputLoja' required>
                                </div>
                            </form>
                        </div>
                        
                        <div v-if="status != 'Processando...'" class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal" @click='cancelaEditarLoja()'>Cancelar</button>
                            <button type="submit" class="btn btn-success" data-dismiss="modal" @click='confirmaEditarLoja()'>Salvar</button>
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
        created() {
            this.getLojas();
        },

        data() {
            return {
                lojas: [],
                status: '',
                itemSelecionadoId: '',
                lojaId: '',
                loja: {},
                lojaInput: {},
                loading: true
            }
        },

        mounted() {
            // eslint-disable-next-line no-undef
            $("#Modal").on('hidden.bs.modal', this.limpa);

            // eslint-disable-next-line no-undef
            $("#ModalDel").on('hidden.bs.modal', this.cancelaDeleteLoja);
        },

        methods: {
            getLojas: function() {
                this.loading = true;
                this.lojas = [];
                let proms = [];

                const db = firebase.firestore();

                proms.push(db.collection('lojas').orderBy('nome').get()
                    .then((snapLojas) => {
                        for (let loja of snapLojas.docs) {
                            this.lojas.push(loja)
                        }
                    })
                )

                Promise.all(proms)
                    .then(() => {
                        this.loading = false;
                    })
            },
            cadastraLoja: async function() {
                this.status = 'Processando...';

                const db = firebase.firestore();

                const lojasSnap = await db.collection('lojas').where('nome', '==', this.lojaInput.nome).get()
                if (lojasSnap.docs.length == 0) {
                    db.collection('lojas').add({nome: this.lojaInput.nome})
                        .then(() => {
                            this.status = 'Loja cadastrada com sucesso.';
                            this.getLojas();
                            // eslint-disable-next-line no-undef
                            $('#ModalCadLoja').modal('hide');
                        }).catch((err) => {
                            this.status = err.message;
                        })
                } else {
                    this.status = 'Loja já existe.';
                    // eslint-disable-next-line no-undef
                    $('#ModalCadLoja').modal('hide');
                }
            },

            novaLoja: function() {
                this.status = '';
                    
                // eslint-disable-next-line no-undef
                $('#ModalCadLoja').modal();
            },

            editarLoja: function(loja) {
                this.status = '';

                this.loja = loja.data();
                this.lojaId = loja.id;
                
                // eslint-disable-next-line no-undef
                $('#ModalEdit').modal();
            },

            deleteLoja: function(itemSelecionadoId) {
                this.status = 'Tem certeza que deseja excluir esta loja?';

                this.itemSelecionadoId = itemSelecionadoId;
                
                // eslint-disable-next-line no-undef
                $('#ModalDel').modal();
            },

            confirmaDeleteLoja: function() {
                this.status = 'Processando...';

                const id = this.itemSelecionadoId;
                const db = firebase.firestore();

                db.doc(`lojas/${id}`).delete().then(() => {
                    this.getLojas();
                    // eslint-disable-next-line no-undef
                    $('#ModalDel .close').click();
                }).catch((error) => {
                    console.error("Erro ao excluir loja! ", error);
                });
            },

            cancelaDeleteLoja: function() {
                this.status = '';
            },

            confirmaEditarLoja: function() {
                this.status = 'Processando...';

                const id = this.lojaId;
                const loja = this.loja.nome;
                const db = firebase.firestore();

                db.doc(`lojas/${id}`).update({nome: loja}).then(() => {
                    this.getLojas();
                    // eslint-disable-next-line no-undef
                    $('#ModalEdit').modal('hide');
                }).catch((error) => {
                    console.error("Erro ao editar loja! ", error);
                });
            }
        }
    }
</script>