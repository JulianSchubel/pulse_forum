import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { Config } from "@/config/config";
import { generateRandomString } from "@/utilities/generate_random_string";
import { immutable } from "./decorators";

const defaultCharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const scryptAsync = promisify(scrypt);

export type PasswordValidatorFn = (s: string) => boolean;

export interface PasswordOptions {
    characterSet?: string;
    /* set if repitions are allowed */
    withRepitition?: boolean;
    /* return true if the generated password passes validation, else false. */
    validator?: PasswordValidatorFn;
}

@immutable
export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(Config.PASSWORD_SALT_LENGTH).toString("hex");
        const buf = (await scryptAsync(password, salt, Config.SCRYPT_KEY_LENGTH)) as Buffer;
        return `${buf.toString("hex")}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split(".");
        const buf = (await scryptAsync(suppliedPassword, salt, Config.SCRYPT_KEY_LENGTH)) as Buffer;
        return buf.toString("hex") === hashedPassword;
    }

    static async digestLength() {
        /* 
         * ∙ scrypt key length is in octets
         * ∙ 2 hex chars per octet 
         * ∙ +1 for '.' delimiter
         * ∙ output length is the number of chars
        * */
        return ((Config.SCRYPT_KEY_LENGTH + Config.PASSWORD_SALT_LENGTH) * 2) + 1
    }

    static async generatePassword(length: number, opts?: PasswordOptions) {
        let charSet: string = opts?.characterSet ?? defaultCharSet;
        let result: string = "";
        let validated = false;
        let loopUpperBound = 100;
        let generator;

        if (opts?.withRepitition === false) {
            generator = () => {
                /* only mutate the function local copy */
                let _charSet = charSet.slice(0);
                let n_chars = _charSet.length;
                let temp = ""
                let charIndex;
                for (let i = 0; i < length; i++) {
                    charIndex = Math.floor(Math.random() * n_chars);
                    temp += _charSet.charAt(charIndex);
                    _charSet = _charSet.slice(0, charIndex) + _charSet.slice(charIndex + 1);
                    n_chars -= 1;
                }
                result = temp;
            };
        } else {
            generator = () => {
                result = generateRandomString(length, charSet);
            };
        }

        while (!validated && loopUpperBound > 0) {
            generator();
            validated = opts?.validator !== undefined ? opts.validator(result) : true;
            loopUpperBound -= 1;
        }
        return result;
    }
}

