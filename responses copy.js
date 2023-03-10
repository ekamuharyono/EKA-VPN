export const responStart = () => {
  return `
🙏 Selamat Datang di VPN EKA 🙏
(Ethernet Keep Alive)
  
Panduan lengkap VPN Remote Gratis : http://bit.ly/gratis-vpn-remote
          
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
Connect To : vpn.teleka.my.id
Username : ${name}

===Daftar port yang bisa digunakan===
Webfix 80 : vpn.teleka.my.id:${ports[0]}
Winbox 8291 : vpn.teleka.my.id:${ports[4]}
API 8728 : vpn.teleka.my.id:${ports[3]}
SSH 22 : vpn.teleka.my.id:${ports[2]}
Custom 2000 : vpn.teleka.my.id:${ports[1]}

Bisa langganan harian, mingguan, bulanan !!!
VPN Remote Gratis | VPN Game ML Gratis | 
VPN Sosmed | VPN Trafik | VPN Game | 
Mikhmon Online | Jasa Setting | Konsultasi
Open Reseller!!!
   
📞 WA : wa.me/6282153393216
🍹 Donasi : saweria.co/ekamhryn`
}