const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()
const { Telegraf } = require("telegraf")

const BOT_TOKEN = process.env.BOT_TOKEN
// const BOT_TOKEN = "6217838277:AAF6erisBjdIV8eViFJTFN5FJoo9dcAbmWc"
const WEBHOOK_HOST = process.env.WEBHOOK_HOST
// const WEBHOOK_HOST = "https://b889-182-2-100-86.ap.ngrok.io/"

const Bot = new Telegraf(BOT_TOKEN)
const secretPath = `/api/webhook/${BOT_TOKEN}`

Bot.telegram.setMyCommands([
    {
        command: 'start',
        description: 'Memulai / Bantuan',
    },
    {
        command: 'create',
        description: 'Membuat akun vpn baru',
    },
    {
        command: 'cek',
        description: 'Menampilkan data akun vpn',
    },
]);

const introductionMessage = `Mohon maaf layanan untuk pembuatan akun vpn sementara ditutup karena Bot Telegram sedang dalam perbaikan.
Tapi akun vpn yang sudah dibuat tetap bisa digunakan.
Jika ingin membuat akun vpn silahkan hubungi owner dengan mengklik tombol dibawah!
Sekian Terima Kasih :)`;

const aboutUrlKeyboard = {
    inline_keyboard: [[{
        text: 'Create VPN Manual',
        url: 'https://t.me/ekamhryn/',
    }]],
};

const replyWithIntro = (ctx) => ctx.reply(introductionMessage, {
    reply_markup: aboutUrlKeyboard,
    parse_mode: 'HTML',
});

Bot.command('start', replyWithIntro);

Bot.on('message', replyWithIntro);

Bot.telegram.setWebhook(WEBHOOK_HOST + secretPath)

app.use(Bot.webhookCallback(secretPath))

app.listen(3000, () => {
    console.log("Bot listening on port 3000")
})