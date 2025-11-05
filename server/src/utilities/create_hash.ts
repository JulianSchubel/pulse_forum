import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const createPasswordHash = async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64) as Buffer);
    console.log(`${buf.toString("hex")}.${salt}`);
}

createPasswordHash("moderator");
createPasswordHash("password");
createPasswordHash("password");
