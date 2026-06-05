const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode!== DisconnectReason.loggedOut
            console.log('connection closed, reconnecting...', shouldReconnect)
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection ✅')
        }
    })

    sock.ev.on('creds.update', saveCreds)

    // هنا كود الرد على كل الرسائل
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return

        const from = msg.key.remoteJid
        const type = Object.keys(msg.message)[0]

        try {
            if (type === 'conversation' || type === 'extendedTextMessage') {
                const text = msg.message.conversation || msg.message.extendedTextMessage.text
                await sock.sendMessage(from, { text: `وصلني نصك: "${text}" ✅` })
            }
            else if (type === 'imageMessage') {
                await sock.sendMessage(from, { text: 'صورة جميلة 📸 وصلت' })
            }
            else if (type === 'videoMessage') {
                await sock.sendMessage(from, { text: 'الفيديو وصل 🎬' })
            }
            else if (type === 'audioMessage') {
                await sock.sendMessage(from, { text: 'فويسك وصل 🎤 بس ما أقدر أسمعه حالياً' })
            }
            else if (type === 'stickerMessage') {
                await sock.sendMessage(from, { text: 'ملصق رهيب 😂' })
            }
            else if (type === 'documentMessage') {
                await sock.sendMessage(from, { text: 'استلمت الملف 📄' })
            }
            else {
                await sock.sendMessage(from, { text: 'وصلني شي جديد 😅' })
            }
        } catch (e) {
            console.log('خطأ:', e)
        }
    })

    // يرفض المكالمات
    sock.ev.on('call', async (call) => {
        await sock.sendMessage(call.from, { text: 'أنا بوت ما أقدر أرد مكالمات 📵 أرسل رسالة' })
        await sock.rejectCall(call.id, call.from)
    })
}

connectToWhatsApp()
