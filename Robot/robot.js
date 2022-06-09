async function getValores(url) {
    let browser = null;

    if (url.includes('.terabyteshop.')) {
        browser = await puppeteer.launch({headless: false});
    } else {
        browser = await puppeteer.launch();
    }
    
    const page = await browser.newPage();
    
    await page.goto(url);

    // Get the "viewport" of the page, as reported by the page.
    let valores;    
    let before = dayjs();

    do {
        valores = await page.evaluate((url) => {
            if (url.includes('.terabyteshop.')) {
                try {
                    return {
                        valorCartao: document.querySelector("#valParc").innerText,
                        valorBoleto: document.querySelector("#valVista").innerText
                    }
                } catch {
                    return
                }
            } else if (url.includes('.kabum.')) {
                try {
                    return {
                        valorCartao: document.querySelector("#pag-detalhes > div > div.boxs > div.box_comprar-cm > div.content > div.box_preco-cm > div.preco_desconto-cm > span > strong").innerText,
                        valorBoleto: document.querySelector("#pag-detalhes > div > div.boxs > div.box_comprar-cm > div.content > div.box_preco-cm > div.preco_normal-cm > span:nth-child(1) > span").innerText
                    }
                } catch {
                    try {
                        return {
                            valorCartao: document.querySelector("#pag-detalhes > div.boxs > div.box_comprar > div.box_preco > div.preco_traco > div.preco_normal").innerText,
                            valorBoleto: document.querySelector("#pag-detalhes > div.boxs > div.box_comprar > div.box_preco > div.preco_traco > span > span > span > strong").innerText
                        }
                    } catch {
                        return
                    }
                }
            } else if (url.includes('.pichau.')) {
                try {
                    return {
                        valorCartao: document.querySelector("#maincontent > div.columns > div > div.product-info-main > div.product-info-price > div.price-box.price-final_price > span.price-container.price-final_price.tax > span.price-wrapper > span").innerText,
                        valorBoleto: document.querySelector("#maincontent > div.columns > div > div.product-info-main > div.product-info-price > div.price-box.price-final_price > span.price-boleto > span").innerText
                    }
                } catch {
                    try {
                        return {
                            valorCartao: document.querySelector("#maincontent > div.columns > div > div.product-info-main > div.product-info-price > div.price-box.price-final_price > span.special-price > span.price-container.price-final_price.tax > span.price-wrapper > span").innerText,
                            valorBoleto: document.querySelector("#maincontent > div.columns > div > div.product-info-main > div.product-info-price > div.price-box.price-final_price > span.special-price > span.price-boleto > span").innerText
                        }
                    } catch {
                        return
                    }
                }
            } else if (url.includes('.eletromalu.')) {
                try {
                    return {
                        valorCartao: document.querySelector("#form-add-cart > div.product-values.mb-5 > div.product-action-price.creditcard.my-5 > div > div:nth-child(2) > div > div > span.total").innerText,
                        valorBoleto: document.querySelector("#form-add-cart > div.product-values.mb-5 > div.product-action-price.creditcard.my-5 > div > div:nth-child(1) > div > div > span.total").innerText
                    }
                } catch {
                    return
                }
            } else if (url.includes('.combatinfo.')) {
                try {
                    return {
                        valorCartao: document.querySelector("#product > div > div.col-lg-8 > div:nth-child(8) > div.media-body > h4 > strong").innerText,
                        valorBoleto: document.querySelector("#product > div > div.col-lg-8 > div:nth-child(6) > div.media-body > h4 > strong").innerText
                    }
                } catch {
                    return
                }
            }
        }, url)
        
        if (!valores || !valores.valorCartao || !valores.valorBoleto || valores.valorCartao == '' || valores.valorBoleto == '' || typeof valores.valorCartao != 'string' || typeof valores.valorBoleto != 'string') {
            indisponivel = await page.evaluate((url) => {
                if (url.includes('.terabyteshop.')) {
                    try {
                        return document.querySelector("#indisponivel > h2") ? true : false
                    } catch {
                        return false
                    }
                } else if (url.includes('.kabum.')) {
                    try {
                        return document.querySelector("#pag-detalhes > div.boxs > div.box_comprar > div.box_topo > div.disponibilidade > table > tbody > tr > td:nth-child(1) > a > img") ? true : false
                    } catch {
                        return false
                    }
                } else if (url.includes('.pichau.')) {
                    try {
                        return document.querySelector("#maincontent > div.columns > div > div.product-info-main > div.product-info-price > div.product-info-stock-sku > div.stock.unavailable > span").innerText == 'PRODUTO INDISPONÍVEL' ? true : false
                    } catch {
                        return false
                    }
                } else if (url.includes('.eletromalu.')) {
                    try {
                        return document.querySelector("body > div.wrapper > main > div > div.product-info.pb-5 > div > div > div.col-12.col-md-5 > div > div.product-action.mt-4.position-relative > div > div.product-request-info.p-3.text-center").innerText == 'Infelizmente o estoque deste item acabou :(' ? true : false
                    } catch {
                        return false
                    }
                } else if (url.includes('.combatinfo.')) {
                    try {
                        return document.querySelector("#product > div > div.col-lg-8 > a").innerText.includes('Fora de estoque') ? true : false
                    } catch {
                        return false
                    }
                }
            }, url)
        }
    } while (dayjs().diff(before) < 30000 && (!valores || !valores.valorCartao || !valores.valorBoleto || valores.valorCartao == '' || valores.valorBoleto == '' || typeof valores.valorCartao != 'string' || typeof valores.valorBoleto != 'string') && !indisponivel);
    
    if (valores && valores.valorCartao && valores.valorBoleto && valores.valorCartao != '' && valores.valorBoleto != '' && typeof valores.valorCartao == 'string' && typeof valores.valorBoleto == 'string') {
        valores.valorCartao = parseFloat(valores.valorCartao.substring(valores.valorCartao.indexOf('R$') + 2).replace('.', '').replace(',', '.').trim());
        valores.valorBoleto = parseFloat(valores.valorBoleto.substring(valores.valorBoleto.indexOf('R$') + 2).replace('.', '').replace(',', '.').trim());
        console.log(`Valores encontrados em ${url.split('.')[1]}: `, valores);
    } else {
        console.log(`Valores não encontrados em ${url}`);
        valores = {}
        valores.valorCartao = 'Indisponível'
        valores.valorBoleto = 'Indisponível'
    }
    
    await browser.close();

    return valores
}

