const TelegramBot = require("node-telegram-bot-api");

const token = "6901081151:AAHtH8-e3o6XHT_Pg4XrQCRVc7EfeMlhLmM";
const bot = new TelegramBot(token, { polling: true });
const fs = require("fs");
const ytdl = require("ytdl-core");
const { send } = require("process");

const dir = "./savedvideo";
const aud = "./audio";
let state;
let audio;
let urlmsg;
let msg;

// fs.readdir(dir, (err, files) => {
// 	// console.log(files.length);
// 	state = files.length;
// });

// fs.readdir(aud, (err, files) => {
// 	// console.log(files.length);
// 	audio = files.length;
// });
bot.setMyCommands([
	{
		command: "/start",
		description: "botni ishga tushirish",
	},
	{
		command: "/video",
		description: "ma'lumot formati video",
	},
	{
		command: "/audio",
		description: "malumot formati audio",
	},
]);

const dataformat = {
	reply_markup: {
		inline_keyboard: [
			[
				{
					text: "audio",
					callback_data: "/audio",
				},
				{
					text: "video ",
					callback_data: "/video",
				},
			],
		],
	},
};


 bot.on('message',  (msg1) => {
	urlmsg = msg1.text;
	msg = msg1;
  const chatId = msg1.chat.id;
	const name = msg.chat.first_name;
	if (msg.text == "/start") {
		bot.sendMessage(
			chatId,
			`Assalomu alaykum ${name}. \n \n Bu bot orqali you tube dan video yuklab olsa bo'ladi.`
		);
	} else if (!ytdl.validateURL(msg.text)) {
		bot.sendMessage(chatId, "iltimos, linkni qayta tekshirib koring");
	} else if (ytdl.validateURL(msg.text)) {
    bot.sendMessage(chatId,"formatni tanlang", dataformat)
	}
});

bot.on("callback_query", (xabar) => {
		async function botsendVideo() {
			const chatId = xabar.from.id;
			let id = await bot.sendMessage(chatId, "link keldi, biroz kuting!");
			console.log(id);
			let info = await ytdl.getInfo(msg.text);
			let name = info.videoDetails.title;
			console.log(xabar.data);
			if (xabar.data == "/video") {
				state = state + 1;
				ytdl(urlmsg).pipe(fs.createWriteStream(`savedvideo/${state}.mp4`));
				setTimeout(() => {
					bot.deleteMessage(chatId, id.message_id);
					bot.sendVideo(chatId, `savedvideo/${state}.mp4`, {
						caption: `${name} \n\n A'zo bo'ling 👉 @IT_Moment`,
					}); 
				}, 15000);
			} else if (xabar.data == "/audio") {
				audio = audio + 1; 
				ytdl(urlmsg).pipe(fs.createWriteStream(`./audio/${name}.mp3`));
				setTimeout(() => { 
					bot.deleteMessage(chatId, id.message_id);
					bot.sendAudio(chatId, `./audio/${name}.mp3`, {
						caption: `${name} \n\n A'zo bo'ling 👉 @IT_Moment`,
					});
				}, 15000);
			}
		} 
		botsendVideo();
	});
