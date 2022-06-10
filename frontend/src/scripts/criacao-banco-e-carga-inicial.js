import firebase from '@/firebase'; 


const db = firebase.firestore(); 
 
// coleção lojas 
db.collection('lojas').add({nome: “Terabyte”}) 
                      .then(() => { 
                          console.log('Loja cadastrada com sucesso.'); 
                      }).catch((err) => { 
                          console.log(err.message); 
                      }) 


// coleção produtos 
db.collection('produtos').add({nome:”Gabinete Gamer Galax Quasar RGB, Mid Tower, Vidro Temperado, Black, Sem Fonte, Sem Fan, GX600”}) 
                         .then((docRef) => { 
                            console.log('Produto cadastrado com sucesso.'); 
                         }).catch((err) => { 
                            console.log(err.message); 
                         }) 

// coleção ofertas 
let objOfertas = { 
  loja:”Terabyte”, 
  categoria:”Gabinete”, 
  produto:”Gabinete Gamer Galax Quasar RGB, Mid Tower, Vidro Temperado, Black, Sem Fonte, Sem Fan, GX600”, 
  url:”https://www.terabyteshop.com.br/produto/13933/gabinete-gamer-galax-quasar-rgb-mid-tower-vidro-temperado-s-fan-black-s-fonte-gx600” 
} 

db.collection('ofertas').add(objOfertas) 
                        .then(() => { 
                           console.log('Oferta cadastrada com sucesso.'); 
                        }).catch((err) => { 
                           console.log(err.message); 
                        }) 
