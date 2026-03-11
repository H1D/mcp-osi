export declare function initDbtSpecInfo(schemaRaw: string): void;
export declare function handleDbtSpecInfo(args: {
    section?: string;
}): {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
