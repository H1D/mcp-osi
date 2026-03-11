type ToolResult = {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
interface DatasetInput {
    name: string;
    model: string;
    primary_entity?: string;
    description?: string;
}
export declare function handleDbtScaffold(args: {
    model_name: string;
    description?: string;
    datasets?: DatasetInput[];
    format?: string;
}): ToolResult;
export {};
