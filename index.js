'use strict'

console.log('Loading function')

// MODULES IMPORT
const recast = require('recastai')

// RECAST.AI INIT
const recastClient = new recast.Client(process.env.REQUEST_TOKEN)

exports.handler = (event, context, done) => {
  console.log('Received event:', JSON.stringify(event, null, 2))
  const text = (event.text === undefined ? null : event.text)

  if (text) {
    recastClient.textConverse(text, { conversationToken: process.env.CONVERSATION_TOKEN || null })
      .then(recast => {
        done(null, {
          reply: recast.reply(),
          conversationToken: recast.conversation_token
        });
      })
      .catch(err => {
        console.error(err)
        done(err)
      });
  } else if (!text) {
    done(new Error('No text provided'))
  }
}
