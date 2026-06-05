const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')
const pino = require('pino')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const { version } = await fetchLatestBaileysVersion()
    console.log(`شغال على واتساب إصدار: ${version.join('.')}`)

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: ['iPhone', 'Safari', '17.4'],
        printQRInTerminal: true // هذا السطر يخليه يطبع QR غصب
    })

    sock.ev.on('connection.update', ({ connection, qr }) => {
        if(qr) {
            console.log('\n\n=== امسح الـ QR هذا من واتساب الحين ===')
            qrcode.generate(qr, { small: true })
            console.log('======================================\n')
        }
        if(connection === 'open') {
            console.log('🔥🔥🔥 البوت اتصل واشتغل خلاص 🔥🔥🔥')
        }
        if(connection === 'close') {
            console.log('فصل.. بعيد التشغيل تلقائي')
            startBot()
        }
    })
    
    sock.ev.on('creds.update', saveCreds)
}

startBot()
