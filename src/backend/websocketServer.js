const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log(`Received message from client: ${message}`);

    // Kiểm tra và chuyển đổi message nếu nó là Buffer
    let jsonMessage;
    if (Buffer.isBuffer(message)) {
      message = message.toString(); // Chuyển buffer thành chuỗi
    }
    try {
      // Cố gắng parse message thành JSON
      jsonMessage = JSON.parse(message);
    } catch (err) {
      console.error('Invalid JSON format received:', err);
      return; // Dừng xử lý nếu không phải JSON hợp lệ
    }
    // Gửi JSON đến tất cả client đang kết nối
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(jsonMessage));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
