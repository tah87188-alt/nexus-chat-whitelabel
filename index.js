const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
const pino = require('pino');

// سيرفر وهمي عشان Render المجاني
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Nexus Bot is running ✅'));
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// كود البوت
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut;
            if(shouldReconnect) startBot();
        } else if(connection === 'open') {
            console.log('Bot connected successfully');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        
        if(text.toLowerCase() === 'ping') {
            await sock.sendMessage(from, { text: 'pong ✅' });
        }
    });
}

startBot();
