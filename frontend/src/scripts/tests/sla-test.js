import http from "k6/http";
import { check, sleep } from "k6";

// Common things
const API_URL = "https://gorest.co.in/public-api";
const API_TOKEN = "2265725b6084f455bb578df78606a68cd24ebf8ead5d25e811bd9638c4371b91";

// Test setup
export let options = {
    vus: 10,
    duration: '30s'
};

// Test scenario
export default function () {

    // Common requests params
    const params = { headers: { "Authorization": `Bearer ${API_TOKEN}` } };

    // Random e-mail suffix
    let randomInt = Math.floor(Math.random() * 1000000);

    // Create user
    let createUserResponse = http.post(
        `${API_URL}/users`,
        {
            "name": "John Doe",
            "gender": "Male",
            "email": `john.doe+${randomInt}@tsh.io`,
            "status": "Active"
        },
        params
    );
    check(
        createUserResponse,
        { "Create user response status code is 200": (r) => r.status == 200 }
    );

    // Get user 
    let getUserResponse = http.get(
        `${API_URL}/users/${JSON.parse(createUserResponse.body).data.id}`,
        params
    )
    check(
        getUserResponse,
        { "Get user response status code is 200": (r) => r.status == 200 }
    );

    // Update user data
    let patchUserResponse = http.patch(
        `${API_URL}/users/${JSON.parse(createUserResponse.body).data.id}`,
        {
            "gender": "Female"
        },
        params
    )
    check(
        patchUserResponse,
        { "Update user response status code is 200": (r) => r.status == 200 }
    );

    // Delete user
    let deleteUserResponse = http.del(
        `${API_URL}/users/${JSON.parse(createUserResponse.body).data.id}`,
        params
    )
    check(
        deleteUserResponse,
        { "Delete user response status code is 200": (r) => r.status == 200 }
    );

    // Short break between iterations
    sleep(0.5);
}