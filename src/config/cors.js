import serverConfig from "./server.js";

const corsConfig = {
  origin: serverConfig.clientUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsConfig;
