<template>
    <div>
        <b-skeleton-wrapper :loading="loadingCampos || loadingOfertas" style="overflow-x:auto;">
            <template #loading>
                <b-card no-body class="overflow-hidden">
                    <b-row no-gutters>
                        <b-col md="6">
                            <b-skeleton-img card-img="left" height="350px"></b-skeleton-img>
                        </b-col>

                        <b-col md="6">
                            <b-card-body>
                                <b-card-text>
                                    <b-skeleton height="70px"></b-skeleton>
                                </b-card-text>

                                <b-card-text>
                                    <b-skeleton height="25px"></b-skeleton>
                                </b-card-text>

                                <b-card-text>
                                    <b-skeleton height="25px"></b-skeleton>
                                </b-card-text>

                                <b-skeleton-table :columns="3"></b-skeleton-table>
                            </b-card-body>
                        </b-col>
                    </b-row>
                </b-card>

                <b-skeleton-table :columns="2"></b-skeleton-table>
            </template>

            <b-card class="overflow-hidden" border-variant="success" footer-border-variant="success" header-border-variant="success" footer-bg-variant="dark" footer-text-variant="light">
                <b-row no-gutters>
                    <b-col md="6">
                        <b-card-img-lazy :src="produto.img" style="object-fit: contain; rounded-0"></b-card-img-lazy>
                    </b-col>

                    <b-col md="6" style="overflow-x:auto;">
                        <b-card-title>{{campos.nome}}</b-card-title>

                        <div>
                            <div style="display: inline; margin-right: 20px;" v-b-tooltip.hover.bottom="'Avaliações'" variant="dark">
                                <a href="#" @click="showRating()" style="text-decoration: none;">
                                    <p style="display: inline; margin-right: 5px;"><b class="avaliacao">{{getMediaAvaliacoes()}}</b></p>
                                    <b-icon icon="star-fill" font-scale="1" variant="warning"></b-icon>
                                </a>
                            </div>

                            <div style="display: inline; margin-right: 20px;" v-b-tooltip.hover.bottom="'Alerta de preço'" variant="dark">
                                <a href="#" @click="showAlert()" style="text-decoration: none;">
                                    <b-icon icon="bell-fill" font-scale="1" variant="secondary"></b-icon>
                                </a>
                            </div>

                            <div v-if="user" style="display: inline; margin-right: 20px;" v-b-tooltip.hover.bottom="'Favorito'" variant="dark">
                                <a href="#" style="text-decoration: none;">
                                    <b-icon v-if="!favoritado" icon="suit-heart-fill" @click="adicionaFavorito()" font-scale="1" variant="secondary"></b-icon>
                                    <b-icon v-else icon="suit-heart-fill" @click="deletaFavorito()" font-scale="1" variant="danger"></b-icon>
                                </a>
                            </div>

                            <div v-if="user" style="display: inline; margin-right: 20px;" v-b-tooltip.hover.bottom="'Lembretes Google Agenda'" variant="dark">
                                <a :href="stringAgenda" target="_blank" rel="nofollow">
                                    <b-icon icon="calendar-check-fill" variant="primary"></b-icon>
                                </a>
                            </div>
                        </div>

                        <b-card-text style="margin-top: 20px;">
                            Menor preço à vista:
                            <a :href="menorValorBoleto.url" target="_blank" rel="noopener noreferrer"><b class="preco">{{menorValorBoleto.valor | reais}}</b></a>
                        </b-card-text>

                        <b-card-text>
                            Menor preço a prazo:
                            <a :href="menorValorCartao.url" target="_blank" rel="noopener noreferrer"><b class="preco">{{menorValorCartao.valor | reais}}</b></a>
                        </b-card-text>

                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Loja</th>
                                    <th>Preço à vista</th>
                                    <th>Preço a prazo</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="oferta in ofertas" :key="oferta.url">
                                    <th>{{oferta.data.loja}}</th>
                                    <td>
                                        <a :href="oferta.data.url" target="_blank" rel="noopener noreferrer"><b class="preco">{{oferta.data.valorBoleto | reais}}</b></a>
                                    </td>
                                    <td>
                                        <a :href="oferta.data.url" target="_blank" rel="noopener noreferrer"><b class="preco">{{oferta.data.valorCartao | reais}}</b></a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-col>
                </b-row>
            </b-card>

            <div style="border-style: solid; border-color: #28a745; border-width: thin">
                <GChart
                    type="LineChart"
                    :data="chartData"
                    :options="chartOptions"
                    v-if="chartData.length > 1"
                />
            </div>

            <table class="table table-striped table-dark">
                <thead>
                    <tr>
                        <th>Detalhes</th>
                        <th></th>
                    </tr>
                </thead>
                
                <tbody>
                    <tr v-for="campo in Object.entries(campos).filter(x => x[0] != 'nome')" :key="campo[0]">
                        <th v-if="campo[0] != 'imagem'">{{campo[0]}}</th>
                        <td v-if="campo[0] != 'imagem'">{{campo[1]}}</td>
                    </tr>
                </tbody>
            </table>
        </b-skeleton-wrapper>

        <!-- Modal Avaliacao Produto -->
        <div class="modal fade" id="ModalRating" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ModalLabel">Avaliações</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="modal-body table-media">
                            <!-- Exibir media de avaliacoes -->
                            <h5>Média de avaliações</h5>
                            <!-- <div class="row">
                                <div>
                                    <h1>{{getMediaAvaliacoes()}}</h1>
                                </div>
                                <div>
                                    <star-rating
                                        v-model="ratingMedia"
                                        :star-size="20"            
                                        :increment="0.1"
                                        :max-rating="5"
                                        inactive-color="#d6d4d4"
                                        active-color="#FDBF46"
                                        :read-only="true"
                                        :show-rating="false">
                                    </star-rating>
                                </div>
                            </div> -->
                            <table class="text-center" v-if="!loadingAvaliacoes">
                                <th>
                                    <tr>
                                        <td><h1>{{getMediaAvaliacoes()}}</h1></td>
                                        <td>
                                            <star-rating
                                                v-model="ratingMedia"
                                                :star-size="20"            
                                                :increment="0.1"
                                                :max-rating="5"
                                                inactive-color="#d6d4d4"
                                                active-color="#FDBF46"
                                                :read-only="true"
                                                :show-rating="false">
                                            </star-rating>
                                        </td>
                                    </tr>
                                </th>
                            </table>
                            <!-- <div class="row" v-for="index in 5" :key="index">
                                <div v-if="index == 1">
                                    {{index}} estrela    
                                </div>

                                <div v-else>
                                    {{index}} estrelas    
                                </div>

                                <b-progress :value="getEstrelas(index)" :max="avaliacoes.length"></b-progress>

                                <div>
                                    {{getEstrelas(index)}}
                                </div>
                            </div> -->
                            <table style="width: 100%;">
                                <tr v-for="index in 5" :key="index">
                                    <td style="min-width: 75px; max-width: 75px;">
                                        <div v-if="index == 1">
                                            {{index}} estrela    
                                        </div>

                                        <div v-else>
                                            {{index}} estrelas    
                                        </div>
                                    </td>
                                    <td style="width: 50%;">
                                        <b-progress :value="getEstrelas(index)" :max="avaliacoes.length"></b-progress>
                                    </td>
                                    <td style="width: 10%; padding-left: 10px;">
                                        {{getEstrelas(index)}}
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <!-- Permitir fazer uma avalicao -->
                        <div v-if="user" class="modal-body div-avaliacao text-center">
                            <h5 style="margin-bottom: 30px;">Sua avaliação</h5>
                            <div id="div-rating" class="text-center">
                                <form @submit.prevent="confirmaAvaliacao">
                                        <star-rating style="display: flex; flex-direction: row; justify-content: center;"
                                            v-model="rating"
                                            :star-size="20"            
                                            :increment="1"
                                            :max-rating="5"
                                            inactive-color="#d6d4d4"
                                            active-color="#FDBF46"
                                            active-border-color="#000">
                                        </star-rating>
                                </form>
                            </div>

                            <b-button v-if="rating != 0" size="sm" class="my-2 my-sm-0" type="button" variant="outline-success" v-b-toggle.collapse style="margin-top: 20px !important;" @click="confirmaAvaliacao()">
                                Avaliar
                            </b-button>
                            
                            <b-form-valid-feedback :state="avaliado">
                                Avaliado com sucesso
                            </b-form-valid-feedback>
                        </div>

                        <!-- Não permitir avaliar -->
                        <div v-if="!user" class="modal-body div-avaliacao text-center">
                            <h5 style="margin-bottom: 30px;">Sua avaliação</h5>
                            <h6>Faça login para avaliar</h6>
                            <b-button variant="outline-success" type="submit" data-dismiss="modal" @click="goLogin()">Fazer login</b-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal alerta de preço -->
        <div class="modal fade" id="ModalAlert" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <b-overlay spinner-variant="success" rounded="sm">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ModalLabel">Alerta de preço</h5>
                            <!-- <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5> -->

                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div v-if="user" class="modal-body text-center">
                            <div class="modal-body" style="padding: 0 24%;">
                            <form>
                                <div class="form-group div-input-alerta">
                                    <p v-if="alertaSalvo">Alerta atual: <strong>{{alertaSalvo | reais}}</strong></p>
                                    <p v-if="alertaSalvo">Editar o alerta para quando este produto atingir o preço de:</p>
                                    <p v-else>Defina um alerta para quando este produto atingir o preço de:</p>

                                    <div class="input-group mb-2" style="width: 76%;">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">R$</span>
                                        </div>
                                        <input class="form-control text-right" style="padding-right: 15px;" type="number" v-model="alerta" :placeholder="alerta" required autocomplete="off" min="0" step="10.00" data-number-to-fixed="2" data-number-stepfactor="100">
                                    </div>
                                </div>
                                <div v-if="alerta">
                                    <b-button v-if="alertaSalvo" variant="outline-success" type="submit" data-dismiss="modal" @click="confirmaAlerta">Ajustar alerta de preço</b-button>
                                    <b-button v-else variant="outline-success" type="submit" data-dismiss="modal" @click="confirmaAlerta">Criar alerta de preço</b-button>
                                </div>
                                <div style="margin-top: 5px;">
                                    <p style="font-size: 8pt;">Menor preço atualmente: <span><strong>{{menorValorBoleto.valor | reais}}</strong></span></p>
                                </div>
                            </form>
                        </div>
                        </div>

                        <div v-else class="modal-body text-center">
                            <h6>Faça login para criar alerta</h6>
                            <b-button variant="outline-success" type="submit" data-dismiss="modal" @click="goLogin()">Fazer login</b-button>
                        </div>
                    </b-overlay>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from '@/firebase';
    import StarRating from 'vue-star-rating';
    import * as dayjs from 'dayjs';
    const customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)

    export default {
        components: {
            StarRating
        },

        data() {
            return {
                campos: {},
                menorValorBoleto: {},
                menorValorCartao: {},
                ofertas: [],
                loadingOfertas: true,
                loadingCampos: true,
                loadingAvaliacoes: true,
                produto: {},
                produtoId: '',
                nota: 0,
                rating: 0,
                ratingMedia: 0,
                avaliacoes: [],
                favoritos:[],
                favoritado: false,
                favoritoId: '',
                user: null,
                avaliado: false,
                alerta: 0,
                alertaSalvo: null,
                stringAgenda: '',
                chartData: [],
                chartOptions: {
                    title: 'Histórico de preços',
                    lineWidth: 5,
                    pointSize: 3,
                    series: {
                        0: { color: '#28a745' }
                    },
                }
            }
        },

        mounted() {
                // eslint-disable-next-line no-undef
                $("#ModalRating").on('hidden.bs.modal', this.limpaFeedback);
        },

        created() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    this.user = user;
                } else {
                    this.user = null;
                }
            });

            this.getProduto()
                .then(() => {
                    this.getImage();
                    this.getCampos()
                        .then(() => {
                            this.montaStringAgenda();                            
                        })
                    this.getOfertas();
                    this.getAvaliacoes();
                    this.getAlertaProduto();
                    this.getFavorito();
                    this.getHistorico();
                })
        },
        
        methods: {
            getCampos: async function() {
                this.loadingCampos = true;
                const db = firebase.firestore();
                let dados = {...this.produto.data()};
                let proms = [];

                for (let key in dados) {
                    if (key.toUpperCase().includes('MARCA')) {
                        proms.push(db.collection('marcas').doc(dados[key]).get()
                            .then((doc) => {
                                dados[key] = doc.data().nome;
                                this.campos = dados;
                            }, (err) => {
                                console.log('Falha ao buscar marca: ', err.message)
                                this.campos = dados
                            })
                            .catch((err) => {
                                console.log('Falha ao buscar marca: ', err.message)
                                this.campos = dados
                            })
                        )
                    } else if (key.includes('Categoria')) {
                        proms.push(db.collection('categorias').doc(dados[key]).get()
                            .then((doc) => {
                                dados[key] = doc.data().nome;
                                this.campos = dados;
                            }, (err) => {
                                console.log('Falha ao buscar categoria: ', err.message)
                                this.campos = dados
                            })
                            .catch((err) => {
                                console.log('Falha ao buscar categoria: ', err.message)
                                this.campos = dados
                            })
                        )
                    } else {
                        proms.push(this.trataCampo(this.produto.data()['Categoria'], dados[key], key)
                            .then((campo) => {
                                dados[key] = campo;
                                this.campos = dados;
                            })
                        );
                    }
                }

                await Promise.all(proms)
                    .then(() => {
                        this.loadingCampos = false;
                    })
            },

            getOfertas: async function() {
                this.loadingOfertas = true;
                const db = firebase.firestore();
                let proms = [];

                db.collection('ofertas').where('produto', '==', this.produto.id).get()
                    .then((ofertasSnap) => {
                        for (let o of ofertasSnap.docs) {
                            let oferta = {...o.data()}

                            proms.push(db.collection('lojas').doc(oferta.loja).get()
                                .then((doc) => {
                                    oferta['loja'] = doc.data().nome;
                                }, (err) => {
                                    console.log('Falha ao buscar loja: ', err.message)
                                })
                                .catch((err) => {
                                    console.log('Falha ao buscar loja: ', err.message)
                                })
                            )

                            this.ofertas.push({id: o.id, data: oferta});
                        }

                        Promise.all(proms)
                            .then(() => {
                                this.loadingOfertas = false;

                                for (let i = 0; i < this.ofertas.length; i++) {
                                    if (i == 0) {
                                        this.menorValorBoleto = {valor: this.ofertas[i].data.valorBoleto, url: this.ofertas[i].data.url};
                                        this.menorValorCartao = {valor: this.ofertas[i].data.valorCartao, url: this.ofertas[i].data.url};
                                    } else {
                                        if (this.ofertas[i].data.valorBoleto < this.menorValorBoleto.valor || typeof this.menorValorBoleto.valor == 'string')
                                            this.menorValorBoleto = {valor: this.ofertas[i].data.valorBoleto, url: this.ofertas[i].data.url};
                                        
                                        if (this.ofertas[i].data.valorCartao < this.menorValorCartao.valor  || typeof this.menorValorCartao.valor == 'string')
                                            this.menorValorCartao = {valor: this.ofertas[i].data.valorCartao, url: this.ofertas[i].data.url};
                                    }
                                }
                            })
                    }, (err) => {
                        console.log('Falha ao buscar oferta: ', err.message)
                    })
                    .catch((err) => {
                        console.log('Falha ao buscar oferta: ', err.message)
                    })
            }, 
            
            trataCampo: async function(categoria, campo, key) {
                const db = firebase.firestore();
                let campoTratado;

                await db.collection('categorias').doc(categoria).get()
                    .then((doc) => {
                        let categoriaDados = doc.data();
                        
                        if (categoriaDados[key] == 'Number') {
                            if (categoriaDados[`${key}Unidade`] != 'CL')
                                campoTratado = `${campo}${categoriaDados[`${key}Unidade`]}`
                            else
                                campoTratado = `${categoriaDados[`${key}Unidade`]}${campo}`
                        } else if (categoriaDados[key] == 'Boolean') {
                            campo ? campoTratado = 'Sim' : campoTratado = 'Não'
                        } else {
                            campoTratado = campo
                        }
                    }, (err) => {
                        console.log('Falha ao buscar categoria: ', err.message)
                    })
                    .catch((err) => {
                        console.log('Falha ao buscar categoria: ', err.message)
                    })
                
                return campoTratado;
            },

            getProduto: async function() {
                const db = firebase.firestore();

                await db.collection('produtos').doc(this.$route.params.id).get()
                    .then((doc) => {
                        this.produto = doc;
                        //console.log(this.produto.id);
                    }, (err) => {
                        console.log('Falha ao buscar produto: ', err.message)
                    })
                    .catch((err) => {
                        console.log('Falha ao buscar produto: ', err.message)
                    })
            },

            getImage: function() {
                const storage = firebase.storage();
                const storageRef = storage.ref('produtos/' + this.produto.id + '.jpg');

                storageRef.getDownloadURL()
                    .then((url) => {
                        this.produto['img'] = url;
                    })
            },

            showRating: function() {
                this.produtoId = this.$route.params.id;

                // eslint-disable-next-line no-undef
                $('#ModalRating').modal();
            },

            confirmaAvaliacao: async function() {
                const currentUser = firebase.auth().currentUser;
                const db = firebase.firestore();
                const productId = this.produtoId;
                const userUid = currentUser.uid;
                const nota = this.rating;
                let avaliacaoExists = false;
                let avaliacaoId = '';
                let objSet = {};
                
                objSet['nota'] = nota;
                objSet['userUid'] = userUid;

                await db.collection(`produtos/${productId}/avaliacoes`).where('userUid', '==', userUid).get()
                    .then((avaliacoesSnap) => {
                        avaliacaoExists = avaliacoesSnap.size > 0;
                        
                        for (let a of avaliacoesSnap.docs) {
                            avaliacaoId = a.id;
                        } 
                    })

                if (avaliacaoExists) {
                    await db.doc(`produtos/${productId}/avaliacoes/${avaliacaoId}`).update(objSet)
                        .then(() => {
                            this.avaliado = true;
                            this.getAvaliacoes();
                            console.log('Produto avaliado com sucesso.');
                        }).catch((err) => {
                            console.log('Erro ao registrar avaliação! Mensagem: ' + err.message);
                        });
                } else {
                    await db.collection(`produtos/${productId}/avaliacoes`).add(objSet)
                        .then(() => {
                            this.avaliado = true;
                            this.getAvaliacoes();
                            console.log('Produto avaliado com sucesso.');
                        }).catch((err) => {
                            console.log('Erro ao registrar avaliação! Mensagem: ' + err.message);
                        });
                }
            },

            getAvaliacoes: async function() {
                this.loadingAvaliacoes = true;
                const db = firebase.firestore();
                const productId = this.$route.params.id;
                this.avaliacoes = [];
                const currentUser = firebase.auth().currentUser;

                await db.collection(`produtos/${productId}/avaliacoes`).get()
                    .then((avaliacoesSnap) => {
                        for (let a of avaliacoesSnap.docs) {
                            let nota = a.data().nota;
                            let userUid = a.data().userUid;

                            if (currentUser) {
                                if (userUid == currentUser.uid) {
                                    this.rating = nota;
                                }
                            }

                            this.avaliacoes.push({userUid: userUid, nota: nota});
                        }
                    }, (err) => {
                        console.log('Falha ao buscar avaliação: ', err.message)
                    })
                    .catch((err) => {
                        console.log('Falha ao buscar avaliação: ', err.message)
                    })

                this.loadingAvaliacoes = false;
            },

            getMediaAvaliacoes: function() {
                let soma = 0;

                if (this.avaliacoes.length == 0) {
                    return 0;
                }
                
                for (let i = 0; i < this.avaliacoes.length; i++) {
                    soma += this.avaliacoes[i].nota;
                }

                let media = soma / this.avaliacoes.length;
                media = Math.round(media * 10) / 10;
                this.ratingMedia = media;

                return media;
            },

            getEstrelas: function(nota) {
                let soma = 0;
                
                for (let i = 0; i < this.avaliacoes.length; i++) {
                    if (this.avaliacoes[i].nota == nota) {
                        soma++;
                    }
                }

                return soma;
            },

            limpaFeedback: function() {
                const db = firebase.firestore();
                const productId = this.$route.params.id;
                this.avaliado = false;
                const currentUser = firebase.auth().currentUser;

                if (currentUser) {
                    db.collection(`produtos/${productId}/avaliacoes`).get()
                        .then((avaliacoesSnap) => {
                            let atualizou = false;

                            for (let a of avaliacoesSnap.docs) {
                                let nota = a.data().nota;
                                let userUid = a.data().userUid;
    
                                if (userUid == currentUser.uid) {
                                    this.rating = nota;
                                    atualizou = true;
                                }
                            }

                            if (!atualizou) {
                                this.rating = 0;
                            }
                        })
                } else {
                    this.rating = 0;
                }
            },

            showAlert: function() {
                this.produtoId = this.$route.params.id;

                // eslint-disable-next-line no-undef
                $('#ModalAlert').modal();
            },

            confirmaAlerta: async function() {
                const currentUser = firebase.auth().currentUser;
                const db = firebase.firestore();
                const productId = this.produtoId;
                let alerta = this.alerta;
                let alertaId = '';
                let alertaExists = false;
                let getAlertaProduto = () => {this.getAlertaProduto()};
                let objSet = {};

                objSet['valor'] = alerta;
                objSet['productId'] = productId;
                objSet['userUid'] = currentUser.uid;

                await db.collection('alertas').where('userUid', '==', objSet['userUid']).where('productId', '==', objSet['productId']).get()
                    .then(async function (alertasSnap) {
                        alertaExists = alertasSnap.size > 0;

                        for (let a of alertasSnap.docs) {
                            alertaId = a.id;
                        }

                        if (alertaExists) {
                            await db.doc(`alertas/${alertaId}`).update(objSet)
                                .then(() => {
                                    getAlertaProduto();
                                    console.log('Alerta registrado com sucesso.');
                                }).catch((err) => {
                                    console.log('Erro ao registrar alerta! Mensagem: ' + err.message);
                                });
                        } else {
                            await db.collection('alertas').add(objSet)
                                .then(() => {
                                    getAlertaProduto();
                                    console.log('Alerta registrado com sucesso.');
                                }).catch((err) => {
                                    console.log('Erro ao registrar alerta! Mensagem: ' + err.message);
                                });
                        }
                    })

            },

            getAlertaProduto: async function() {
                //this.loadingAvaliacoes = true;
                const db = firebase.firestore();
                const productId = this.$route.params.id;
                const currentUser = firebase.auth().currentUser;
                let alertaExists = false;

                await db.collection('alertas').where('productId', '==', productId).where('userUid', '==', currentUser.uid).get()
                    .then((alertasSnap) => {
                        alertaExists = alertasSnap.size > 0;

                        if (alertaExists) {
                            for (let a of alertasSnap.docs) {
                                let alerta = a.data().valor;
                                this.alerta = alerta;
                                this.alertaSalvo = alerta;
                            }
                        } else {
                            this.alerta = "";
                            this.alertaSalvo = "";
                        }
                    }, (err) => {
                        console.log('Falha ao buscar alerta: ', err.message)
                    })
                    .catch((err) => {
                        console.log('Falha ao buscar alerta: ', err.message)
                    })
            },

            getFavorito: async function(){
                const db = firebase.firestore();
                const currentUser = firebase.auth().currentUser;
                const productId = this.$route.params.id;
                const userUid = currentUser.uid;
                this.favoritado = false;

                db.collection('favoritos').where('userUid', '==', userUid).where('productId', '==', productId).get()
                    .then((favoritosSnap) => {
                        this.favoritado = favoritosSnap.size > 0;
                        
                        for (let f of favoritosSnap.docs) {
                            this.favoritoId = f.id;
                        } 
                    })
            },

            adicionaFavorito:function(){
                const db = firebase.firestore();
                const currentUser = firebase.auth().currentUser;
                const userUid = currentUser.uid;
                const productId = this.$route.params.id;

                let objSet = {
                    userUid: userUid,
                    productId: productId
                }
                
                db.collection('favoritos').add(objSet)
                    .then((doc) => {
                        this.favoritado = true;                        
                        this.favoritoId = doc.id;
                        console.log('Favorito adicionado com sucesso!');
                    }).catch((err) => {
                        console.log('Erro ao adicionar favorito! Mensagem: ' + err.message);
                    });
            },

            deletaFavorito:function(){
                const db = firebase.firestore();
                const id = this.favoritoId;

                db.doc(`favoritos/${id}`).delete().then(() => {
                    this.favoritado = false;                        
                    this.favoritoId = '';
                    
                    console.log("Favorito removido com sucesso!");
                }).catch((error) => {
                    console.error("Erro ao excluir favorito! ", error);
                });
            },

            goLogin: async function() {
                // eslint-disable-next-line no-undef
                $('#ModalAlert').modal('hide');

                await this.$router.push({
                    name: 'login'
                });
            },

            getHistorico: function() {
                const db = firebase.firestore();
                const productId = this.$route.params.id;
                let chartData = [
                    ['Dia', 'Preço (R$)'],
                ];
                this.chartData = chartData;

                db.collection(`produtos/${productId}/historico`).get()
                    .then((historicoSnap) => {
                        for (let h of historicoSnap.docs) {
                            let data = h.data();

                            if (data.preco != 'Indisponível') {
                                chartData.push([
                                    data.date,
                                    data.preco
                                ])
                            }
                        }

                        chartData.sort((x, y) => {
                            return dayjs(x[0], 'DD/MM/YYYY').toDate() - dayjs(y[0], 'DD/MM/YYYY').toDate()
                        })

                        this.chartData = chartData;
                    })
            },

            montaStringAgenda: function() {
                let nome = this.campos.nome.replace(' ', '+');
                let dataAntes = dayjs().add(3, 'hour');
                dataAntes = dataAntes.format('YYYYMMDD') + 'T' + '210000Z';
                let dataDepois = dayjs().add(3, 'hour').add(7, 'day');
                dataDepois = dataDepois.format('YYYYMMDD') + 'T' + '210000Z';
                let detalhe = `Link+do+produto:+https://hora-do-up.web.app/produto/${this.$route.params.id}`

                this.stringAgenda = `http://www.google.com/calendar/event?action=TEMPLATE&text=${'Checar preço: ' + nome}&dates=${dataAntes}/${dataDepois}&details=${detalhe}`
            }
        },

        filters: {
            reais: function(valor) {
                const num = parseFloat(valor);
                if (!isNaN(num)) {
                    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
                } 
                return valor
            }
        }
    }
</script>