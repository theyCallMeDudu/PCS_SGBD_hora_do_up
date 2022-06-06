<template>
    <div>
        <b-skeleton-wrapper :loading="loading" style="overflow-x:auto;">
            <template #loading>
                <div class="text-center" style="margin-bottom: 20px;">
                    <h3 class="h3 mb-3 font-weight-normal">Ofertas</h3>
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
                <h3 class="h3 mb-3 font-weight-normal">Ofertas</h3>
                <button class="btn btn-success" @click="novaOferta()">Nova oferta</button>
            </div>

            <div style="overflow-x: scroll">
                <table class="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th>Loja</th>
                            <th>Produto</th>
                            <th>Url</th>
                            <th style="color: #343A40">_____Ações_____</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="o in ofertas" :key='o.id' :value="o.id">
                            <td>{{o.loja}}</td>
                            <td>{{o.produto}}</td>
                            <td>{{o.url}}</td>
                            <td class="text-center">
                                <button class="btn btn-secondary" v-b-tooltip.hover title="Editar" @click="editarOferta(o)" style="margin-right: 10px;"><b-icon icon="pencil"></b-icon></button> 
                                <button class="btn btn-danger" v-b-tooltip.hover title="Excluir" @click="deleteOferta(o.id)"><b-icon icon="trash"></b-icon></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </b-skeleton-wrapper>

        <!-- Modal nova oferta -->
        <div class="modal fade" id="ModalCadOferta" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">Nova oferta</h5>
                            <!-- <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5> -->

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="cadastraOferta">
                                <div class="form-group">
                                    <label for="lojaSelect">Loja</label>
                                    <select v-if="lojas.length > 0" class="form-control" v-model="loja" id="lojaSelect" required>
                                        <option v-for="l in lojas" :key='l.id' :value="l.id">
                                            {{ l.nome }}
                                        </option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="categoriaSelect">Categoria</label>
                                    <select v-if="categorias.length > 0" class="form-control" v-model="categoria" @change="getProdutos()" id="categoriaSelect" required>
                                        <option v-for="c in categorias" :key='c.id' :value="c.id">
                                            {{ c.data().nome }}
                                        </option>
                                    </select>
                                </div>

                                <div v-if="categoria != '' && !processandoProdutos">
                                    <div class="form-group">
                                        <label for="produtoSelect">Produto</label>
                                        <select v-if="produtos.length > 0" class="form-control" v-model="produto" id="produtoSelect" required>
                                            <option v-for="p in produtos" :key='p.id' :value="p.id">
                                                {{ p.data.nome }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="url">Link</label>
                                    <input class="form-control" placeholder="url" v-model="url" type="text" id='url' required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-success" @click="cadastraOferta()">Salvar</button>
                        </div>
                    </b-overlay>
                </div>
            </div>
        </div>

        <!-- Modal exclusao oferta -->
        <div class="modal fade" id="ModalDel" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">Excluir oferta</h5>
                            <!-- <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5> -->

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        
                        <div class="modal-body text-center">
                            <p class="text-center">Deseja realmente excluir esta oferta?</p>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" data-dismiss="modal" @click='cancelaDeleteOferta()'>Não</button>
                            <button type="submit" class="btn btn-danger" data-dismiss="modal" @click='confirmaDeleteOferta()'>Sim</button>
                        </div>
                    </b-overlay>
                </div>
            </div>
        </div>

        <!-- Modal edicao oferta -->
        <div class="modal fade" id="ModalEdit" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">Editar oferta</h5>
                            <!-- <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5> -->

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="modal-body">
                                <form @submit.prevent="confirmaEditarOferta">
                                    <!-- <div class="form-group">
                                        <label for="inputOferta">Nome</label>
                                        <input class="form-control" :placeholder="oferta.nome" v-model="oferta.nome" type="text" id='inputOferta' required>
                                    </div> -->

                                    <div class="form-group">
                                        <label for="lojaSelect">Loja</label>
                                        <select v-if="lojas.length > 0" class="form-control" v-model="oferta.lojaId" id="lojaSelect" required>
                                            <option v-for="l in lojas" :key='l.id' :value="l.id">
                                                {{ l.nome }}
                                            </option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="produtoSelect">Produto</label>
                                        <select v-if="todosProdutos.length > 0" class="form-control" v-model="oferta.produtoId" id="produtoSelect" required>
                                            <option v-for="p in todosProdutos" :key='p.id' :value="p.id">
                                                {{ p.data.nome }}
                                            </option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="url">Link</label>
                                        <input class="form-control" placeholder="url" v-model="oferta.url" type="text" id='url' required>
                                    </div>
                                </form>
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal" @click='cancelaEditarOferta()'>Não</button>
                            <button type="submit" class="btn btn-success" data-dismiss="modal" @click='confirmaEditarOferta()'>Sim</button>
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
            this.getTodosProdutos();
            this.getCategorias();
            this.getLojas();
            this.getOfertas();
        },

        data() {
            return {
                ofertas: [],
                lojas: [],
                categorias: [],
                produtos: [],
                todosProdutos: [],
                status: '',
                itemSelecionadoId: '',
                ofertaId: '',
                oferta: {},
                ofertaInput: {},
                loading: true,
                loja: '',
                categoria: '',
                processandoProdutos: false,
                url: '',
                lojaEdit: ''
            }
        },

        mounted() {
                // eslint-disable-next-line no-undef
                $("#ModalCadOferta").on('hidden.bs.modal', this.limpa);

                // eslint-disable-next-line no-undef
                $("#ModalDel").on('hidden.bs.modal', this.cancelaDeleteOferta);
        },

        methods: {
            getOfertas: function() {
                this.loading = true;
                this.ofertas = [];
                let proms = [];
                const getLoja = (idLoja) => this.getLoja(idLoja);
                const getProduto = (idProduto) => this.getProduto(idProduto);
                const pushOferta = (data) => this.ofertas.push(data);
                
                const db = firebase.firestore();

                proms.push(db.collection('ofertas').get()
                    .then(async function(snapOfertas) {
                        for (let oferta of snapOfertas.docs) {
                            let data = {...oferta.data()};

                            let loja = await getLoja(data.loja);
                            data.loja = loja.lojaNome;
                            data.lojaId = loja.lojaId;
                            let produto = await getProduto(data.produto)
                            data.produto = produto.produtoNome;
                            data.produtoId = produto.produtoId;
                            data.url = oferta.data().url;
                            data.id = oferta.id;

                            pushOferta(data);
                        }
                    })
                )

                Promise.all(proms)
                    .then(() => {
                        this.ofertas.sort((a, b) => (a.produto > b.produto) ? 1 : -1)
                        this.loading = false;
                    })
            },

            cadastraOferta: async function() {
                this.status = 'Processando...';

                const db = firebase.firestore();
                let objSet = {};

                objSet['loja'] = this.loja;

                for (let cat of this.categorias) {
                    if (this.categoria == cat.key) {
                        objSet['categoria'] = cat.nome;
                    }
                }

                objSet['produto'] = this.produto;
                objSet['url'] = this.url;

                await db.collection('ofertas').add(objSet)
                    .then(() => {
                        this.status = 'Oferta cadastrada com sucesso.';
                        this.getOfertas();
                        // eslint-disable-next-line no-undef
                        $('#ModalCadOferta').modal('hide');
                    }).catch((err) => {
                        this.status = err.message;
                        // eslint-disable-next-line no-undef
                        $('#ModalCadOferta').modal('hide');
                    })
            },

            novaOferta: function () {
                this.status = 'Cadastro de oferta';
                
                // eslint-disable-next-line no-undef
                $('#ModalCadOferta').modal();
            },

            editarOferta: function (oferta) {
                this.status = '';
                this.oferta = oferta;
                this.ofertaId = oferta.id;
                
                // eslint-disable-next-line no-undef
                $('#ModalEdit').modal();
            },

            deleteOferta: function(itemSelecionadoId) {
                this.status = 'Tem certeza que deseja excluir esta oferta?';

                this.itemSelecionadoId = itemSelecionadoId;
                
                // eslint-disable-next-line no-undef
                $('#ModalDel').modal();
            },

            confirmaDeleteOferta: function() {
                this.status = 'Processando...';

                const id = this.itemSelecionadoId;
                const db = firebase.firestore();

                db.doc(`ofertas/${id}`).delete().then(() => {
                    this.getOfertas();
                    // eslint-disable-next-line no-undef
                    $('#ModalDel .close').click();
                }).catch((error) => {
                    console.error("Erro ao excluir oferta! ", error);
                });
            },

            cancelaDeleteOferta: function() {
                this.status = '';
            },

            confirmaEditarOferta: function() {
                this.status = 'Processando...';

                const id = this.ofertaId;
                const loja = this.oferta.lojaId;
                const produto = this.oferta.produtoId;
                const url = this.oferta.url;
                const db = firebase.firestore();

                db.doc(`ofertas/${id}`).update({loja: loja, produto: produto, url: url}).then(() => {
                    this.getOfertas();
                    // eslint-disable-next-line no-undef
                    $('#ModalEdit').modal('hide');
                }).catch((error) => {
                    console.error("Erro ao editar oferta! ", error);
                });
            },

            getProdutos: function() {
                this.processandoProdutos = true;
                const db = firebase.firestore();
                let categoriaAtual = '';

                for (let cat of this.categorias) {
                    if (this.categoria == cat.id) {
                        categoriaAtual = cat.id;
                    }
                }

                db.collection('produtos').where('Categoria', '==', categoriaAtual).orderBy("nome").get()
                    .then((produtosSnap) => {
                        this.produtos = [];

                        for (let p of produtosSnap.docs) {
                            this.produtos.push({id: p.id, data: p.data()})
                        }
                        
                        this.processandoProdutos = false;
                    })
                    .catch((err) => {
                        alert('Falha ao buscar produtos: ', err);
                        console.log('Falha ao buscar produtos: ', err);
                        this.processandoProdutos = false;
                    })
            },

            getLojas: function() {
                const db = firebase.firestore();

                db.collection('lojas').orderBy("nome").get()
                    .then((lojasSnap) => {
                        this.lojas = []
                        for (let l of lojasSnap.docs) {
                            this.lojas.push({id: l.id, nome: l.data().nome})
                        }
                    })
                    .catch((err) => {
                        alert('Falha ao buscar lojas: ', err)
                    })
            },

            getCategorias: async function() {
                const db = firebase.firestore();

                await db.collection('categorias').get()
                    .then((snapCategorias) => {
                        for (let cat of snapCategorias.docs) {
                            this.categorias.push(cat)
                        }
                    })
            },

            getLoja: async function(id) {
                const db = firebase.firestore();
                let lojaNome = '';
                let lojaId = '';

                await db.doc(`lojas/${id}`).get()
                    .then((doc) => {
                        lojaNome = doc.data().nome
                        lojaId = doc.id;
                    })

                return {lojaNome: lojaNome, lojaId: lojaId}
            },

            getProduto: async function(id) {
                const db = firebase.firestore();
                let produtoNome = '';
                let produtoId = '';

                await db.doc(`produtos/${id}`).get()
                    .then((doc) => {
                        produtoNome = doc.data().nome;
                        produtoId = doc.id;
                    })

                return {produtoNome: produtoNome, produtoId: produtoId}
            },

            limpa: function() {
                this.categoria = '';
                this.produto = '';
                this.loja = '';
                this.url = '';
                this.status = '';
            },

            getTodosProdutos: async function() {
                let produtos = [];
                const db = firebase.firestore();

                await db.collection('produtos').get()
                    .then((produtosSnap) => {
                        for (let p of produtosSnap.docs) {
                            produtos.push({id: p.id, data: p.data()})
                        }
                    }, (err) => {
                        console.log('Falha ao buscar produtos: ', err.message)
                    })
                    .catch((err) => {
                        console.log('Falha ao buscar produtos: ', err.message)
                    })

                this.todosProdutos = produtos;
            },
        }
    }
</script>