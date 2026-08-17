import rateLimit from "express-rate-limit";
import securityConfig from "../config/security.js";

const rateLimitMiddleware = rateLimit(securityConfig.rateLimit);

export default rateLimitMiddleware;
