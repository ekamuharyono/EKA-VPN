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
  return 'Anda tidak memasukan user dan password'
}

export const responBadFormat = () => {
  return "Masukan data dengan format yang benar"
}