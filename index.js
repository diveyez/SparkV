// KingCh1ll //
// 4/22/2021 //

// Libarys //
const fs = require("fs");
const path = require("path");
const Sentry = require("@sentry/node");
const { Integrations } = require("@sentry/tracing");
const { ShardingManager } = require("discord.js");
const mongoose = require("mongoose");
const axios = require("axios");

// Varibles //
const Config = require("./globalconfig.json");
const Logger = require("./modules/logger");
const PackageInfo = require("./package.json");

// Functions //
async function checkForUpdate() {
	try {
		const tag_name = await axios.get("https://api.github.com/repos/Ch1ll-Studio/SparkV/releases/latest").then(response => response.data.tag_name);

		if (Number(tag_name.slice(1)) > Number(PackageInfo.version)) {
			console.log(require("chalk").grey("----------------------------------------"));
			await Logger("WARNING - UPDATE_AVAILABLE => PLEASE UPDATE TO THE LATEST VERSION", "warn");
			console.log(require("chalk").grey("----------------------------------------"));
		}
	} catch (err) {
		console.log(require("chalk").grey("----------------------------------------"));
		await Logger(`WARNING - UPDATE_CHECK_ERROR => FAILED TO CHECK FOR UPDATE. ${err}`, "warn");
		console.log(require("chalk").grey("----------------------------------------"));
	}
}

async function start() {
	require("dotenv").config();

	Sentry.init({
		dsn: process.env.SENTRYTOKEN,
		release: `${PackageInfo.name}@${PackageInfo.version}`,
		integrations: [new Integrations.BrowserTracing()],
		tracesSampleRate: 0.2,
		tracesSampler: samplingContext => {}
	});

	if (process.env.MONGOOSEURL) {
		await mongoose.connect(process.env.MONGOOSEURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}

	mongoose.connection.on("error", console.error.bind(console, "Database connection error!"));
	mongoose.connection.on("open", () => Logger("DATABASE - ONLINE"));

	fs.readdir(path.join(`${__dirname}/events`), (err, files) => {
		if (err) return Logger(err, "error");

		files.forEach(file => {
			const EventName = file.split(".")[0];
			const FileEvent = require(`./events/${EventName}`);

			process.on(EventName, (...args) => FileEvent.run(...args));
		});
	});

	process.env.MainDir = __dirname;

	if (Config.sharding.shardingEnabled === true) {
		const manager = new ShardingManager("./bot/bot.js", {
			token: process.env.TOKEN,
			totalShards: Config.sharding.totalShards || "auto",
			shardArgs: [...process.argv, ...["--sharding"]],
			execArgv: [...process.argv, ...["--trace-warnings"]],
		});

		// Shard Handlers //
		manager.on("shardCreate", Shard => {
			console.log(require("chalk").green(`DEPLOYING - SHARD ${Shard.id}/${manager.totalShards} DEPLOYING`));

			Shard.on("ready", () => {
				console.log(
					require("chalk").blue(`DEPLOY SUCCESS - SHARD ${Shard.id}/${manager.totalShards} DEPLOYED SUCCESSFULLY`),
				);
			});

			Shard.on("disconnect", event => {
				Logger("Fatal", err, {
					shard: Shard.id,
				});

				console.log(
					require("chalk").red(`SHARD DISCONNECTED - SHARD ${Shard.id}/${manager.totalShards} DISCONNECTED. ${event}`),
				);
			});

			Shard.on("reconnecting", () => {
				console.log(require("chalk").red(`SHARD RECONNECTING - SHARD ${Shard.id}/${manager.totalShards} RECONNECTING`));
			});

			Shard.on("death", event => {
				Logger("Fatal", err, {
					shard: Shard.id,
				});

				console.log(
					require("chalk").red(
						`SHARD CLOSED - SHARD ${Shard.id}/${manager.totalShards} UNEXPECTEDLY CLOSED!\nPID: ${event.pid}\nExit Code: ${event.exitCode}.`,
					),
				);

				if (!event.exitCode) {
					console.warn(`WARNING: SHARD ${Shard.id}/${manager.totalShards} EXITED DUE TO LACK OF AVAILABLE MEMORY.`);
				}
			});
		});

		manager.spawn();
	} else {
		await require("./bot/bot");
	}
}

// Start Bot //
console.log(require("asciiart-logo")(require("./package.json")).render());

if (process.argv.includes("--dev") === true) {
	console.log(require("chalk").grey("----------------------------------------"));
	Logger("DEV - ENABLED -> Some features may not work on this mode.");
	console.log(require("chalk").grey("----------------------------------------"));
}

checkForUpdate();

if (process.version.slice(1, 3) - 0 < 16) {
	console.log(require("chalk").grey("----------------------------------------"));
	Logger("WARNING - VERSION_ERROR => UNSUPPORTED NODE.JS VERSION. PLEASE UPGRADE TO v16.6");
	console.log(require("chalk").grey("----------------------------------------"));
	return;
}

start();
