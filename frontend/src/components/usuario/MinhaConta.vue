<template>
    <div class="card">
        <b-overlay spinner-variant="success" :show="loadingAlertas" rounded="sm">
            <div class="card-body">
                <section class="user-data">
                    <div class="sidebar card text-center">
                        <img class="avatar img-fluid" :src="avatar" alt="imagem de perfil">
                        <a href="#" @click="edit()">Editar perfil</a>
                    </div>
                    <!-- Div de abas com dados da conta do usuário (perfil, something e alertas) -->
                    <div class="user-tabs">
                        <b-card no-body>
                            <b-card-title>
                                <h1 style="margin-left: 10px" v-if="user">E aí, {{nick}}!</h1>
                            </b-card-title>

                            <div style="padding: 10px;">
                                <div v-if="listaAlertas.length > 0" class="alert alert-warning" role="alert">
                                    <div>
                                        <h5 class="text-center">O(s) seguinte(s) alerta(s) de preço foram atingidos:</h5>
                                        <div style="display: flex; flex-direction: row; justify-content: center;">
                                            <table>
                                                <thead>
                                                    <tr v-for="a in listaAlertas" :key="a.id" :value="a.id">
                                                        <th id="notificacao-produto" @click="goProduto(a.productId)">{{a.nomeProduto}}</th>
                                                        <th>{{a.alertaValor | reais}}</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <b-tabs v-model="tabIndex" fill>
                                <b-tab title="Perfil" :title-link-class="linkClass(0)">
                                    <form @submit.prevent="salvar" class="form-minha-conta" id="form-perfil">
                                        <div class="form-group">
                                            <label for="inputNome">Nickname</label>
                                            <input class="form-control" placeholder="Nome" type="text" id='inputNome' v-model='nickEdit' required disabled>
                                        </div>

                                        <div class="form-group">
                                            <label for="inputEmail">Email</label>
                                            <input class="form-control" placeholder="Email" v-model="email" type="email" id='inputEmail' required disabled>
                                        </div>

                                        <!-- <div class="form-group">
                                            <label for="inputAvatar">Avatar</label>
                                            <input class="form-control" placeholder="Avatar" v-model="avatar" type="text" id='inputAvatar' required disabled>
                                        </div> -->

                                        <div class="form-group">
                                            <label for="inputAvatar">Avatar</label>
                                            <b-form-file
                                                id="inputAvatar"
                                                v-model="inputAvatar"
                                                placeholder="Faça o upload de uma imagem..."
                                                accept=".jpg, .png, .gif"
                                                browse-text="Upload"
                                                no-drop
                                                disabled
                                            ></b-form-file>
                                        </div>

                                        <!-- <div class="form-group">
                                            <label for="inputNiver">Aniversário</label>
                                            <input class="form-control" placeholder="Aniversário" v-model="niver" type="date" id='inputNiver'>
                                        </div> -->
                                        
                                        <!-- <div class="form-group">
                                            <label for="inputAvatar">Avatar</label>
                                            <input class="form-control" placeholder="Avatar" v-model="avatar" type="image" id='inputAvatar'>
                                        </div> -->

                                        <div v-if="isEditando" class="form-group">
                                            <button type="submit" class="btn btn-lg btn-success btn-block">Salvar</button>
                                            <a href="#"><div style="text-align: center; color: red" @click="disableEdit">Cancelar</div></a>
                                        </div>

                                    </form>

                                    <div v-if="isEditando" class="form-group">
                                        <button class="btn btn-lg btn-danger btn-block" @click="deleteUser()">Apagar conta</button>
                                    </div>

                                    <!-- Modal confirmação edição perfil -->
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

                                    <!-- Modal confirmação exclusão perfil -->
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
                                                        <p>Press F to Pay Respects (F para excluir sua conta)</p>
                                                    </div>
                                                    
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-success" data-dismiss="modal" @click='cancelaDeleteUser()'>CANCELAR</button>
                                                        <button type="button" class="btn btn-danger" data-dismiss="modal" @click='confirmaDeleteUser()'>F</button>
                                                    </div>
                                                </b-overlay>
                                            </div>
                                        </div>
                                    </div>
                                </b-tab>
                                
                                <b-tab title="Favoritos" :title-link-class="linkClass(1)">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Produto</th>
                                                <th style="color: #FFF">_____Ações_____</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr v-for="f in favoritos" :key='f.id' :value="f.id">
                                                <th>{{f.nomeProduto}}</th>
                                                <td class="text-center">
                                                    <button class="btn btn-danger" v-b-tooltip.hover title="Excluir" @click="confirmaDeleteFavorito(f.id)"><b-icon icon="trash"></b-icon></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </b-tab>
                                
                                <b-tab title="Alertas" :title-link-class="linkClass(2)">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Produto</th>
                                                <th>Alerta</th>
                                                <th>Preço atual</th>
                                                <th style="color: #FFF">_____Ações_____</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr v-for="a in alertas" :key='a.id' :value="a.id">
                                                <th @click="goProduto(a.productId)">{{a.nomeProduto}}</th>
                                                <th>{{a.alerta | reais}}</th>
                                                <th>{{a.precoAtual | reais}}</th>
                                                <td class="text-center">
                                                    <button class="btn btn-secondary" v-b-tooltip.hover title="Editar" @click="editarAlerta(a)" style="margin-right: 10px;"><b-icon icon="pencil"></b-icon></button> 
                                                    <button class="btn btn-danger" v-b-tooltip.hover title="Excluir" @click="deleteAlerta(a.id)"><b-icon icon="trash"></b-icon></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Modal edicao alerta -->
                                    <div class="modal fade" id="ModalEdit" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered" role="document">
                                            <div class="modal-content">
                                                <b-overlay spinner-variant="success" :show="status == 'Processando...'" rounded="sm">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="ModalLabel">Editar alerta</h5>
                                                        <!-- <h5 v-if="status != 'Processando...'" class="modal-title" id="ModalLabel">{{status}}</h5> -->

                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>

                                                    <div class="modal-body">
                                                        <div class="modal-body modal-edit-alerta">
                                                        <form @submit.prevent="confirmaEditarAlerta">
                                                            <div class="input-group mb-2">
                                                                <div class="input-group-prepend">
                                                                    <span class="input-group-text">R$</span>
                                                                </div>
                                                                <input class="form-control text-right" style="padding-right: 15px;" type="number" v-if="alerta" v-model="alerta.alerta" :placeholder="alerta.alerta" required autocomplete="off" min="0" step="10.00" data-number-to-fixed="2" data-number-stepfactor="100">
                                                            </div>
                                                        </form>
                                                    </div>
                                                    </div>
                                                    
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-danger" data-dismiss="modal">Não</button>
                                                        <button type="submit" class="btn btn-success" data-dismiss="modal" @click='confirmaEditarAlerta()'>Sim</button>
                                                    </div>
                                                </b-overlay>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Modal exclusao favorito -->
                                    <!-- <div class="modal fade" id="ModalDelFavorito" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="ModalLabel">Excluir favorito</h5>

                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>

                                                <div class="modal-body text-center">
                                                    <p class="text-center">Deseja realmente excluir este favorito?</p>
                                                </div>
                                                
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-success" data-dismiss="modal" @click='cancelaDeleteFavorito()'>Não</button>
                                                    <button type="submit" class="btn btn-danger" data-dismiss="modal" @click='confirmaDeleteFavorito()'>Sim</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div> -->

                                    <!-- Modal exclusao alerta -->
                                    <div class="modal fade" id="ModalDelAlerta" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="ModalLabel">Excluir alerta</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body text-center">
                                                    <p class="text-center">Deseja realmente excluir este alerta?</p>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-success" data-dismiss="modal">Não</button>
                                                    <button type="submit" class="btn btn-danger" data-dismiss="modal" @click='confirmaDeleteAlerta()'>Sim</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Modal notificacao alerta -->
                                    <!-- <div class="modal fade" id="ModalNotificacaoAlerta" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="ModalLabel">Alerta de preço!</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body text-center">
                                                    <p class="text-center">O(s) seguinte(s) alerta(s) de preço foram atingidos:</p>
                                                    <div>
                                                        <table>
                                                            <thead>
                                                                <tr v-for="a in listaAlertas" :key="a.id" :value="a.id">
                                                                    <th>{{a.alertaValor}}</th>
                                                                    <th>{{a.nomeProduto}}</th>
                                                                </tr>
                                                            </thead>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> -->
                                </b-tab>
                            </b-tabs>
                        </b-card>
                    </div>
                </section>
            </div>
        </b-overlay>
    </div>
