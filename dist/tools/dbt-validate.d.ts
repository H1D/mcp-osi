type ToolResult = {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
export declare function initDbtValidator(schema: Record<string, unknown>): void;
export declare function handleDbtValidate(args: {
    schema_content: string;
    format?: string;
}): ToolResult;
export {};
