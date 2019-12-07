const axios = require('axios')
const querystring = require('querystring')

const mailchimpAPI = process.env.MAILCHIMP_API_KEY
const mailchimpListID = process.env.MAILCHIMP_LIST_ID
const mcRegion = process.env.MAILCHIMP_REGION

exports.handler = async (event, context, callback) => {
  // Pull down form data
  const formData = querystring.parse(event.body)

  // Check email and name
  if (!formData.email || !formData.firstName) {
    return { statusCode: 400, body: 'First name or email are required.' }
  }

  // Retrieve name and email
  const email = formData.email
  const firstName = formData.firstName

  // Build data payload
  const data = {
    "email_address": email,
    "status": "subscribed",
    "merge_fields": {
      "FNAME": firstName
    }
  }

  // Stringify & output to console
  const subscriber = JSON.stringify(data)
  console.log("Sending data to mailchimp", subscriber)

  // Submit and return promise
  return axios({
    method: "POST",
    url: `https://${mcRegion}.api.mailchimp.com/3.0/lists/${mailchimpListID}/members`,
    data: subscriber,
    headers: {
      "Authorization": `apikey ${mailchimpAPI}`,
      "Content-Type": "application/json"
    }
  }).then(() => ({
    statusCode: 200,
    body: 'Successfully added subscriber.'
  })).catch((e) => ({
    statusCode: e.response.data.status,
    body: e.response.data.title
  }))
}