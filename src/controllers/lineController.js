const db = require('../models/firebase')
const youtubeSearch = require('yt-search')
const line = require('@line/bot-sdk');
const lineConfig = require('../config/line')
const axios = require('axios')
const dayjs = require('dayjs')

const client = new line.Client(lineConfig);

const lineController = {
  eventListener (req, res) {
    Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
  }
}

async function handleEvent(event) {

  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const option = initRequest(event.message.text)
  const replyText = await verifyCommand(option, event.source.userId)
  
  return client.replyMessage(event.replyToken, { type: 'text', text: replyText })
}

function initRequest(req) {
  const reqMsg = req.split(' ')
  const reqCommand = reqMsg[0]
  reqMsg.splice(0, 1)
  const reqQuerry = reqMsg.join('')

  return { command: reqCommand, querry: reqQuerry }
}

async function verifyCommand (option, uid) {
  return option.command === '-add' ? await addMusic(option.querry, uid) : helper()
}

async function addMusic (qry, uid) {
  let text = 'Do something pls'
  const lineUserName = await getUserName(uid)
  if (!!qry) {
    try {
      const searchResult = await youtubeSearch(qry)

      await db.ref('queue').push({
        title: searchResult.videos[0].title,
        videoId: searchResult.videos[0].videoId,
        url: searchResult.videos[0].url,
        duration: searchResult.videos[0].seconds,
        addedBy: lineUserName,
        addedTime: new Date(),
        status: 'waiting'
      })

      text = `[${searchResult.videos[0].title}] has been add to queue. Sit tight or wait faster!`
    } catch (e) {
      console.error(`[GOT AN ERROR]: ${e.message}`)
      text = '[GOT AN ERROR]: oops sorry something wrong pls try again or ask ur host'
    } 
  } else {
    text = 'Pls gimme url, not only command!!'
  }
  
  return text
}

function helper () {
  return 'Just type: "-add <key to search or url>" that ez way to add music'
}

async function getUserName (uid) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
    }
  }
  const { data: { displayName } } = await axios.get(`https://api.line.me/v2/bot/profile/${uid}`, config)
  return displayName
}

module.exports = lineController