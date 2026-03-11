export interface ValidationError {
    type: "schema" | "uniqueness" | "reference";
    path: string;
    message: string;
}
export declare function initOsiValidator(schema: Record<string, unknown>): void;
export declare function validateJsonSchema(data: unknown): ValidationError[];
