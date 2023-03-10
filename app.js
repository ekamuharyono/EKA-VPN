import TelegramBot from "node-telegram-bot-api"

import {
    RouterOSClient
} from 'routeros-client';

import * as dotenv from 'dotenv'
dotenv.config()

import {
    responBadFormat,
    responCekData,
    responCreateSuccess,
    responInvalidData,
    responStart,
    responWait
} from './responses.js' // import file berisi responses

const token = process.env.TELEGRAM_BOT_TOKEN // ambil token bot telegram dari .env

const bot = new TelegramBot(token, {
    polling: true
}) // initialize bot telegram

let akun;

const cekPort = async (remoteAddress) => {

    const api = new RouterOSClient({
        host: process.env.IP_CHR,
        user: process.env.LOGIN_CHR,
        password: process.env.PASSWORD_CHR,
        port: process.env.PORT_CHR,
    });

    try {

        const client = await api.connect();

        const firewalls = await client.menu('/ip firewall nat').getAll({
            toAddresses: remoteAddress
        });

        api.close()

        let ports = {}

        firewalls.map((firewall) => {
            switch (firewall.toPorts) {
                case 80:
                    ports.webfix = firewall.dstPort
                    break
                case 8291:
                    ports.winbox = firewall.dstPort
                    break
                case 8728:
                    ports.api = firewall.dstPort
                    break
                case 22:
                    ports.ssh = firewall.dstPort
                    break
                case 2000:
                    ports.custom = firewall.dstPort
                    break
            }

        })

        return ports

    } catch (error) {
        console.log(error)
    }
}

const createPort = async (port, remoteAddress, user) => {

    const api = new RouterOSClient({
        host: process.env.IP_CHR,
        user: process.env.LOGIN_CHR,
        password: process.env.PASSWORD_CHR,
        port: process.env.PORT_CHR,
    });

    const minPort = 999
    const maxPort = 65000

    try {
        const client = await api.connect();

        const minPort = 1001
        const maxPort = 9999

        let randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort

        const result = await client.menu('/ip firewall nat').add({
            chain: "dstnat",
            dstAddress: process.env.IP_CHR,
            protocol: "tcp",
            dstPort: randomPort,
            action: "dst-nat",
            toAddresses: remoteAddress,
            toPorts: port,
            comment: `Port ${port} for user ${user}`
        });

        api.close()

    } catch (error) {
        console.log(error)
    }
}

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

        const minIP = 1
        const maxIP = 255

        const segmen3 = Math.floor(Math.random() * (maxIP - minIP + 1)) + minIP
        const segmen4 = Math.floor(Math.random() * (maxIP - minIP + 1)) + minIP

        const result = await client.menu('/ppp secret').add({
            name: user,
            password: pass,
            service: 'l2tp',
            localAddress: `172.10.${segmen3}.${segmen4 - 1}`,
            remoteAddress: `172.10.${segmen3}.${segmen4}`,
            comment: `Akun User ${user}`
        });

        const ports = [80, 8291, 8728, 22, 2000]

        ports.map((port) => {
            createPort(port, result.remoteAddress, result.name)
        })

        api.close()
    } catch (err) {
        console.log(err)
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
        if (msg.text.length > 4) { // cek user memasukan username atau tidak
            const message = msg.text.split(' ')
            let input = message[1] // data yg diinput user

            // jika user memasukan data
            bot.sendMessage(chatId, responWait(input))

            // validasi data yg di inputkan terdaftar atau tidak
            cekUser(input).then(() => {
                if (!akun) {
                    bot.sendMessage(chatId, `akun ${input} tidak ditemukan`)
                } else {
                    cekPort(akun.remoteAddress).then(result => {
                        bot.sendMessage(chatId, responCekData(input, result))
                    })
                }
            })
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
                        if (result === null) {
                            createUser(user, pass)
                            return bot.sendMessage(chatId, responCreateSuccess(user, pass))
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