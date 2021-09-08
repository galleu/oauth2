const fetch = require("node-fetch")

// REDIRECT_URI Also needs to be set in discord developers > Your App > OAuth2 > Redirects   
config = {
    API_ENDPOINT: "https://discord.com/api/v8",
    CLIENT_ID: "",     // e.g. 123456789101112131
    CLIENT_SECRET: "", // e.g. pxS3D8EB6M9zWBUNFpJmge9NcBX95bDK
    REDIRECT_URI: ""   // http://127.0.0.1:5000/discord/login
}


exports.exchangeCode = (code, state) => {
    return new Promise((resolve, reject) => {
        let data = `client_id=${config.CLIENT_ID}&client_secret=${config.CLIENT_SECRET}&grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(config.REDIRECT_URI)}`
        if (slate) { data += `&state=${encodeURIComponent(state)}` }

        fetch(config.API_ENDPOINT + '/oauth2/token', {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data
        })
            .then(r => r.json())
            .then(accessData => {
                if (accessData.access_token) { resolve(accessData)
                } else reject(accessData);
            })
            .catch(reject)
    })
}


exports.getUserData = (access_token) => {
    return new Promise((resolve, reject) => {
        fetch(config.API_ENDPOINT + "/users/@me", {
            method: "GET",
            headers: { 'Authorization': `Bearer ${access_token}` }
        })
            .then(r => r.json())
            .then(user => {
                if (user.id) { resolve(user)
                } else reject(user)
            })
            .catch(reject);
    })
}

exports.refreshToken = (refreshToken) => {
    let data = `client_id=${config.CLIENT_ID}&client_secret=${config.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}&redirect_uri=${encodeURIComponent(config.REDIRECT_URI)}`
    fetch(config.API_ENDPOINT + '/oauth2/token', {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
    })
        .then(r => r.json())
        .then(accessData => {
            if (accessData.access_token) { resolve(accessData)
            } else reject(accessData);
        })
        .catch(reject)
}