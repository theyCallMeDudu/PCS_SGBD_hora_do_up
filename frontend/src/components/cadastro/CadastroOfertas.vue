<template>
    <b-overlay spinner-variant="success" :show="processandoProdutos" rounded="sm" class="cad-sale text-center">
        <form @submit.prevent="cadastraOferta" class="form-signin">
            <h1 class="h3 mb-3 font-weight-normal">Cadastro de Ofertas</h1>

            <div class="form-group">
                <label for="lojaSelect">Loja</label>
                <select class="form-control" v-model="loja" id="lojaSelect" required>
                    <option v-for="l in lojas" :key='l.id' :value="l.id">
                        {{ l.nome }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label for="categoriaSelect">Categoria</label>
                <select class="form-control" v-model="categoria" @change="getProdutos()" id="categoriaSelect" required>
                    <option v-for="c in categorias" :key='c.id' :value="c.id">
                        {{ c.data().nome }}
                    </option>
                </select>
            </div>

            <div v-if="categoria != '' && !processandoProdutos">
                <div class="form-group">
                    <label for="produtoSelect">Produto</label>
                    <select class="form-control" v-model="produto" id="produtoSelect" required>
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
    </b-overlay>
</template>

<script>
    import firebase from '@/firebase';

    export default {
        created() {
            this.getCategorias()
            this.getLojas();
        },

        mounted() {
            // eslint-disable-next-line no-undef
            $("#Modal").on('hidden.bs.modal', this.limpa);
        },

        data() {
            return {
                categorias: [],
                categoria: '',
                produtos: [],
                produto: '',
                processandoProdutos: false,
                lojas: [],
                loja: '',
                url: '',
                status: ''
            }
        },

        methods: {
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

            cadastraOferta: function() {
                this.status = 'Processando...';

                // eslint-disable-next-line no-undef
                $('#Modal').modal();

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

                db.collection('ofertas').add(objSet)
                    .then(() => {
                        this.status = 'Oferta cadastrada com sucesso.';
                    }).catch((err) => {
                        this.status = err.message;
                    })
            },

            limpa: function() {
                this.categoria = '';
                this.produtos = [];
                this.produto = '';
                this.lojas = [];
                this.loja = '';
                this.url = '';
                this.status = '';
            },

            getCategorias: async function() {
                const db = firebase.firestore();

                await db.collection('categorias').get()
                    .then((snapCategorias) => {
                        for (let cat of snapCategorias.docs) {
                            this.categorias.push(cat)
                        }
                    })
            }
        }
    }
</script>