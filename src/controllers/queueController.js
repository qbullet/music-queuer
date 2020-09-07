const db = require('../models/firebase')
const youtubeSearch = require('yt-search')
const dayjs = require('dayjs')

const queueController = {
  async getMusics (req, res) {
    try {
      const snapshot = await db.ref('queue').once('value')
      res.json(snapshot.val())
    } catch (e) {
      console.error(`[GOT AN ERROR]: ${e.message}`)
      res.send(`[GOT AN ERROR]: ${e.message}`).status(500)
    }
  },

  async getMusicOne (req, res) {
    const { id } = req.params

    try {
      const snapshot = await db.ref('queue').child(id).once('value')
      res.json(snapshot.val())
    } catch (e) {
      console.error(`[GOT AN ERROR]: ${e.message}`)
      res.send(`[GOT AN ERROR]: ${e.message}`).status(500)
    }
  },

  async addMusic (req, res) {
    const { query } = req.body

    try {
      const searchResult = await youtubeSearch(query)
      const now = dayjs().format()

      const insert = await db.ref('queue').push({
        title: searchResult.videos[0].title,
        videoId: searchResult.videos[0].videoId,
        url: searchResult.videos[0].url,
        duration: searchResult.videos[0].seconds,
        addedBy: 'HOST',
        addedTime: now,
        status: 'waiting'
      })

      res.json(insert).status(200)
    } catch (e) {
      console.error(`[GOT AN ERROR]: ${e.message}`)
      res.send(`[GOT AN ERROR]: ${e.message}`).status(500)
    }
    
  },

  async changeState (req, res) {
    const { id } = req.params
    const { status } = req.body

    try {
      await db.ref('queue').child(id).update({ status })
      res.send('success').status(200)
    } catch (e) {
      console.error(`[GOT AN ERROR]: ${e.message}`)
      res.send(`[GOT AN ERROR]: ${e.message}`).status(500)
    }
  },

  async removeMusic (req, res) {
    const { id } = req.params

    try {
      await db.ref('queue').child(id).remove()
      res.send('success').status(200)
    } catch (e) {
      console.error(`[GOT AN ERROR]: ${e.message}`)
      res.send(`[GOT AN ERROR]: ${e.message}`).status(500)
    }
  }
}

module.exports = queueController