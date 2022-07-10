import http from "k6/http";
import { check, sleep } from "k6";

// Configurações API K6
const API_URL = "https://gorest.co.in/public-api";
const API_TOKEN = "2265725b6084f455bb578df78606a68cd24ebf8ead5d25e811bd9638c4371b91";

// Configurações dos testes
export let options = {
    vus: 10,
    duration: '30s'
};

// Cenário de testes
export default function () {

    // Parâmetros comuns à diversas requisições
    const params = { headers: { "Authorization": `Bearer ${API_TOKEN}` } };

    // Geração de sufixo de e-mail aleatório
    let randomInt = Math.floor(Math.random() * 1000000);

    // Geração de id aleatório
    function randomId(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    //////////////////////////////////////////////////////////////////////

    /*
    * Funcionalidades testadas:
    * . Serviço 1 [ESCRITA]: Criar conta (objetivo: permitir o cadastro de usuários no sistema)
    * . Serviço 2 [LEITURA]: Exibir conta (objetivo: permitir o usuário consultar dados da sua conta no sistema)
    */

    //////////////////////////////////////////////////////////////////////

    // Serviço 1 [ESCRITA]: Criar conta
    let createUserResponse = http.post(
        `${API_URL}/users`,
        {
            "nick": "Usuário Teste",
            "email": `usuario.teste+${randomInt}@mail.com`,
            "senha": "password",
            "senhaCheck": "password",
            "uid": `${randomId(28)}`
        },
        params
    );
    check(
        createUserResponse,
        { "Criar Conta: Status code 200 retornado": (r) => r.status == 200 }
    );

    //////////////////////////////////////////////////////////////////////

    // Serviço 2 [LEITURA]: Exibir conta 
    let getUserResponse = http.get(
        `${API_URL}/users/${JSON.parse(createUserResponse.body).data.id}`,
        params
    )
    check(
        getUserResponse,
        { "Exibir Conta: Status code 200 retornado": (r) => r.status == 200 }
    );

    //////////////////////////////////////////////////////////////////////

    // Pausa entre operações
    sleep(0.5);

}