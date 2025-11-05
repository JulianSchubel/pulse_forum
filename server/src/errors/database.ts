export class DatabaseError extends Error {
  public readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "DatabaseError";
    this.code = code;
  }

  static from(err: unknown): DatabaseError {
    if (err instanceof DatabaseError) return err;

    const message =
      err && typeof err === "object" && "message" in err
        ? (err as Error).message
        : "Unexpected database error.";

    const code = (err as any)?.code ?? "UNKNOWN";
    let friendly = "An unexpected database error occurred.";

    switch (code) {
      case "ER_DUP_ENTRY":
        friendly = "A record with this value already exists.";
        break;
      case "ER_NO_REFERENCED_ROW":
      case "ER_NO_REFERENCED_ROW_2":
        friendly = "Referenced record not found.";
        break;
      case "PROTOCOL_CONNECTION_LOST":
        friendly = "Database connection was lost.";
        break;
      case "ECONNREFUSED":
        friendly = "Database connection was refused.";
        break;
    }

    return new DatabaseError(friendly, code);
  }
}

