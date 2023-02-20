import TelegramBot from "node-telegram-bot-api"
import * as dotenv from 'dotenv'
dotenv.config()

import { responBadFormat, responInvalidData, responStart, responWait } from './responses.js' // import file berisi responses

const token = process.env.TELEGRAM_BOT_TOKEN  // ambil token bot telegram dari .env

const bot = new TelegramBot(token, { polling: true }) // initialize bot telegram

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
            let input = message[1].split('.') // data yg diinput user

            // jika user memasukan data
            return bot.sendMessage(chatId, responWait(input))

            // validasi data yg di inputkan terdaftar atau tidak

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
                return bot.sendMessage(chatId, responWait(user))

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