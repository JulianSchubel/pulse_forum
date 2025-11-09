import io, { Socket } from "socket.io-client";
import type { Post, Comment } from "@src/types";

export class SocketClient {
    private static socket: Socket | null = null;

    public static connect(): Socket {
        if (!SocketClient.socket) {
            console.log("Connecting to socket server...");

            SocketClient.socket = io("http://localhost:9000", {
                transports: ["websocket"],
                withCredentials: true,
                autoConnect: true,
            });

            SocketClient.socket.on("connect", () => {
                console.log("Connected to web socket:", SocketClient.socket?.id);
            });

            SocketClient.socket.on("disconnect", (reason) => {
                console.log("Disconnected from web socket:", reason);
            });
        }

        return SocketClient.socket;
    }

    public static disconnect(): void {
        if (SocketClient.socket) {
            console.log("Disconnecting socket...");
            SocketClient.socket.disconnect();
            SocketClient.socket = null;
        }
    }

    public static onPostCreated(handler: (post: Post) => void): void {
        SocketClient.socket?.on("postCreated", handler);
    }

    public static onCommentCreated(handler: (comment: Comment) => void): void {
        SocketClient.socket?.on("commentCreated", handler);
    }

    public static onPostLiked(handler: (like: any) => void): void {
        SocketClient.socket?.on("postLiked", handler);
    }

    public static onPostFlagged(handler: (flag: any) => void): void {
        SocketClient.socket?.on("postFlagged", handler);
    }

    public static offPostCreated(handler?: (post: Post) => void): void {
        SocketClient.socket?.off("postCreated", handler);
    }

    public static offCommentCreated(handler?: (comment: Comment) => void): void {
        SocketClient.socket?.off("commentCreated", handler);
    }
}

