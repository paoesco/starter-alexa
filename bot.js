console.log('Loading function')

const r = require('recastai').default
const request = require('request')

const recastClient = new r.build(process.env.REQUEST_TOKEN)

let sessionId = null
let endConv = false
let done = null

// Format reply for Alexa
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

  // Send input to Recast.AI
  recastClient.dialog({ 'type': 'text', content: text}, { conversationId: sessionId })
    .then((res) => {

      console.log(res)
      
      // Set end conversation flag to true when we match an end intent, so Alexa stop listening continously
      if (res.action && endIntents.indexOf(res.action.slug) > -1) {
        console.log('End of conversation')
        endConv = true
      }

      // reply to Alexa
      alexaReply(res.messages[0].content)
    })
    .catch((err) => {
      console.error(err)
      done.send(err)
    })
}

exports.bot = (event, doneFct) => {
  console.log('Received event:', JSON.stringify(event, null, 2))

  done = doneFct

  let helloReplies = [
    'Hello! How can I help you today?',
    'Welcome back. What do you need?'
  ]

  if (event.request) {
    console.log('Alexa message received')
    // Alexa Message
    if (event.request.type == 'LaunchRequest') {
      console.log('Trigger word received')
      // User says invovation word, reply hello
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
