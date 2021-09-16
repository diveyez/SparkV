const TicTacToe = require("discord-tictactoe");
const Discord = require("discord.js");

const cmd = require("../../templates/gameCommand");

async function execute(bot, message, args, command, data) {
  console.log("Running tic tac toe game.");
  const Game = new TicTacToe({ language: "en" }, bot);

  Game.handleMessage(message);
}

module.exports = new cmd(execute, {
  description: "Play a game of Tic Tac Toe with me or mention someone to play with!",
  dirname: __dirname,
  usage: "",
  aliases: ["ttt"],
  perms: ["EMBED_LINKS"],
  type: "game",
});
