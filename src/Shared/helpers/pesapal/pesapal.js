const axios = require("axios");
const { pesapalCredentialsModel } = require("../../../Models/pesapalCredentials");

let tokenCache = {
    token: null,
    expiresAt: 0,
};

async function getPesapalToken() {
    const now = Date.now();
    if (tokenCache.token && tokenCache.expiresAt > now) {
        return tokenCache.token;
    }

    const response = await axios.post(process.env.PESAPAL_AUTH_URL, {
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    });

    const { token } = response.data;
    tokenCache.token = token;
    tokenCache.expiresAt = now + 270 * 1000;
    return token;
}

async function checkIPnNURL(token) {
    const checkIPNUrl = process.env.PESAPAL_URL + "/URLSetup/GetIpnList";
    const myIPNUrl = process.env.PESAPAL_IPN_URL;

    const response = await axios.get(checkIPNUrl, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    const ipnList = response.data;

    if (!ipnList || ipnList.length === 0) {
        return registerAndSaveIPN(token);
    }

    const existing = ipnList.find(i => i.url === myIPNUrl);
    if (!existing) {
        return registerAndSaveIPN(token);
    }

    await saveIPNToDB(existing.ipn_id);
}

async function registerAndSaveIPN(token) {
    const url = process.env.PESAPAL_URL + "/URLSetup/RegisterIPN";
    const response = await axios.post(
        url,
        { url: process.env.PESAPAL_IPN_URL, ipn_notification_type: "POST" },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    await saveIPNToDB(response.data.ipn_id);
}

async function saveIPNToDB(ipnId) {
    let record = await pesapalCredentialsModel.findOne();
    if (!record) {
        record = new pesapalCredentialsModel();
    }
    record.ipnId = ipnId;
    await record.save();
}

module.exports = { getPesapalToken, checkIPnNURL };
