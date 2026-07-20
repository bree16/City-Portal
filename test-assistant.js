const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 80,
  path: '/api/assistant/chat',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('Response:', data));
});

req.on('error', console.error);
req.write(JSON.stringify({
  messages: [{ role: 'user', content: 'hello' }]
}));
req.end();