async function updateProduto(idProduto) {
    const ofertasSnap = await db.collection('ofertas').where('produto', '==', idProduto).get();
    const valoresProm = [];
    const ids = [];

    for (const oferta of ofertasSnap.docs) {
        idOferta = oferta.id;
        data = oferta.data()
        console.log(`Acessando ${data.url.split('.')[1]}`)
        valoresProm.push(getValores(data.url));
        ids.push(idOferta);
    }

    try {
        const valoresOfertas = await Promise.all(valoresProm)
        let menorPreco = 0;
    
        for (let idx = 0; idx < valoresOfertas.length; idx++) {
            const valores = valoresOfertas[idx];
    
            if (valores) {
                db.doc(`ofertas/${ids[idx]}`).update({
                    "valorBoleto": valores.valorBoleto,
                    "valorCartao": valores.valorCartao
                })
            }
    
            if (idx == 0) {
                menorPreco = valores.valorBoleto;
            } else if (valores.valorBoleto < menorPreco && valores.valorBoleto != 'Indisponível' || menorPreco == 'Indisponível') {
                menorPreco = valores.valorBoleto;
            }
        }
        
        console.log('Menor preço: ', menorPreco);
        console.log("Atualizando histórico de preço");
    
        await db.collection(`produtos/${idProduto}/historico`).where('date', '==', dayjs().format('DD/MM/YYYY')).get()
            .then(async function(historicoSnap) {
                const objHistorico = {
                    date: dayjs().format('DD/MM/YYYY'),
                    preco: menorPreco
                }
    
                let hojeTemPreco = historicoSnap.size > 0;
    
                if (hojeTemPreco) {
                    let historicoId = '';
    
                    for (let h of historicoSnap.docs) {
                        historicoId = h.id;
                    }
    
                    await db.doc(`produtos/${idProduto}/historico/${historicoId}`).update(objHistorico)
                        .then(() => {
                            console.log('Histórico atualizado com sucesso.');
                        })
                } else {
                    await db.collection(`produtos/${idProduto}/historico`).add(objHistorico)
                        .then(() => {
                            console.log('Histórico criado com sucesso.');
                        })
                }
            })
    } catch(err) {
        console.log(err.message)
    }
}

// Atualiza preço dos produtos cadastrados
async function updateTodosProdutos() {
    const produtosSnap = await db.collection('produtos').get()

    for (const produto of produtosSnap.docs) {
        console.log(`Coletando valores de: ${produto.data().nome}`)
        await updateProduto(produto.id)
    };
}

const firebaseConfig = {
    apiKey: "AIzaSyDK7qt-LcD0WlGtqOWKcsbDUzQXmcqVheE",
    authDomain: "hora-do-up.firebaseapp.com",
    projectId: "hora-do-up",
    storageBucket: "hora-do-up.appspot.com",
    messagingSenderId: "682215444060",
    appId: "1:682215444060:web:9ea1bb1c7c681e64376099",
    measurementId: "G-QCCVJ8G2C3"
  };

const dayjs = require('dayjs');

const firebase = require("firebase");
require("firebase/firestore");
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const puppeteer = require('puppeteer');

updateTodosProdutos()