const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    // Giả định message là UID thô (có thể là Buffer)
    console.log(`Received message from client: ${message}`);

    // Kiểm tra và chuyển đổi message nếu nó là Buffer
    let uidMessage = message;
    if (Buffer.isBuffer(message)) {
      // Chuyển buffer thành chuỗi (giả định message là UID)
      uidMessage = message.toString(); 
    }

    // Gửi UID đến tất cả client đang kết nối
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ uid: uidMessage }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
