sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0]
    if (!msg.message || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const type = Object.keys(msg.message)[0] // يجيب نوع الرسالة

    try {
        // 1. نص عادي
        if (type === 'conversation' || type === 'extendedTextMessage') {
            const text = msg.message.conversation || msg.message.extendedTextMessage.text
            await sock.sendMessage(from, { text: `وصلني نصك: "${text}" ✅` })
        }

        // 2. صورة
        else if (type === 'imageMessage') {
            await sock.sendMessage(from, { text: 'صورة جميلة 📸 وصلت' })
        }

        // 3. فيديو
        else if (type === 'videoMessage') {
            await sock.sendMessage(from, { text: 'الفيديو وصل 🎬' })
        }

        // 4. فويس
        else if (type === 'audioMessage') {
            await sock.sendMessage(from, { text: 'فويسك وصل 🎤 بس ما أقدر أسمعه حالياً' })
        }

        // 5. ملصق
        else if (type === 'stickerMessage') {
            await sock.sendMessage(from, { text: 'ملصق رهيب 😂' })
        }

        // 6. مستند
        else if (type === 'documentMessage') {
            await sock.sendMessage(from, { text: 'استلمت الملف 📄' })
        }

        // 7. أي شي ثاني
        else {
            await sock.sendMessage(from, { text: 'وصلني شي جديد 😅 بس ما عرفته' })
        }

    } catch (e) {
        console.log('خطأ:', e)
    }
})

// يرفض المكالمات تلقائي ويرسل رسالة
sock.ev.on('call', async (call) => {
    await sock.sendMessage(call.from, { text: 'أنا بوت ما أقدر أرد مكالمات 📵 أرسل رسالة' })
    await sock.rejectCall(call.id, call.from)
})
