const { GoogleAuth } = require("google-auth-library")
const path = require("path")

const { GOOGLE_APPLICATION_CREDENTIALS } = require("../config/env")

const auth = new GoogleAuth({
  keyFile: GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
})

const getAccessToken = async () => {
  const client = await auth.getClient()
  const accessToken = await client.getAccessToken()
  return accessToken
}

module.exports = { getAccessToken }
