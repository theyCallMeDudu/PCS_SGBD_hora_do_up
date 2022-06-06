<template>
    <div>
        <b-skeleton-wrapper :loading="loading" style="overflow-x:auto;">
            <template #loading>
                <div class="text-center" style="margin-bottom: 20px;">
                    <h3 class="h3 mb-3 font-weight-normal">Produtos</h3>
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
                <h1 class = "h3 mb-3 font-weight-normal">Produtos</h1>
                <button class="btn btn-success" @click="novoProduto()">Novo Produto</button>
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
                        <tr v-for="p in produtos" :key='p.id' :value="p.id">
                        <th>{{p.nome}}</th>
                            <td class="text-center">
                                <button class="btn btn-secondary" v-b-tooltip.hover title="Editar" @click="editarProduto(p)" style="margin-right: 10px;"><b-icon icon="pencil"></b-icon></button>
                                <button class="btn btn-danger" v-b-tooltip.hover title="Excluir" @click="deleteProduto(p.id)"><b-icon icon="trash"></b-icon></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </b-skeleton-wrapper>
    
        <!-- Modal novo produto -->
        <div class="modal fade" id="ModalCadProduto" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">Novo Produto</h5>
                            <!-- <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5> -->

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="cadastraProduto">
                                <div class="form-group">
                                    <label for="categoriaSelect">Categoria</label>
                                    <select class="form-control" v-model="categoria" id="categoriaSelect">
                                        <option v-for="c in categorias" :key='c.id' :value="c">
                                            {{ c.data().nome }}
                                        </option>
                                    </select>
                    
                                    <div v-if="categoria != ''">
                                        <div v-for='(dado, nome) in categoria.data()' :key='nome'>
                                            <div v-if="dado == 'String'" class="form-group">
                                                <label :for="nome">{{nome}}</label>
                                                <input class="form-control" :placeholder="nome" type="text" :id='nome'>
                                            </div>

                                            <div v-if="dado == 'Number'" class="form-group">
                                                <label :for="nome">{{`${nome} (${categoria.data()[`${nome}Unidade`]})`}}</label>
                                                <input v-if="categoria.data()[`${nome}Unidade`] != 'CL'" class="form-control" :placeholder="`1${categoria.data()[`${nome}Unidade`]}`" type="text" :id='nome'>
                                                <input v-if="categoria.data()[`${nome}Unidade`] == 'CL'" class="form-control" :placeholder="`${categoria.data()[`${nome}Unidade`]}1`" type="text" :id='nome'>
                                            </div>

                                            <div v-if="dado == 'Boolean'" class="form-check">
                                                <input class="form-check-input" type="checkbox" :id='nome'>
                                                <label class="form-check-label" :for="nome">{{nome}}</label>
                                            </div>

                                            <div v-if="dado == 'marca'" class="form-group">
                                                <label :for="nome">{{nome}}</label>
                                                <select class="form-control" :id='nome'>
                                                    <option v-for="marca in marcas" :key='marca.id' :value="marca.id">
                                                        {{ marca.data().nome }}
                                                    </option>
                                                </select>
                                            </div>

                                            <div v-if="Array.isArray(dado)">
                                                <label :for="nome">{{nome}}</label>
                                                <div :id="nome" class="form-check">
                                                    <div v-for="option in dado" :key="option" :value="option">
                                                        <input class="form-check-input" type="radio" :name="nome" :id="option" :value="option" v-model="opcoes[option]">
                                                        <label class="form-check-label" :for="option">{{option}}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="nome">Nome</label>
                                            <input class="form-control" placeholder="Nome" type="text" v-model="nome" id='nome'>
                                        </div>

                                        <div class="form-group">
                                            <label for="inputAvatar">Imagem</label>
                                            <b-form-file
                                                id="inputAvatar"
                                                v-model="imagem"
                                                :state="Boolean(imagem)"
                                                placeholder="Faça o upload de uma imagem..."
                                                accept=".jpg, .png, .gif"
                                                browse-text="Upload"
                                                no-drop
                                            ></b-form-file>
                                        </div>
                                    </div>
                                <!-- <div class="form-group">
                                    <label for="imagem">Imagem</label>
                                    <input class="form-control" placeholder="url" type="text" v-model="imagem" id='imagem'>
                                </div> -->
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-success" @click="cadastraProduto()">Salvar</button>
                        </div>
                    </b-overlay>
                </div>
            </div>
        </div>

        <!-- Modal exclusao produto -->
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
                            <p>Deseja realmente excluir esse Produto?</p>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" data-dismiss="modal" @click='cancelaDeleteProduto()'>Não</button>
                            <button type="submit" class="btn btn-danger" data-dismiss="modal" @click='confirmaDeleteProduto()'>Sim</button>
                        </div>
                    </b-overlay>
                </div>
            </div>
        </div>

        <!-- Modal edicao produto -->
        <div class="modal fade" id="ModalEdit" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">Editar Produto</h5>

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <form @submit.prevent="confirmaEditarProduto">
                                <div class="form-group">
                                    <label for="categoriaSelect">Categoria</label>
                                
                                    <!-- Aqui ele pega as categorias e coloca no select--> 
                                    <!-- objetivo: pegar o produto selecionado apenas-->
                                    <select class="form-control" v-model="produto.CategoriaId" id="categoriaSelect" disabled>
                                        <option v-for="c in categorias" :key='c.id' :value="c.id">
                                            {{ c.data().nome }}
                                        </option>
                                    </select>
                                </div>
                                
                                <!-- codigo para de rodar se tirar esse v-if-->
                                <div v-if="produto.CategoriaId">
                                    <!-- aqui o codigo pega categoria -->
                                    <div v-for='(dado, nome) in produto.CategoriaData' :key='nome'>
                                        <div v-if="dado == 'String'" class="form-group">
                                            <label :for="nome">{{nome}}</label>
                                            <input class="form-control" :placeholder="nome" type="text" :id='produto[nome]' v-model="produto[nome]">
                                        </div>

                                        <!-- aqui o codigo bota input de dados numericos-->
                                        <div v-if="dado == 'Number'" class="form-group">
                                            <label :for="nome">{{`${nome} (${produto.CategoriaData[`${nome}Unidade`]})`}}</label>
                                            <input v-if="produto.CategoriaData[`${nome}Unidade`] != 'CL'" class="form-control" :placeholder="`1${produto.CategoriaData[`${nome}Unidade`]}`" type="text" :id='produto[nome]' v-model="produto[nome]">
                                            <input v-if="produto.CategoriaData[`${nome}Unidade`] == 'CL'" class="form-control" :placeholder="`${produto.CategoriaData[`${nome}Unidade`]}1`" type="text" :id='produto[nome]' v-model="produto[nome]">
                                        </div>

                                        <!-- aqui o codigo bota input de dados booleanos-->
                                        <div v-if="dado == 'Boolean'" class="form-check">
                                            <input class="form-check-input" type="checkbox" :id='produto[nome]' v-model="produto[nome]">
                                            <label class="form-check-label" :for="nome">{{nome}}</label>
                                        </div>

                                        <div v-if="dado == 'marca'" class="form-group">
                                            <label :for="nome">{{nome}}</label>
                                            <select class="form-control" :id='produto[nome]' v-model="produto[nome+'Id']">
                                                <!-- aqui pega todas as marcas-->
                                                <option v-for="marca in marcas" :key='marca.id' :value="marca.id">
                                                    {{ marca.data().nome }}
                                                </option>
                                            </select>
                                        </div>
                                                <!-- aqui pega os dados dos arrays-->
                                        <div v-if="Array.isArray(dado)">
                                            <label :for="nome">{{nome}}</label>
                                            <div :id="produto[nome]" class="form-check">
                                                <div v-for="option in dado" :key="option" :value="option">
                                                    <input class="form-check-input" type="radio" :name="nome" :id="produto[option]" :value="option" v-model="produto[nome]">
                                                    <label class="form-check-label" :for="option">{{option}}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="nome">Nome</label>
                                        <input class="form-control" placeholder="Nome" type="text" v-model="produto.nome" id='nome'>
                                    </div>

                                    <div class="form-group">
                                        <label for="inputAvatar">Imagem</label>
                                        <b-form-file
                                            id="inputAvatar"
                                            v-model="imagemEdit"
                                            :state="Boolean(imagem)"
                                            placeholder="Faça o upload de uma imagem..."
                                            accept=".jpg, .png, .gif"
                                            browse-text="Upload"
                                            no-drop
                                        ></b-form-file>
                                    </div>
                                </div>
                                <!-- <div class="form-group">
                                    <label for="imagem">Imagem</label>
                                    <input class="form-control" placeholder="url" type="text" v-model="imagem" id='imagem'>
                                </div> -->
                            </form>
                        </div>
                        
                        <div v-if="status != 'Processando...'" class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal" @click='cancelaEditarProduto()'>Cancelar</button>
                            <button type="submit" class="btn btn-success" data-dismiss="modal" @click='confirmaEditarProduto()'>Salvar</button>
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
        this.getProdutos();
        this.getCategorias();
        this.consultaMarcas();
    },

    data() {
        return {
            produtos: [],
            status: '',
            itemSelecionadoId: '',
            produtoId: '',
            produto: {},
            categorias: [],
            categoria: '',
            categoriaEscolhida: '',
            loadingCategorias: false,
            marcas: [],
            opcoes: [],
            imagem: null,
            nome: '',
            loading: true,
            produtoInput: {},
            imagemEdit: null,
        }
    },

    mounted() {
        // eslint-disable-next-line no-undef
        $("#ModalCadProduto").on('hidden.bs.modal', this.limpa);

        // eslint-disable-next-line no-undef
        $("#ModalDel").on('hidden.bs.modal', this.cancelaDeleteProduto);
    },

    methods: {
        getProdutos: function() {
            this.loading = true;
            this.produtos = [];
            let proms = [];
            const getCategoria = (idCategoria) => this.getCategoria(idCategoria);
            const getMarca = (idMarca) => this.getMarca(idMarca);
            const pushProduto = (data) => this.produtos.push(data);             

            const db = firebase.firestore();

            proms.push(db.collection('produtos').orderBy('nome').get()
                .then(async function(snapProdutos) {
                    for (let produto of snapProdutos.docs) {
                        let data = {...produto.data()};

                        let categoria = await getCategoria(data.Categoria);
                        data.Categoria = categoria.categoriaNome;
                        data.CategoriaId = categoria.categoriaId;
                        data.CategoriaData = categoria.categoriaData;

                        let keys = Object.keys(data);
                        for (let key of keys) {
                            if (key.toUpperCase().includes("MARCA")) {
                                let marca = await getMarca(data[key])
                                data[key] = marca.marcaNome;
                                data[key+'Id'] = marca.marcaId;
                            }
                        }

                        data.id = produto.id;

                        pushProduto(data);
                    }
                })
            )

            Promise.all(proms)
                .then(() => {
                    this.loading = false;
                })
        },
        getCategorias: async function() {
            this.loadingCategorias = true;
            const db = firebase.firestore();

            await db.collection('categorias').get()
                .then((snapCategorias) => {
                    for (let cat of snapCategorias.docs) {
                        this.categorias.push(cat)
                    }

                    if (this.$route.query.categoria) {
                        this.categoria = this.$route.query.categoria;
                    }

                    this.loadingCategorias = false;
                })
        },
        consultaMarcas: function() {
            const db = firebase.firestore();

            db.collection('marcas').orderBy("nome").get()
                .then((marcasSnap) => {
                    let marcas = [];
        
                    for (const marca of marcasSnap.docs) {
                        marcas.push(marca)
                    }
        
                    this.marcas = marcas
                })
            },
        novoProduto: function(){
            // eslint-disable-next-line no-undef
           $('#ModalCadProduto').modal();
        },
        cadastraProduto: async function() {
            this.status = 'Processando...';

            const db = firebase.firestore();
            let objSet = {};
            let dados;

            for (let cat of this.categorias) {
                if (cat.id == this.categoria.id) {
                    objSet['Categoria'] = cat.id;
                    break
                }
            }

            dados = this.categoria.data();

            for (let nome of Object.keys(dados)) {
                if (dados[nome] == 'Boolean') {
                    const bool = document.getElementById(nome).checked;

                    if (typeof bool !== "boolean") {
                        this.status = 'O valor em ' + nome + ' não é um boolean.';
                        return
                    }

                    objSet[nome] = bool;
                } else if (dados[nome] == 'String') {
                    const str = document.getElementById(nome).value;

                    if (str == '') {
                        this.status = 'O valor em ' + nome + ' está vazio.';
                        return
                    }

                    objSet[nome] = str;
                } else if (dados[nome] == 'Number') {
                    const num = parseFloat(document.getElementById(nome).value);

                    if (isNaN(num)) {
                        this.status = 'O valor em ' + nome + ' não é um número.';
                        return
                    }

                    objSet[nome] = num;
                } else if (dados[nome] == 'marca') {
                    const marcaId = document.getElementById(nome).value;

                    objSet[nome] =  marcaId;

                    if (!objSet[nome]) {
                        this.status = nome + ' não está selecionado.';
                        return
                    }
                } else if (Array.isArray(dados[nome])) {
                    let str = this.opcoes[nome];
                    let radios = document.getElementsByName(nome);

                    for (let i = 0, length = radios.length; i < length; i++) {
                        if (radios[i].checked) {
                            str = radios[i].value;
                            break;
                        }
                    }

                    if (str == '') {
                        this.status = nome + ' não está selecionado.';
                        return
                    }
                    objSet[nome] = str
                }
            }

            if (this.nome == '') {
                this.status = 'O valor em nome está vazio.';
                return
            }

            objSet['nome'] = this.nome;

            if (!this.imagem) {
                this.status = 'Não foi escolhida uma imagem.';
                return
            }

            db.collection('produtos').add(objSet)
                .then((docRef) => {
                    let storage = firebase.storage();
                    let storageRef = storage.ref('produtos/' + docRef.id + '.jpg');
                    storageRef.put(this.imagem)
                        .then(() => {
                            this.status = 'Produto cadastrado com sucesso.';
                            this.getProdutos();
                            // eslint-disable-next-line no-undef
                            $('#ModalCadProduto').modal('hide');
                        })
                }).catch((err) => {
                    this.status = err.message;
                })
        },
         
        limpa: function() {
                if (this.statu == 'Produto cadastrado com sucesso.') {
                    this.categoria = '';
                    this.marcas = [];
                    this.opcoes = [];
                    this.status = '';
                    this.url = '';
                }
            },

        editarProduto: function (produto) {
            this.status = '';
            this.produto = produto;
            this.produtoId = produto.id;
            
            // eslint-disable-next-line no-undef
            $('#ModalEdit').modal();
        },

        deleteProduto: function(itemSelecionadoId) {
            this.status = 'Tem certeza que deseja excluir esse Produto?';

            this.itemSelecionadoId = itemSelecionadoId;
            
            // eslint-disable-next-line no-undef
            $('#ModalDel').modal();
        },

        confirmaDeleteProduto: function() {
            this.status = 'Processando...';

            const id = this.itemSelecionadoId;
            const db = firebase.firestore();

            db.doc(`produtos/${id}`).delete().then(() => {
                this.getProdutos();
                // eslint-disable-next-line no-undef
                $('#ModalDel .close').click();
            }).catch((error) => {
                console.error("Erro ao excluir produto! ", error);
            });
        },

        cancelaDeleteProduto: function() {
            this.status = '';
        },

        confirmaEditarProduto: function() {
            this.status = 'Processando...';

            const id = this.produtoId;
            const produto = this.produto;
            const db = firebase.firestore();

            let objInput = {};

            for (let key of Object.keys(produto)) {
                if (key != 'id') {
                    if (produto[key+'Id']) {
                        objInput[key] = produto[key+'Id'];
                    } else if (!key.toUpperCase().includes('ID') && !key.toUpperCase().includes('DATA')) {
                        objInput[key] = produto[key];
                    }
                }
            }

            db.doc(`produtos/${id}`).update(objInput).then(() => {
                this.getProdutos();
                // eslint-disable-next-line no-undef
                $('#ModalEdit').modal('hide');
            }).catch((error) => {
                console.error("Erro ao editar produto! ", error);
            });
        },
        
        getCategoria: async function(id) {
            const db = firebase.firestore();
            let categoriaNome = '';
            let categoriaId = '';
            let categoriaData = {};

            await db.doc(`categorias/${id}`).get()
                .then((doc) => {
                    categoriaData = {...doc.data()}
                    categoriaNome = doc.data().nome
                    categoriaId = doc.id;
                })

            return {categoriaNome: categoriaNome, categoriaId: categoriaId, categoriaData: categoriaData}
        },
        
        getMarca: async function(id) {
            const db = firebase.firestore();
            let marcaNome = '';
            let marcaId = '';

            await db.doc(`marcas/${id}`).get()
                .then((doc) => {
                    marcaNome = doc.data().nome
                    marcaId = doc.id;
                })

            return {marcaNome: marcaNome, marcaId: marcaId}
        },
    }
  }
</script>

<style scoped>

</style>