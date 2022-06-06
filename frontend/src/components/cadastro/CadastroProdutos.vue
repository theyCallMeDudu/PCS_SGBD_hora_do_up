<template>
    <div class="cad-product text-center">
        <form @submit.prevent="cadastraProduto" class="form-signin">
            <h1 class="h3 mb-3 font-weight-normal">Cadastro de Produtos</h1>
            <div class="form-group">
                <label for="categoriaSelect">Categoria</label>
                <select class="form-control" v-model="categoria" id="categoriaSelect">
                    <option v-for="c in categorias" :key='c.id' :value="c">
                        {{ c.data().nome }}
                    </option>
                </select>
            </div>

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
                <!-- <div class="form-group">
                    <label for="imagem">Imagem</label>
                    <input class="form-control" placeholder="url" type="text" v-model="imagem" id='imagem'>
                </div> -->
                
                <div class="form-group">
                    <button type="submit" class="btn btn-lg btn-success btn-block" data-toggle="modal" data-target="#Modal">Cadastrar</button>
                </div>
            </div>
        </form>

        <div class="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                        <div v-if="status != 'Processando...'" class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">{{status}}</h5>

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
        created() {
            this.consultaMarcas();
            this.getCategorias();
        },

        mounted() {
            // eslint-disable-next-line no-undef
            $("#Modal").on('hidden.bs.modal', this.limpa);
        },

        data() {
            return {
                categorias: [],
                categoria: '',
                marcas: [],
                opcoes: [],
                status: '',
                imagem: null,
                nome: '',
            }
        },

        methods: {
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
            
            cadastraProduto: async function() {
                this.status = 'Processando...';

                // eslint-disable-next-line no-undef
                $('#Modal').modal();

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

            getCategorias: async function() {
                const db = firebase.firestore();

                await db.collection('categorias').get()
                    .then((snapCategorias) => {
                        for (let cat of snapCategorias.docs) {
                            this.categorias.push(cat)
                        }
                    })
            },
        }
    }
</script>