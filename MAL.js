const fetch = require('node-fetch');
const crypto = require("crypto");

export function malClient(CLIENT_ID, CLIENT_SECRET, state) {
    this.CLIENT_ID = CLIENT_ID;
    this.CLIENT_SECRET = CLIENT_SECRET;
    this.state = state
    this.code_challenge

    this.redirectURI = () => {
        this.code_challenge = crypto.randomBytes(64).toString('hex');

        let uri = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${this.CLIENT_ID}&code_challenge=${this.code_challenge}`
        if (mal.state) { uri += `&state=${encodeURIComponent(mal.state)}` };

        return { uri, code_challenge: this.code_challenge }
    }

    this.exchangeToken = (code) => {
        return new Promise((resolve, reject) => {
            const data = `client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}&code=${encodeURIComponent(code)}&code_verifier=${this.code_challenge}&grant_type=authorization_code`;

            fetch("https://myanimelist.net/v1/oauth2/token", {
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: data
            })
                .then(exc => exc.json())
                .then(exchangeCode => {
                    if (exchangeCode.token_type && exchangeCode.access_token && exchangeCode.refresh_token) {
                        resolve(exchangeCode)
                    } else (reject(exchangeCode))
                })
                .catch(reject)
        })
    };

    this.getMe = (access_token) => {
        return new Promise((resolve, reject) => {
            fetch('https://api.myanimelist.net/v2/users/@me', { method: "GET", headers: { "Authorization": `Bearer ${access_token}` } })
                .then(exc => exc.json())
                .then(userData => {
                    resolve(userData)
                })
                .catch(reject)
        })
    }
}