import TelegramBot from "node-telegram-bot-api"

import { RouterOSClient } from 'routeros-client';

import * as dotenv from 'dotenv'
dotenv.config()

import { responBadFormat, responInvalidData, responStart, responWait } from './responses.js' // import file berisi responses

const token = process.env.TELEGRAM_BOT_TOKEN  // ambil token bot telegram dari .env

const bot = new TelegramBot(token, { polling: true }) // initialize bot telegram

let akun;

const cekUser = async (user) => {
    const api = new RouterOSClient({
        host: process.env.IP_CHR,
        user: process.env.LOGIN_CHR,
        password: process.env.PASSWORD_CHR,
        port: process.env.PORT_CHR,
    });

    try {
        const client = await api.connect();
        akun = await client.menu('/ppp secret').find({
            name: user,
        });

        api.close();
        return akun
    } catch (err) {
        console.log(err);
    }
};


const createUser = async (user, pass) => {
    const api = new RouterOSClient({
        host: process.env.IP_CHR,
        user: process.env.LOGIN_CHR,
        password: process.env.PASSWORD_CHR,
        port: process.env.PORT_CHR,
    });

    try {
        const client = await api.connect();

        const result = await client.menu('/ppp secret').add({
            name: user,
            password: pass,
            service: 'l2tp',
            localAddress: '172.10.0.1',
            remoteAddress: '172.10.0.2',
        });

        console.log(result.remoteAddress) // bisa langsung dapat berapa ip nya remote nya
        api.close();
    } catch (err) {
        console.log(err);
        // return
    }
};
// MAIN CODE
bot.on('message', (msg) => {

    const chatId = msg.chat.id // id telegram user

    //  HANDLE COMMAND START
    if (msg.text.includes('/start')) {

        return bot.sendMessage(chatId, responStart()) // Show help info

    }

    // HANDLE COMMAND CEK
    if (msg.text.includes('/cek')) {

        // cek user memasukan username atau tidak
        if (msg.text.length > 4) {

            const message = msg.text.split(' ')
            let input = message[1] // data yg diinput user
            // console.log(input)
            // jika user memasukan data
            bot.sendMessage(chatId, responWait(input))

            // validasi data yg di inputkan terdaftar atau tidak
            // console.log(akun)
            cekUser(input).then(() => console.log(akun))
            // console.log(akun)
            // jika user ditemukan

            // jika user tidak ditemukan

        } else {

            // Jika user tidak memasukan username
            bot.sendMessage(chatId, responInvalidData())

        }

    }

    // HANDLE COMMAND CREATE
    if (msg.text.includes('/create')) {

        // cek user memasukan data atau tidak
        if (msg.text.length > 7) {

            const message = msg.text.split(' ')
            let input = message[1].split('.') // data yg diinput user

            const user = input[0] // username yg di input
            const pass = input[1] // password yg di input

            // jika user memasukan data cek data lengkap atau tidak
            if (user && pass) {

                // jika data lengkap, lakukan validasi
                bot.sendMessage(chatId, responWait(user))
                try {
                    cekUser(user).then((result) => {
                        // console.log(result)
                        if (result === null) {
                            createUser(user, pass)
                            return bot.sendMessage(chatId, `berhasil membuat akun ${user}`)
                        } else {
                            return bot.sendMessage(chatId, `Username ${user} sudah digunakan, silahkan gunakan username lain`)
                        }
                    })

                } catch (error) {
                    console.log(error)
                }

            } else {

                // jika user memasukan data tidak lengkap
                return bot.sendMessage(chatId, responBadFormat())

            }

        } else {

            // JIka user tidak memasukan data input
            return bot.sendMessage(chatId, responInvalidData())

        }

    }

})