const { create } = require('@open-wa/wa-automate');

console.log('Starting Nexus Bot...');

create({
  headless: true,
  useChrome: true,
  executablePath: '/usr/bin/chromium',
  qrTimeout: 0,
  killProcessOnBrowserClose: true,
}).then(client => {
  console.log('Bot is ready. Scan QR from Render logs');
  client.onMessage(async message => {
    if (message.body.toLowerCase() === 'ping') {
      await client.sendText(message.from, 'pong 🏓');
    }
  });
}).catch(e => console.log('Error:', e));
