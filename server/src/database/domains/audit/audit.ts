import { DatabaseService } from "@/database/service";
import { Result } from "@/types";
import { Flag } from "@/types/data_models/flag";
import { DatabaseFunctions } from "@/types/database_functions";


export interface AuditDomainInterface {
    getAllFlags(): Promise<Result<Flag[], Error>>;
}

export class AuditDatabaseDomain extends DatabaseService implements AuditDomainInterface {
    async getAllFlags() {
        return this.callProcedure<Flag[]>(DatabaseFunctions.AUDIT_GET_FLAGS);
    }
}