</template>

<script>
    import firebase from '@/firebase'
    
    // eslint-disable-next-line no-undef
    // import EdicaoPerfil from '../../components/usuario/EdicaoPerfil.vue'

    export default {
        data() {
            return {
                user: null,
                nick: '',
                nickEdit: '',
                email: '',
                niver: '',
                avatar: '',
                inputAvatar: null,
                status: '',
                tabIndex: 0,
                isEditando: false,
                alertas: [],
                alerta: {},
                alertaId: '',
                favoritos: [],
                favoritoId: '',
                nomeProdutoAlerta: '',
                valorAlerta: '',
                listaAlertas: [],
                loadingAlertas: true
            }
        },

        created: function () {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    this.user = user;
                } else {
                    this.user = null;
                }
                this.getUsuario();
            });

            this.getFavoritos()
            this.getAlertas()
                .then(() => {
                    if(this.loadingAlertas == false && this.listaAlertas.length > 0) {
                        //console.log('entrou no if');
                        //showModalNotificacao();
                    }
                })

        },

        mounted() {
            // eslint-disable-next-line no-undef
            $("#Modal").on('hidden.bs.modal', this.limpa);

            // eslint-disable-next-line no-undef
            $("#ModalDel").on('hidden.bs.modal', this.cancelaDeleteUser);
        },

        methods: {
            getNick: function() {
                this.nick = firebase.auth().currentUser.displayName;
            },

            linkClass(idx) {
                if (this.tabIndex === idx) {
                    return ['bg-success', 'text-white']
                } else {
                    return ['bg-light', 'text-secondary ']
                }
            },

            getUsuario: function() {
                const currentUser = firebase.auth().currentUser;
                this.nick = currentUser.displayName;
                this.nickEdit = this.nick;
                this.email = currentUser.email;
                this.avatar = currentUser.photoURL;
            },

            salvar: async function() {
                this.status = 'Processando...';
                let storage = firebase.storage();

                // eslint-disable-next-line no-undef
                $('#Modal').modal();
                
                let nickEdit = this.nickEdit;
                let email = this.email;
                let status = this.status;
                let isEditando = this.isEditando;
                let getUsuario = this.getUsuario;
                const currentUser = firebase.auth().currentUser;

                if (this.inputAvatar) {
                    let storageRef = storage.ref('usuarios/' + currentUser.uid + '.jpg');
                    let task = storageRef.put(this.inputAvatar);
    
                    task.on('state_changed',
    
                        function progress(){
    
                        },
                        function error() {
    
                        },
                        function complete(){
                            storageRef.getDownloadURL()
                                .then(function(imageURL) {currentUser.updateProfile({
                                        displayName: nickEdit,
                                        email: email,
                                        photoURL: imageURL
                                    }).then(() => {
                                        // Update successful.
                                        status = 'Dados atualizados com sucesso.';
                                        isEditando = false;
                                        getUsuario();
                                    }).catch((error) => {
                                        // An error happened.
                                        status = 'Falha ao atualizar dados. ' + error.message;
                                        isEditando = false;
                                        getUsuario();
                                    })
                                })
                        }
                    )
                } else {
                    currentUser.updateProfile({
                        displayName: nickEdit,
                        email: email,
                    }).then(() => {
                        // Update successful.
                        status = 'Dados atualizados com sucesso.';
                        isEditando = false;
                        getUsuario();
                    }).catch((error) => {
                        // An error happened.
                        status = 'Falha ao atualizar dados. ' + error.message;
                        isEditando = false;
                        getUsuario();
                    })
                }

                let interval = setInterval(() => {
                    if (isEditando == false) {
                        this.status = status;
                        this.isEditando = isEditando;
                        clearInterval(interval);
                    }
                }, 500);
            },

            limpa: function() {
                if (this.status == 'Dados atualizados com sucesso.') {
                    this.status = '';
                    this.isEditando = false;
                    // eslint-disable-next-line no-undef
                    $('#form-perfil :input').prop("disabled", true);
                }
            },

            edit: function() {
                if (!this.isEditando) {
                    this.isEditando = true;
                    // eslint-disable-next-line no-undef
                    $('#form-perfil :input').prop("disabled", false);
                } else {
                    this.isEditando = false;
                    // eslint-disable-next-line no-undef
                    $('#form-perfil :input').prop("disabled", true);
                }
            },

            disableEdit: function() {
                this.isEditando = false;
                // eslint-disable-next-line no-undef
                $('#form-perfil :input').prop("disabled", true);
            },

            deleteUser: function() {
                this.status = 'Tem certeza que deseja excluir sua conta?';

                // eslint-disable-next-line no-undef
                $('#ModalDel').modal();
            },
            
            confirmaDeleteUser: function() {
                this.status = 'Processando...';

                const user = firebase.auth().currentUser;
                let proms = [];

                proms.push(
                    user.delete().then(function() {
                        
                    }).catch(function(error) {
                        console.log(error.message);
                        this.status = error.message;
                    })
                )

                Promise.all(proms)
                    .then(() => {
                        this.$router.push({name: 'login'});
                    })
            },

            cancelaDeleteUser: function() {
                this.status = '';
            },

            getAlertas: async function() {
                const db = firebase.firestore();
                const currentUser = firebase.auth().currentUser;
                let pushAlertas = (alertaObj) => {this.alertas.push(alertaObj)}
                let pushValorAlertas = (alertaValorObj) => {this.listaAlertas.push(alertaValorObj)}
                this.alertas = [];
                this.listaAlertas = [];

                await db.collection('alertas').where('userUid', '==', currentUser.uid).get()
                    .then(async function(alertasSnap) {
                        for (let a of alertasSnap.docs) {
                            let alerta = a.data().valor;
                            let userUid = a.data().userUid;
                            let productId = a.data().productId;
                            let alertaId = a.id;

                            if (userUid == currentUser.uid) {
                                let nomeProduto = "";
                                let precoAtual = 0;

                                await db.doc(`produtos/${productId}`).get()
                                    .then(async function (doc) {
                                        nomeProduto = doc.data().nome;

                                        await db.collection('ofertas').where('produto', '==', productId).get()
                                            .then((docOferta) => {
                                                let menorPreco = '';

                                                for (let o of docOferta.docs) {
                                                    precoAtual = o.data().valorBoleto;
                                                    
                                                    if (precoAtual < menorPreco || typeof menorPreco == 'string') {
                                                        menorPreco = precoAtual;
                                                    }
                                                }
                                                
                                                let alertaObj = {
                                                    nomeProduto: nomeProduto,
                                                    precoAtual: menorPreco,
                                                    alerta: alerta,
                                                    productId: productId,
                                                    id: alertaId
                                                };

                                                pushAlertas(alertaObj);

                                                let alertaValor = alerta;
                                                let alertaValorObj = {
                                                    alertaValor: alertaValor,
                                                    nomeProduto: nomeProduto,
                                                    productId: productId
                                                };

                                                if(menorPreco <= alertaValor) {
                                                    pushValorAlertas(alertaValorObj);
                                                }
                                            })
                                    })
                            }
                        }
                    }, (err) => {
                        console.log('Falha ao buscar alerta: ', err.message)
                    })
                    .catch((err) => {
                        console.log('Falha ao buscar alerta: ', err.message)
                    })
                    
                    this.loadingAlertas = false;
            },

            editarAlerta: function(alerta) {
                this.alerta = alerta;
                this.alertaId = alerta.id;
                
                // eslint-disable-next-line no-undef
                $('#ModalEdit').modal();
            },

            confirmaEditarAlerta: function() {
                const id = this.alertaId;
                const alerta = this.alerta.alerta;
                const db = firebase.firestore();

                db.doc(`alertas/${id}`).update({valor: alerta}).then(() => {
                    this.getAlertas();
                    // eslint-disable-next-line no-undef
                    $('#ModalEdit').modal('hide');
                }).catch((error) => {
                    console.error("Erro ao editar alerta! ", error);
                });
            },

            deleteAlerta: function(alertaId) {
                this.alertaId = alertaId;

                // eslint-disable-next-line no-undef
                $('#ModalDelAlerta').modal();
            },

            confirmaDeleteAlerta: function() {
                const id = this.alertaId;
                const db = firebase.firestore();

                db.doc(`alertas/${id}`).delete().then(() => {
                    this.getAlertas();
                    // eslint-disable-next-line no-undef
                    $('#ModalDelAlerta .close').click();
                }).catch((error) => {
                    console.error("Erro ao excluir alerta! ", error);
                });
            },

            getFavoritos: async function() {
                const db = firebase.firestore();
                const currentUser = firebase.auth().currentUser;
                let pushFavoritos = (favoritoObj) => {this.favoritos.push(favoritoObj)}
                this.favoritos = [];

                await db.collection('favoritos').where('userUid', '==', currentUser.uid).get()
                    .then(async function(favoritosSnap) {
                        for (let f of favoritosSnap.docs) {
                            let productId = f.data().productId;
                            let favoritoId = f.id;
                            let nomeProduto = '';

                            await db.doc(`produtos/${productId}`).get()
                                .then((doc) => {
                                    nomeProduto = doc.data().nome;
                                })
                            
                            let favoritoObj = {
                                nomeProduto: nomeProduto,
                                id: favoritoId
                            };

                            pushFavoritos(favoritoObj);
                            
                        }
                    }, (err) => {
                        console.log('Falha ao buscar alerta: ', err.message)
                    })
                    .catch((err) => {
                        console.log('Falha ao buscar alerta: ', err.message)
                    })   
            },

            confirmaDeleteFavorito: function(favoritoId) {
                this.favoritoId = favoritoId;
                const id = this.favoritoId;
                const db = firebase.firestore();

                db.doc(`favoritos/${id}`).delete().then(() => {
                    this.getFavoritos();
                }).catch((error) => {
                    console.error("Erro ao excluir favorito! ", error);
                });
            },
            showModalNotificacao: function() {
                console.log('entrou');
                // eslint-disable-next-line no-undef
                $('#ModalNotificacaoAlerta').modal();
            },

            goProduto: function(productId) {
                const id = productId;
                this.$router.push({
                    name: 'produto',
                    params: {
                        id: id
                    }
                });
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