import express, { Express } from "express";
import cors from "cors";
import http from "http";
import { config } from "dotenv";
import { Config } from "@config/config";
import {
    CommentsRouter,
    AuthRouter,
    PostsRouter,
} from "@/routes";
import { 
    globalErrorHandler, 
    resultHandlerMiddleware, 
    restrictRoles,
} from "@/middleware";
import { notFoundHandler } from "./middleware/not_found_handler";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import { authenticationHandler } from "./middleware/authentication_handler";
import { Role } from "./types/role";
import { SocketService } from "./services/socket";

config();
const app: Express = express();
const server = http.createServer(app);
SocketService.initialize(server);

app.set("trust proxy", 1);
app.use(cookieParser(Config.COOKIE_SECRET));
app.use(
    cookieSession({
        signed: true,
        keys: [Config.COOKIE_SECRET],
        sameSite: "lax",
    })
);

app.use(cors(Config.CORS_OPTIONS));
app.use(express.json());
app.disable("x-powered-by");
app.use(resultHandlerMiddleware);
app.use(`${Config.BASE_PATH}/auth`, AuthRouter);
app.use(`${Config.BASE_PATH}/comments`, [authenticationHandler], CommentsRouter);
app.use(`${Config.BASE_PATH}/posts`, PostsRouter);
app.use(`${Config.BASE_PATH}/flag`, [authenticationHandler, restrictRoles(Role.MODERATOR, Role.ADMIN)])
app.use(globalErrorHandler);
app.use(notFoundHandler);

const start = async () => {
    server.listen(Config.PORT, () => {
        console.log(`Server listening on port ${Config.PORT}...`);
    });
}

start();
