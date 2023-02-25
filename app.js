import TelegramBot from "node-telegram-bot-api"

import { RouterOSClient } from 'routeros-client';

import * as dotenv from 'dotenv'
dotenv.config()

import { responBadFormat, responInvalidData, responStart, responWait } from './responses.js' // import file berisi responses

const token = process.env.TELEGRAM_BOT_TOKEN  // ambil token bot telegram dari .env

const bot = new TelegramBot(token, { polling: true }) // initialize bot telegram

const createNat = (vpnuser, vpnpassword, chatId) => {

    const api = new RouterOSClient({
        host: process.env.IP_CHR,
        user: process.env.LOGIN_CHR,
        password: process.env.PASSWORD_CHR,
        port: process.env.PORT_CHR,
    });

    api.connect().then((client) => {

        client.menu("/ppp secret").add({
            name: vpnuser,
            password: vpnpassword,
            service: "l2tp",
            localAddress: "172.10.0.1",
            remoteAddress: "172.10.0.2"
        }).then((result) => {
            api.close();
            return bot.sendMessage(chatId, `berhasil membuat akun ${vpnuser}`)

        }).catch((err) => {
            console.log(err); // Some error trying to get the identity
        });

        // client.menu("/ip firewall nat").add({
        //     chain: "dst-nat",
        //     dstAddress: process.env.IP_CHR,
        //     protocol: "tcp",
        //     dstPort: 1000,
        //     action: "dst-nat",
        //     toAddresses: "172.10.0.2",
        //     toPorts: 8291
        // }).then((result) => {
        //     console.log(result); // Mikrotik
        //     api.close();

        // }).catch((err) => {
        //     console.log(err); // Some error trying to get the identity
        // });

    }).catch((err) => {
        // Connection error
        console.log('koneksi eror')
    });

    //     natMenu.add({
    //         chain: "dst-nat",
    //         dstAddress: process.env.IP_CHR,
    //         protocol: "tcp",
    //         dstPort: 1000,
    //         action: "dst-nat",
    //         toAddress: "172.10.0.2",
    //         dstPort: 80
    //     }).then((response) => {
    //         // response should be an object like { ret: "*3C" }
    //         return bot.sendMessage(chatId, 'user berhasil dibuat')

    //     }).then((response) => {
    //         // response should be an empty array [] since, 
    //         // if there is no error, updates return nothing, meaning success
    //         api.close();
    //         return bot.sendMessage(chatId, 'user berhasil dibuat 123123')
    //     }).catch((err) => {
    //         // error adding or eiditing
    //     });

    // }).catch((err) => {
    //     // Connection error
    // });
}


// MAIN CODE
bot.on('message', (msg) => {

    const chatId = msg.chat.id // id telegram user

    //  HANDLE COMMAND START
    if (msg.text.includes('/start')) {

        // api.connect().then((client) => {
        //     // After connecting, the promise will return a client class so you can start using it

        //     // You can either use spaces like the winbox terminal or
        //     // use the way the api does like "/system/identity", either way is fine
        //     client.menu("/system identity").getOnly().then((result) => {
        //         console.log(result.name); // Mikrotik
        //         api.close();

        //     }).catch((err) => {
        //         console.log(err); // Some error trying to get the identity
        //     });

        // }).catch((err) => {
        //     // Connection error
        //     console.log('koneksi eror')
        // });

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
                bot.sendMessage(chatId, responWait(user))
                createNat(user, pass, chatId)


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