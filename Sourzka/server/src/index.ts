import { createServer } from "http";
import { config } from "./config";
import mainApp from "./app";
const PORT = config.PORT;

// Http Server
const server = createServer(mainApp);

// Socket.io Server in future for notification and real-time updates
// const io = initializeSocketIo(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
