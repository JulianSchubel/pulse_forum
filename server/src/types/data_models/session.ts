import { Role } from "../role";

export type Session = {
    valid: boolean,
    userId: number,
    username: string,
    role: Role,
    sessionId: string,
};

