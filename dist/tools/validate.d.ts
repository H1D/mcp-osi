type ToolResult = {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
export declare function handleValidate(args: {
    schema_content: string;
    format?: string;
}): ToolResult;
export {};
