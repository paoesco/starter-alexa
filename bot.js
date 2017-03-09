console.log('Loading function')

// MODULES IMPORT
const recast = require('recastai')
const botConnector = require('recastai-botconnector')

// RECAST.AI INIT
const recastClient = new recast.Client(process.env.REQUEST_TOKEN)

const myBot = new botConnector({ botId: process.env.BOT_ID, userSlug: process.env.USER_SLUG, userToken: process.env.USER_TOKEN })

myBot.onTextMessage(message => {
    const text = message.content.attachment.content
    const senderId = message.senderId
    const res = recastClient.textConverse(text, { conversationToken: senderId })

    console.log(message)

    res.then((r) => {
      console.log(r)
      r.replies.forEach(content => message.addReply({ type: 'text', content }))
      message.reply()
    })
})

exports.bot = function(event, context, done) {
  console.log('Received event:', JSON.stringify(event, null, 2))
  const text = (event.text === undefined ? null : event.text)

  if (text) {
    recastClient.textConverse(text, { conversationToken: process.env.CONVERSATION_TOKEN || null })
      .then((res) => {
        done(null, {
          reply: res.reply(),
          conversationToken: res.conversationToken,
        })
      })
      .catch((err) => {
        console.error(err)
        done(err)
      })
  } else if (event.message) {
    const req = {}
    req.body = event
    myBot.listen(req)
  } else {
    done(new Error('No text provided'))
  }
}
