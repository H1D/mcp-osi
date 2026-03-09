export declare const SPEC_INFO_TOOL: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            section: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
        };
        required: never[];
    };
};
export declare function handleSpecInfo(args: {
    section?: string;
}): {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
