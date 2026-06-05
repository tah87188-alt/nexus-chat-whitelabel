const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({ auth: state, browser: ['iPhone', 'Safari', '17.4'] })
    
    sock.ev.on('connection.update', ({ qr }) => {
        if(qr) {
            console.log('امسح هذا الـ QR من واتساب:')
            qrcode.generate(qr, { small: true })
        }
    })
    sock.ev.on('creds.update', saveCreds)
}
startBot()
