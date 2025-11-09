import { immutable } from "@utilities/decorators";
import { randomUUID } from "crypto";
import { PoolOptions } from "mysql2";

@immutable
export class Config {
    public static readonly PORT: number = 9000;

    /**
     * Minimum recommended salt length for SCRYPT algorithm is 16 bytes
     */
    public static readonly PASSWORD_SALT_LENGTH: number = 16;

    /* Scrypt algorithm intended output length in octets of the derived key
     * ∙ see RFC7914
     */
    public static readonly SCRYPT_KEY_LENGTH: number = 64;

    /**
     * Database connection pool configuration
     * */
    public static readonly MYSQL_OPTIONS: PoolOptions = {
        user: process.env.DB_USER || "forum_user",
        password: process.env.DB_PASSWORD || "forum_password",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "forum",
        connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 25,
        multipleStatements:
            process.env.DB_MULTIPLE_STATEMENTS?.toLowerCase() === "true"
                ? true
                : false,
        enableKeepAlive: true,
    };

    /* 
     * Generate a cookie secret on application start 
     * */
    public static readonly COOKIE_SECRET = randomUUID();

    /* 
     * CORS options 
     * */
    public static readonly CORS_OPTIONS = {
        /* frontend origin */
        origin: [
            `http://localhost:3000`,
        ],
        methods: ["GET", "PUT", "POST", "PATCH", "OPTIONS", "HEAD"],
        /* allow cookies/sessions */
        credentials: true,
    };

    /* Base path for the API */
    public static readonly BASE_PATH = '/api';
}

