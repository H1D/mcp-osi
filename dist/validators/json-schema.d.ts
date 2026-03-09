export interface ValidationError {
    type: "schema" | "uniqueness" | "reference";
    path: string;
    message: string;
}
export declare function validateJsonSchema(data: unknown): ValidationError[];
