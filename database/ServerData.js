const mongoose = require("mongoose")

let ServerData = new mongoose.Schema({
  GuildID: Number,

  Settings: Array,
})

const MessageModel = module.exports = mongoose.model("ServerData", ServerData)