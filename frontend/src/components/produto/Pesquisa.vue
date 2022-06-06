<template>
    <!-- <div class="card-columns">
        <div class="card" v-for="produto in produtos" :key="produto.id">
            <img class="card-img-top" src="" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">{{produto.data.nome}}</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <router-link :to="{name: 'produto',params: {produto: produto}}" class="btn btn-primary">Go somewhere</router-link>
            </div>
        </div>
    </div> -->
    <div>
        <b-skeleton-wrapper :loading="loading || loadingCategorias">
            <template #loading>
                <div id="filtrar" style="padding-bottom: 12px">
                    <b-skeleton type="input" block variant="success" v-b-toggle.sidebar-1></b-skeleton>
                </div>
                
                <b-card-group deck>
                    <b-card v-for="index in 12" :key="index" border-variant="success" footer-border-variant="success" header-border-variant="success" footer-bg-variant="dark" footer-text-variant="light" style="margin-bottom: 30px;" class="card-produto">
                        <b-skeleton-img height="213px" style="object-fit: contain; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;"></b-skeleton-img>

                        <b-card-text>
                            <b-skeleton height="72px" variant="secondary"></b-skeleton>
                        </b-card-text>

                        <template #footer>
                            <small>
                                <b-skeleton variant="light" transparent width="60%"></b-skeleton>
                            </small>

                            <b-card-text>
                                <b-skeleton variant="success" width="45%" style="min-height: 24px"></b-skeleton>
                            </b-card-text>

                            <small>
                                <b-skeleton variant="light" width="60%"></b-skeleton>
                            </small>

                            <b-card-text>
                                <b-skeleton variant="success" width="45%" style="min-height: 24px"></b-skeleton>
                            </b-card-text>
                        </template>
                    </b-card>
                </b-card-group>
            </template>

            <div>
                <div id="filtrar" style="padding-bottom: 12px">
                    <b-button block variant="success" v-b-toggle.sidebar-1>Filtrar</b-button>
                </div>

                <b-sidebar id="sidebar-1" title="Filtros" bg-variant="dark" text-variant="light" backdrop shadow>
                    <div class="px-3 py-2">
                        <div class="form-group">
                            <label for="categoriaSelect">Categoria</label>
                            <select class="form-control" v-model="categoria" id="categoriaSelect" required>
                                <option v-for="c in categorias" :key='c.id' :value="c.id">
                                    {{ c.data().nome }}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="precoMax">Preço máximo</label>
                            <b-form-input id="precoMax" v-model="precoMax" type="range" :step="maiorPreco / 50" min="0" :max="maiorPreco"></b-form-input>
                            <div class="mt-2">{{ precoMax | reais }}</div>
                        </div>

                        <div class="form-group">
                            <label for="sortSelect">Ordenar por:</label>
                            <select class="form-control" v-model="sort" id="sortSelect" required>
                                <option v-for="s in sorts" :key='s.id' :value="s.id">
                                    {{ s.nome }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <template #footer="{ hide }">
                        <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
                            <b-button block variant="success" size="sm" @click="hide();filtrar()">Filtrar</b-button>
                        </div>
                    </template>
                </b-sidebar>

                <b-card-group v-if="produtos.length > 0 && !loading && !loadingCategorias" deck>
                    <b-card v-for="produto in sortProdutos()" :key="produto.id" border-variant="success" footer-border-variant="success" header-border-variant="success" footer-bg-variant="dark" footer-text-variant="light" style="margin-bottom: 30px;" class="card-produto">
                        <div @click="goProduto(produto)" style="width: 100%;padding-top: 100%;position: relative; cursor: pointer;">
                            <b-card-img-lazy :src="produto.img" style="object-fit: contain; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;"></b-card-img-lazy>
                        </div>

                        <b-card-text @click="goProduto(produto)" style="cursor: pointer; min-height: 72px"><b>{{produto.data.nome}}</b></b-card-text>

                        <template #footer>
                            <small>
                                Menor preço à vista:
                            </small>

                            <b-card-text @click="goProduto(produto)" style="cursor: pointer"><b class="preco">{{produto.precos.menorValorBoleto | reais}}</b></b-card-text>

                            <small>
                                Menor preço a prazo:
                            </small>

                            <b-card-text @click="goProduto(produto)" style="cursor: pointer"><b class="preco">{{produto.precos.menorValorCartao | reais}}</b></b-card-text>
                        </template>
                    </b-card>
                </b-card-group>
            </div>

            <h1 v-if="produtos.length == 0 && !loading && !loadingCategorias">Nenhum produto encontrado</h1>
        </b-skeleton-wrapper>
    </div>

    <!-- <b-overlay spinner-variant="success"  spinner-variant="success":show="loading" rounded="sm">
        <b-card-group v-if="produtos.length > 0 && !loading" columns>
            <b-card :title="produto.data.nome" img-src="https://img.terabyteshop.com.br/archive/4157291290/processador-intel-core-i5-10gen-01.png" img-alt="Image" v-for="produto in produtos" :key="produto.id" @click="goProduto(produto)" style="cursor: pointer" img-top>
                <b-card-text>
                    Menor preço a prazo: {{produto.precos.menorValorBoleto | reais}}
                </b-card-text>

                <b-card-text>
                    Menor preço à vista: {{produto.precos.menorValorCartao | reais}}
                </b-card-text>
            </b-card>
        </b-card-group>

        <h1 v-if="produtos.length == 0 && !loading">Nenhum produto encontrado</h1>
    </b-overlay> -->
</template>

<script>
    import firebase from '@/firebase';

    export default {
        created() {
            this.getCategorias();
            this.pesquisar();
        },

        data()  {
            return {
                produtos: [],
                loading: false,
                categorias: [],
                categoria: '',
                loadingCategorias: false,
                sorts: [
                    {id: 'menorPreco', nome: 'Menor preço'},
                    {id: 'maiorPreco', nome: 'Maior preço'},
                ],
                sort: 'menorPreco',
                precoMax: 0,
                maiorPreco: 0
            }
        },

        methods: {
            pesquisar: async function() {
                this.loading = true;
                this.produtos = [];
                const db = firebase.firestore();
                let produtos;

                if (this.$route.query.categoria) {
                    await db.collection('produtos').where('Categoria', '==', this.$route.query.categoria).get()
                        .then((produtosSnap) => {
                            produtos = produtosSnap;
                        }, (err) => {
                            console.log('Falha ao buscar produtos: ', err.message)
                        })
                        .catch((err) => {
                            console.log('Falha ao buscar produtos: ', err.message)
                        })
                } else {
                    await db.collection('produtos').get()
                        .then((produtosSnap) => {
                            produtos = produtosSnap;
                        }, (err) => {
                            console.log('Falha ao buscar produtos: ', err.message)
                        })
                        .catch((err) => {
                            console.log('Falha ao buscar produtos: ', err.message)
                        })
                }

                if (this.$route.query.texto) {
                    let proms = [];
                    
                    let p1 = "";
                    //Linha para retirar a acentuação da pesquisa, além de deixar em maiúsculo
                    let pesquisa = this.$route.query.texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

                    let storage = firebase.storage();

                    if (produtos) {
                        for (let p of produtos.docs) {
                            //Linha para retirar a acentuação das strings p, além de deixar em maiúsculo
                            p1 = p.data().nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
    
                            if (p1.includes(pesquisa)){
                                proms.push(this.getOfertas({id: p.id, data: p.data()})
                                    .then((precos) => {
                                        if (precos.menorValorBoleto) {
                                            let storageRef = storage.ref('produtos/' + p.id + '.jpg');

                                            proms.push(storageRef.getDownloadURL()
                                                .then((url) => {
                                                    if (this.$route.query.maiorPreco) {
                                                        if (this.$route.query.maiorPreco >= precos.menorValorBoleto || this.$route.query.maiorPreco == 0)
                                                            this.produtos.push({id: p.id, data: p.data(), precos: precos, img: url});
                                                    } else {
                                                        this.produtos.push({id: p.id, data: p.data(), precos: precos, img: url});
                                                    }
                                                })
                                            )
                                        }
                                    })
                                )
                            }
                        }
                    }

                    let setLoading = (bool) => {this.loading = bool};

                    setTimeout(async function() {
                        await Promise.all(proms);

                        setTimeout(function() {
                            setLoading(false);
                        }, 2000);
                    }, 1000);
                } else {
                    let storage = firebase.storage();
                    let proms = [];

                    if (produtos) {
                        for (let p of produtos.docs) {
                            proms.push(this.getOfertas({id: p.id, data: p.data()})
                                .then((precos) => {
                                    if (precos.menorValorBoleto) {
                                        let storageRef = storage.ref('produtos/' + p.id + '.jpg');
                                        
                                        proms.push(storageRef.getDownloadURL()
                                            .then((url) => {
                                                if (this.$route.query.maiorPreco) {
                                                    if (this.$route.query.maiorPreco >= precos.menorValorBoleto || this.$route.query.maiorPreco == 0)
                                                        this.produtos.push({id: p.id, data: p.data(), precos: precos, img: url});
                                                } else {
                                                    this.produtos.push({id: p.id, data: p.data(), precos: precos, img: url});
                                                }
                                            })
                                        )
                                    }
                                })
                            )
                        }
                    }

                    let setLoading = (bool) => {this.loading = bool};

                    setTimeout(async function() {
                        await Promise.all(proms);

                        setTimeout(function() {
                            setLoading(false);
                        }, 2000);
                    }, 1000);
                }
            },
            goProduto: function(produto) {
                this.$router.push({
                    name: 'produto',
                    params: {
                        id: produto.id
                    }
                });
            },
            getOfertas: async function(produto) {
                const db = firebase.firestore();
                let menorValorBoleto, menorValorCartao;
                let ofertas = [];
                let proms = [];

                await db.collection('ofertas').where('produto', '==', produto.id).get()
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

                            ofertas.push({id: o.id, data: oferta});
                        }

                        for (let i = 0; i < ofertas.length; i++) {
                            if (i == 0) {
                                menorValorBoleto = ofertas[i].data.valorBoleto
                                menorValorCartao = ofertas[i].data.valorCartao
                            } else {
                                if (ofertas[i].data.valorBoleto < menorValorBoleto || typeof menorValorBoleto == 'string') {
                                    menorValorBoleto = ofertas[i].data.valorBoleto
                                }
                                
                                if (ofertas[i].data.valorCartao < menorValorCartao || typeof menorValorCartao == 'string') {
                                    menorValorCartao = ofertas[i].data.valorCartao
                                }
                            }
                        }
                    }, (err) => {
                        console.log('Falha ao buscar oferta: ', err.message)
                    })
                    .catch((err) => {
                        console.log('Falha ao buscar oferta: ', err.message)
                    })
                
                await Promise.all(proms);
                
                return {menorValorBoleto: menorValorBoleto, menorValorCartao: menorValorCartao};
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
            filtrar: function() {
                this.$router.replace({
                    name: 'home',
                    query: {
                        texto: this.$route.query.texto,
                        categoria: this.categoria,
                        sort: this.sort,
                        maiorPreco: this.precoMax
                    }
                });
            },
            sortProdutos: function() {
                let produtos = [...this.produtos];

                if (this.$route.query.sort == 'maiorPreco') {
                    produtos.sort((a,b) => (a.precos.menorValorBoleto < b.precos.menorValorBoleto)
                        ? 1
                        : ((b.precos.menorValorBoleto < a.precos.menorValorBoleto)
                            ? -1
                            : 0
                        )
                    )
                } else {
                    produtos.sort((a,b) => (a.precos.menorValorBoleto > b.precos.menorValorBoleto)
                        ? 1
                        : ((b.precos.menorValorBoleto > a.precos.menorValorBoleto)
                            ? -1
                            : 0
                        )
                    )
                }

                for (let p of produtos) {
                    if (p.precos.menorValorBoleto > this.maiorPreco) {
                        this.maiorPreco = p.precos.menorValorBoleto;
                    }
                }

                return produtos;
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

<style>
    .card-produto {
        min-width: 200px;
        max-width: 255px;
    }

    @media screen and (min-width: 768px) and (max-width: 1199px) {
        .card-produto {
            max-width: 210px;
        }
    }

    @media screen and (min-width: 576px) and (max-width: 767px) {
        .card-produto {
            max-width: 240px;
        }
    }

    @media screen and (max-width: 576px) {
        .card-produto {
            max-width: 100%;
        }
    }

    @media screen and (min-width: 992px) and (max-width: 1199px) {
        #filtrar {
            margin-top: 92px;
        }
    }
</style>