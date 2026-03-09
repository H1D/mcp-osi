export declare const SCAFFOLD_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            model_name: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            datasets: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                            description: string;
                        };
                        source: {
                            type: string;
                            description: string;
                        };
                        description: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
            format: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
        };
        required: string[];
    };
};
interface DatasetInput {
    name: string;
    source: string;
    description?: string;
}
export declare function handleScaffold(args: {
    model_name: string;
    description?: string;
    datasets?: DatasetInput[];
    format?: string;
}): {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
export {};
