export type ApiResponse<T> = {
    status: number;
    msg: string;
    isError: boolean;
    body: T;
}
