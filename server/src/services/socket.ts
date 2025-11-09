import { Server } from "socket.io";
import http from "http";
import { Config } from "@/config/config";
import {
    Post,
    Comment,
    Like,
    Flag,
} from "@/types/";

export interface ServerToClientEvents {
    postCreated: (post: any) => void;
    commentCreated: (comment: any) => void;
    postLiked: (like: any) => void;
    postFlagged: (flag: any) => void;
}

/* Not used but included for symmetry */
export interface ClientToServerEvents {
    newPost: (post: any) => void;
    newComment: (comment: any) => void;
    likePost: (like: any) => void;
    flagPost: (flag: any) => void;
}

export class SocketService {
    private static io: Server<ClientToServerEvents, ServerToClientEvents>;
    private static instance: SocketService;
    private static initialized = false;

    private constructor(server: http.Server) {
        SocketService.io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
            cors: Config.CORS_OPTIONS,
        });
        SocketService.registerConnectionHandlers();
    }

    /* Singleton */
    static initialize(server: http.Server) {
        console.log("Initializing web socket server");
        if (!SocketService.instance) {
            SocketService.instance = new SocketService(server);
        }
        return SocketService.instance;
    }

    private static registerConnectionHandlers() {
        /* Handle WS connections */
        SocketService.io.on("connection", (socket) => {
            console.log(`Client connected: ${socket.id}`);

            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });
    }


    /* Public emitters */
    public static async emitPostCreated(post: Post): Promise<void> {
        SocketService.io.emit("postCreated", post);
    }

    public static emitCommentCreated(comment: Comment): void {
        SocketService.io.emit("commentCreated", comment);
    }

    public static emitPostLiked(like: Like): void {
        SocketService.io.emit("postLiked", like);
    }

    public static emitPostFlagged(flag: Flag): void {
        SocketService.io.emit("postFlagged", flag);
    }

    /* Access the IO instance if needed elsewhere */
    public static getIO(): Server<ClientToServerEvents, ServerToClientEvents> {
        return SocketService.io;
    }
}
