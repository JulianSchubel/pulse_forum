import { createPool, format, QueryOptions, Pool } from "mysql2/promise";
import { Config } from "@/config/config";
import { SystemError } from "@/errors/system";
import { Result } from "@/types";

export class DatabaseConnection {
    private static options = Config.MYSQL_OPTIONS;
    private static pool: Pool = createPool(DatabaseConnection.options);

    protected static async query(sql: string | QueryOptions, args: any[] = []): Promise<Result<any, SystemError>> {
        try {
            if (typeof sql === "string") {
                const [response] = (await DatabaseConnection.pool.query(sql, args)) as any;
                return Result.ok(response);
            } else {
                const query = format(sql.sql, sql.values);
                const [response] = (await DatabaseConnection.pool.query(query)) as any;
                return Result.ok(response);
            }
        } catch (error: any) {
            return Result.error(new SystemError(error.message, error));
        }
    }

    protected async callProcedure<T>(
        procedureName: string,
        params?: unknown[] | null
    ): Promise<Result<T, Error>> {
        try {
            const args = Array.isArray(params) ? params : [];
            const placeholders = args.length > 0 ? args.map(() => "?").join(",") : "";
            const sql = `CALL ${procedureName}(${placeholders});`;

            const [[[result]]] = await DatabaseConnection.pool.query(sql, args) as any;
            console.log("Db result:", result);
            /* expect a single JSON record from the database */
            return Result.ok(result.json_result as NonNullable<T>);
        } catch (error) {
            return Result.error(error as Error);
        }
    }
}
