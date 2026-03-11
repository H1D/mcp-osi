type ToolResult = {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
export declare function handleDbtValidate(args: {
    schema_content: string;
    format?: string;
}): ToolResult;
export {};
