const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if(qr) {
            console.log('امسح الـ QR هذا بكاميرا واتساب:');
        }
        
        if(connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut;
            console.log('الاتصال انقطع، جاري إعادة المحاولة...');
            if(shouldReconnect) startBot();
        } else if(connection === 'open') {
            console.log('✅ تم ربط واتساب بنجاح - TahBot شغال');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        
        if (text.toLowerCase() === 'مرحبا') {
            await sock.sendMessage(from, { text: 'أهلاً فيك 👋 TahBot شغال تمام' });
        }
    });
}

startBot();
