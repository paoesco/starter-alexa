console.log('Loading function')

const r = require('recastai')
const recast = new r.Client(process.env.REQUEST_TOKEN)
const request = require('request')

let sessionId = null
let endConv = false

let reply = (text, done) => {
  done.send({
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: text
      },
      shouldEndSession: endConv
    }
  })
  endConv = false
}

let sendSMS = (body) => {
  const twilioUrl = 'https://api.twilio.com/2010-04-01/Accounts/ACff4221972b56e6f75223039c9648fd49/Messages.json'
  const to = '+33635917428'
  const from = '+33756798311'
  const appId = 'ACff4221972b56e6f75223039c9648fd49'
  const appSecret = '78d40a89c33b453ed1aa128920971860'

  request.post(twilioUrl).form({'To': to, 'From': from, 'Body': body}).auth(appId, appSecret)
}

let handleIntent = (res) => {
  endIntents = [
    'goodbye',
    'thanks',
  ]

  if (res.action && res.action.slug == 'sms-report') {
    sendSMS("Your account balance is +$2340,25. Your last expense is $50 at Marc and Spensers LDT. Have a great day! Your banking assistant.")
  } else if (res.action && endIntents.indexOf(res.action.slug) > -1) {
    console.log('End of conversation')
    endConv = true
  }
  return res.replies.join(' ')
}

exports.bot = (event, done) => {
  console.log('Received event:', JSON.stringify(event, null, 2))

  let helloReplies = [
    'Hello! How can I help you today?',
    'Welcome back. What do you need?'
  ]

  if (event.request.type == 'LaunchRequest') {
    reply(helloReplies[Math.floor(Math.random() * helloReplies.length)], done)
  } else if (event.request.type == 'IntentRequest') {
    const text = event.request.intent.slots.sentence.value

    console.log('Received: ', text)

    sessionId = (sessionId == null ? event.session.sessionId : sessionId)

    if (text) {
      recast.textConverse(text, { conversationToken: sessionId })
        .then((res) => {
          console.log(res)
          let rep = handleIntent(res)
          reply(rep, done)
        })
        .catch((err) => {
          console.error(err)
          done.send(err)
        })
    } else {
      done.send(new Error('No text provided'))
    }
  }
}
