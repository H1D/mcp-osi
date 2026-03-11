export declare function initOsiSpecInfo(schemaRaw: string): void;
export declare function handleSpecInfo(args: {
    section?: string;
}): {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
