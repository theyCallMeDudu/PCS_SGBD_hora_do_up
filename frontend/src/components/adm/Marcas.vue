<template>
    <div>
        <b-skeleton-wrapper :loading="loading" style="overflow-x:auto;">
            <template #loading>
                <div class="text-center" style="margin-bottom: 20px;">
                    <h3 class="h3 mb-3 font-weight-normal">Marcas</h3>
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
                <h3 class="h3 mb-3 font-weight-normal">Marcas</h3>
                <button class="btn btn-success" @click="novaMarca()">Nova marca</button>
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
                        <tr v-for="m in marcas" :key='m.id' :value="m.id">
                            <th>{{m.data().nome}}</th>
                            <td class="text-center">
                                <button class="btn btn-secondary" v-b-tooltip.hover title="Editar" @click="editarMarca(m)" style="margin-right: 10px;"><b-icon icon="pencil"></b-icon></button> 
                                <button class="btn btn-danger" v-b-tooltip.hover title="Excluir" @click="deleteMarca(m.id)"><b-icon icon="trash"></b-icon></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </b-skeleton-wrapper>

        <!-- Modal nova marca -->
        <div class="modal fade" id="ModalCadMarca" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">Nova marca</h5>
                            <!-- <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5> -->

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="cadastraMarca">
                                <div class="form-group">
                                    <label for="inputMarca">Marca</label>
                                    <input class="form-control" placeholder="Nome" v-model="marcaInput.nome" type="text" id='inputMarca' required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-success" @click="cadastraMarca()">Salvar</button>
                        </div>
                    </b-overlay>
                </div>
            </div>
        </div>

        <!-- Modal exclusao marca -->
        <div class="modal fade" id="ModalDel" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">Excluir marca</h5>
                            <!-- <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5> -->

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        
                        <div class="modal-body text-center">
                            <p class="text-center">Deseja realmente excluir esta marca?</p>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" data-dismiss="modal" @click='cancelaDeleteMarca()'>Não</button>
                            <button type="submit" class="btn btn-danger" data-dismiss="modal" @click='confirmaDeleteMarca()'>Sim</button>
                        </div>
                    </b-overlay>
                </div>
            </div>
        </div>

        <!-- Modal edicao marca -->
        <div class="modal fade" id="ModalEdit" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">Editar marca</h5>
                            <!-- <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5> -->

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="modal-body">
                            <form @submit.prevent="confirmaEditarMarca">
                                <div class="form-group">
                                    <label for="inputMarca">Nome</label>
                                    <input v-if="marca" class="form-control" :placeholder="marca.nome" v-model="marca.nome" type="text" id='inputMarca' required>
                                </div>
                            </form>
                        </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal" @click='cancelaEditarMarca()'>Não</button>
                            <button type="submit" class="btn btn-success" data-dismiss="modal" @click='confirmaEditarMarca()'>Sim</button>
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
            this.getMarcas();
        },

        data() {
            return {
                marcas: [],
                status: '',
                itemSelecionadoId: '',
                marcaId: '',
                marca: {},
                marcaInput: {},
                loading: true
            }
        },

        mounted() {
                // eslint-disable-next-line no-undef
                $("#Modal").on('hidden.bs.modal', this.limpa);

                // eslint-disable-next-line no-undef
                $("#ModalDel").on('hidden.bs.modal', this.cancelaDeleteMarca);
        },

        methods: {
            getMarcas: function() {
                this.loading = true;
                this.marcas = [];
                let proms = [];
                
                const db = firebase.firestore();

                proms.push(db.collection('marcas').orderBy('nome').get()
                    .then((snapMarcas) => {
                        for (let marca of snapMarcas.docs) {
                            this.marcas.push(marca)
                        }
                    })
                )

                Promise.all(proms)
                    .then(() => {
                        this.loading = false;
                    })
            },

            cadastraMarca: async function() {
                this.status = 'Processando...';

                const db = firebase.firestore();

                const marcasSnap = await db.collection('marcas').where('nome', '==', this.marcaInput.nome).get()
                if (marcasSnap.docs.length == 0) {
                    db.collection('marcas').add({nome: this.marcaInput.nome})
                        .then(() => {
                            this.status = 'Marca cadastrada com sucesso.';
                            this.getMarcas();
                            // eslint-disable-next-line no-undef
                            $('#ModalCadMarca').modal('hide');
                        }).catch((err) => {
                            this.status = err.message;
                        })
                } else {
                    this.status = 'Marca já existe.';
                    // eslint-disable-next-line no-undef
                    $('#ModalCadMarca').modal('hide');
                }
            },

            novaMarca: function () {
                this.status = 'Cadastro de marca';
                
                // eslint-disable-next-line no-undef
                $('#ModalCadMarca').modal();
            },

            editarMarca: function (marca) {
                this.status = '';

                this.marca = marca.data();
                this.marcaId = marca.id;
                
                // eslint-disable-next-line no-undef
                $('#ModalEdit').modal();
            },

            deleteMarca: function(itemSelecionadoId) {
                this.status = 'Tem certeza que deseja excluir esta marca?';

                this.itemSelecionadoId = itemSelecionadoId;
                
                // eslint-disable-next-line no-undef
                $('#ModalDel').modal();
            },

            confirmaDeleteMarca: function() {
                this.status = 'Processando...';

                const id = this.itemSelecionadoId;
                const db = firebase.firestore();

                db.doc(`marcas/${id}`).delete().then(() => {
                    this.getMarcas();
                    // eslint-disable-next-line no-undef
                    $('#ModalDel .close').click();
                }).catch((error) => {
                    console.error("Erro ao excluir marca! ", error);
                });
            },

            cancelaDeleteMarca: function() {
                this.status = '';
            },

            confirmaEditarMarca: function() {
                this.status = 'Processando...';

                const id = this.marcaId;
                const marca = this.marca.nome;
                const db = firebase.firestore();

                db.doc(`marcas/${id}`).update({nome: marca}).then(() => {
                    this.getMarcas();
                    // eslint-disable-next-line no-undef
                    $('#ModalEdit').modal('hide');
                }).catch((error) => {
                    console.error("Erro ao editar marca! ", error);
                });
            }
        }
    }
</script>