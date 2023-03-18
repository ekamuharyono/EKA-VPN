import express from "express"
import fs from 'fs'
import * as dotenv from 'dotenv'

import {
  Telegraf
} from "telegraf"

import {
  cekPort,
  createPort,
  cekUser,
  createUser
} from './controller/routerController.js'

import {
  responBadFormat,
  responCekData,
  responCreateSuccess,
  responInvalidData,
  responStart,
  responWait
} from "./../responses.js" // import file berisi responses

dotenv.config()
const app = express()

const BOT_TOKEN = process.env.BOT_TOKEN
const WEBHOOK_HOST = process.env.WEBHOOK_HOST
const USERNAME_ADMIN = process.env.USERNAME_ADMIN

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
])

const broadcastMessage = () => {

  setInterval(() => {
    fs.readFile('./api/assets/data.json', 'utf8', (err, data) => {
      if (err) throw err;
      const obj = JSON.parse(data);
      obj.map((user) => {
        Bot.telegram.sendMessage(user.id, "halo ini pesan setiap 5 detik")
      })
    })

    // }, 1000 * 5)
  }, 1000 * 3600 * 24)

}

// const aboutUrlKeyboard = {
//   inline_keyboard: [[{
//     text: 'Create VPN Manual',
//     url: 'https://t.me/ekamhryn/',
//   }]],
// };

const saveUser = (data_user) => {
  // membaca file JSON
  fs.readFile('./api/assets/data.json', 'utf8', (err, data) => {
    if (err) throw err;
    const obj = JSON.parse(data);

    // memeriksa apakah data baru sudah ada di dalam array
    const newData = data_user

    const isDuplicate = obj.some((item) =>
      JSON.stringify(item) === JSON.stringify(newData)
    )

    if (!isDuplicate) {
      // menambahkan data baru ke dalam array
      obj.push(newData);

      // menulis kembali ke file JSON dengan data baru
      fs.writeFile('./api/assets/data.json', JSON.stringify(obj), (err) => {
        if (err) throw err;
        console.log('Data has been added to file');
      });
    }
  })
}

// broadcastMessage() // jangan lupa kalo udah nambahkan text pesan e aktifkan lagi

Bot.command('admin', (ctx) => {
  if (ctx.from.username === USERNAME_ADMIN) {

  }
  // console.log(ctx.from)
})

Bot.command('start', (ctx) => ctx.reply(responStart()));

Bot.command('cek', (ctx) => {
  const msg = ctx.message?.text
  if (msg.length > 4) {
    const message = msg.split(' ')
    let input = message[1] // data yg diinput user

    // jika user memasukan data
    ctx.reply(responWait(input))

    // validasi data yg di inputkan terdaftar atau tidak
    cekUser(input).then((akun) => {
      if (!akun) {
        ctx.reply(`akun ${input} tidak ditemukan`)
      } else {
        cekPort(akun.remoteAddress).then(result => {
          ctx.reply(responCekData(input, result))
        })
      }
    })
  } else {
    // Jika user tidak memasukan username
    ctx.reply(responInvalidData())
  }
})

Bot.command('create', (ctx) => {
  const msg = ctx.message?.text
  if (msg.length > 7) {
    const message = msg.split(' ')
    let input = message[1].split('.') // data yg diinput user

    const user = input[0] // username yg di input
    const pass = input[1] // password yg di input

    // jika user memasukan data cek data lengkap atau tidak
    if (user && pass) {
      // jika data lengkap, lakukan validasi
      ctx.reply(responWait(user))
      try {
        cekUser(user).then((result) => {
          if (result === null) {
            createUser(user, pass)
            saveUser(ctx.from)
            return ctx.reply(responCreateSuccess(user, pass))
          } else {
            return ctx.reply(`Username ${user} sudah digunakan, silahkan gunakan username lain`)
          }
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      // jika user memasukan data tidak lengkap
      return ctx.reply(responBadFormat())
    }
  } else {
    // JIka user tidak memasukan data input
    return ctx.reply(responInvalidData())
  }
})

Bot.on('message', (ctx) => ctx.reply(responStart()));

Bot.telegram.setWebhook(WEBHOOK_HOST + secretPath)

app.use(Bot.webhookCallback(secretPath))

app.listen(3000, () => {
  console.log("Bot listening on port 3000")
})