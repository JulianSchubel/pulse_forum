import { Role } from "../role";

export type Session = {
    valid: boolean,
    userId: number,
    role: Role,
    sessionId: string,
};

