console.log('Loading function')

const r = require('recastai').default
const request = require('request')

const recastClient = new r(process.env.REQUEST_TOKEN)

let sessionId = null
let endConv = false

let done = null

let reply = (text, done) => {
}

let sendSMS = (body) => {
  const twilioUrl = 'https://api.twilio.com/2010-04-01/Accounts/ACff4221972b56e6f75223039c9648fd49/Messages.json'
  const to = '+33635917428'
  const from = '+33756798311'
  const appId = 'ACff4221972b56e6f75223039c9648fd49'
  const appSecret = '78d40a89c33b453ed1aa128920971860'

  request.post(twilioUrl).form({'To': to, 'From': from, 'Body': body}).auth(appId, appSecret)
}


let alexaReply = (text) => {
  done.send({
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: text
      },
      shouldEndSession: endConv
    }
  })

  // Always set endConv back to false
  endConv = false
}

let handleAlexaMessage = (text) => {
  endIntents = [
    'goodbye',
    'thanks',
  ]

  recastClient.request.converseText(text, { conversationToken: sessionId })
    .then((res) => {

      // Handle special cases
      console.log(res)
      if (res.action && res.action.slug == 'sms-report') {
        sendSMS("Your account balance is +$2340,25.\nYour last expense is $50 at Marks & Spencer PLC.\nHave a great day!\nYour banking assistant.")
      } else if (res.action && endIntents.indexOf(res.action.slug) > -1) {
        console.log('End of conversation')
        endConv = true
      }

      // reply to Alexa
      alexaReply(res.replies.join(' '))
    })
    .catch((err) => {
      console.error(err)
      done.send(err)
    })
}
/*
let handleBCMessage = (message) => {
  // Get text from message received
  const text = message.content

  console.log('I receive: ', text)

  // Get senderId to catch unique conversation_token
  const senderId = message.senderId

  // Call Recast.AI SDK, through /converse route
  recast.converseText(text, { conversationToken: senderId })
  .then(result => {
    if (result.action) {
      console.log('The conversation action is: ', result.action.slug)
    }

    // If there is not any message return by Recast.AI for this current conversation
    if (!result.replies.length) {
      message.addReply({ type: 'text', content: 'I don\'t have the reply to this yet :)' })
    } else {
      // Add each reply received from API to replies stack
      result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent }))
    }

    // Send all replies
    message.reply()
    .then(() => {
      // Do some code after sending messages
    })
    .catch(err => {
      console.error('Error while sending message to channel', err)
    })
  })
  .catch(err => {
    console.error('Error while sending message to Recast.AI', err)
  })
}*/

exports.bot = (event, doneFct) => {
  console.log('Received event:', JSON.stringify(event, null, 2))

  done = doneFct

  let helloReplies = [
    'Hello! How can I help you today?',
    'Welcome back. What do you need?'
  ]

  if (event.message) {
    // BC Message
    recastClient.connect.handleMessage({ body }, done, handleBCMessage)
  } else if (event.request) {
    console.log('Alexa message received')
    // Alexa Message
    if (event.request.type == 'LaunchRequest') {
      console.log('Trigger word received')
      // User says trigger word
      alexaReply(helloReplies[Math.floor(Math.random() * helloReplies.length)])
    } else if (event.request.type == 'IntentRequest') {
      // Conversation
      const text = event.request.intent.slots.sentence.value
      console.log('Received: ', text)

      sessionId = (sessionId == null ? event.session.sessionId : sessionId)

      if (text) {
        handleAlexaMessage(text)
      } else {
        done.send(new Error('No text provided'))
      }
    }
  }

  console.log('Processing finished')
}
