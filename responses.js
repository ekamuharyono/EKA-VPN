import * as dotenv from 'dotenv'
dotenv.config()

export const responStart = () => {
  return `
🙏 Selamat Datang di VPN EKA 🙏
(Ethernet Keep Alive)
  
  BETA!!!
          
  Buat VPN :
  /create username.password
  Contoh : /create bambang.1234
   
  Cek List Port VPN :
  /cek username
  Contoh : /cek bambang
      
Bisa langganan harian, mingguan, bulanan !!!
VPN Remote Gratis | VPN Game ML Gratis | 
VPN Sosmed | VPN Trafik | VPN Game | 
Mikhmon Online | Jasa Setting | Konsultasi
Open Reseller!!!
   
📞 WA : wa.me/6282153393216
🍹 Donasi : saweria.co/ekamhryn`
}

export const responWait = (input) => {
  return `Silahkan Tunggu sedang mencari user ${input}`
}

export const responInvalidData = () => {
  return 'Invalid Data!'
}

export const responBadFormat = () => {
  return "Masukan data dengan format yang benar"
}

export const responCekData = (name, ports) => {
  return `
===================
Informasi VPN Remote
===================
Connect To : ${process.env.URL_CHR}
Username : ${name}

===Daftar port yang bisa digunakan===
Webfix 80 : ${process.env.URL_CHR}:${ports.webfix}
Winbox 8291 : ${process.env.URL_CHR}:${ports.winbox}
API 8728 : ${process.env.URL_CHR}:${ports.api}
SSH 22 : ${process.env.URL_CHR}:${ports.ssh}
Custom 2000 : ${process.env.URL_CHR}:${ports.custom}

Bisa langganan harian, mingguan, bulanan !!!
VPN Remote Gratis | VPN Game ML Gratis | 
VPN Sosmed | VPN Trafik | VPN Game | 
Mikhmon Online | Jasa Setting | Konsultasi
Open Reseller!!!
   
📞 WA : wa.me/6282153393216
🍹 Donasi : saweria.co/ekamhryn`
}

export const responCreateSuccess = (username, password) => {
  return `
==================
Akun berhasil dibuat
==================
Connect To : ${process.env.URL_CHR}
Username : ${username}
Password : ${password}
Akun VPN remote akan dihapus secara otomatis jika sudah tidak digunakan

=== Script terminal mikrotik ===
L2TP (copy semua)
/interface l2tp-client add connect=${process.env.URL_CHR} name=VPN-EKA-REMOTE-L2TP comment="vpn.teleka.my.id | wa.me/6282153393216 | Ready VPN Remote, VPN Game, VPN Trafik, Mikhmon Online" user=${username} pass=${password} disable=no

Bisa langganan harian, mingguan, bulanan !!!
VPN Remote Gratis | VPN Game ML Gratis | 
VPN Sosmed | VPN Trafik | VPN Game | 
Mikhmon Online | Jasa Setting | Konsultasi
Open Reseller!!!
   
📞 WA : wa.me/6282153393216
🍹 Donasi : saweria.co/ekamhryn`
}