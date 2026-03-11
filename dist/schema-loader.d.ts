export interface LoadedSchemas {
    osi: Record<string, unknown>;
    osiRaw: string;
    dbt: Record<string, unknown>;
    dbtRaw: string;
    osiSource: "remote" | "local";
    dbtSource: "remote" | "local";
}
export declare function loadSchemas(): Promise<LoadedSchemas>;
