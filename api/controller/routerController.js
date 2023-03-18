import * as dotenv from 'dotenv'
import {
  RouterOSClient
} from "routeros-client"

dotenv.config()

export const cekPort = async (remoteAddress) => {

  const api = new RouterOSClient({
    host: process.env.IP_CHR,
    user: process.env.LOGIN_CHR,
    password: process.env.PASSWORD_CHR,
    port: process.env.PORT_CHR || 8728,
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

export const createPort = async (port, remoteAddress, user) => {

  const api = new RouterOSClient({
    host: process.env.IP_CHR,
    user: process.env.LOGIN_CHR,
    password: process.env.PASSWORD_CHR,
    port: process.env.PORT_CHR || 8728,
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

export const cekUser = async (user) => {

  const api = new RouterOSClient({
    host: process.env.IP_CHR,
    user: process.env.LOGIN_CHR,
    password: process.env.PASSWORD_CHR,
    port: process.env.PORT_CHR || 8728,
  });

  let akun

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

export const createUser = async (user, pass) => {

  const api = new RouterOSClient({
    host: process.env.IP_CHR,
    user: process.env.LOGIN_CHR,
    password: process.env.PASSWORD_CHR,
    port: process.env.PORT_CHR || 8728,
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