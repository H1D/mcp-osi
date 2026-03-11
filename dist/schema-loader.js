import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_URLS = {
    osi: "https://raw.githubusercontent.com/open-semantic-interchange/OSI/main/core-spec/osi-schema.json",
    dbt: "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/dbt_yml_files-latest.json",
};
const LOCAL_PATHS = {
    osi: join(__dirname, "schema/osi-schema.json"),
    dbt: join(__dirname, "schema/dbt-yml-schema.json"),
};
async function fetchWithTimeout(url, timeoutMs = 5000) {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok)
            return null;
        return await res.text();
    }
    catch {
        return null;
    }
}
function loadLocal(key) {
    return JSON.parse(readFileSync(LOCAL_PATHS[key], "utf-8"));
}
export async function loadSchemas() {
    const [osiText, dbtText] = await Promise.all([
        fetchWithTimeout(SCHEMA_URLS.osi),
        fetchWithTimeout(SCHEMA_URLS.dbt),
    ]);
    let osi;
    let osiRaw;
    let osiSource;
    if (osiText) {
        try {
            osi = JSON.parse(osiText);
            osiRaw = osiText;
            osiSource = "remote";
        }
        catch {
            osi = loadLocal("osi");
            osiRaw = JSON.stringify(osi, null, 2);
            osiSource = "local";
        }
    }
    else {
        osi = loadLocal("osi");
        osiRaw = JSON.stringify(osi, null, 2);
        osiSource = "local";
    }
    let dbt;
    let dbtRaw;
    let dbtSource;
    if (dbtText) {
        try {
            dbt = JSON.parse(dbtText);
            dbtRaw = dbtText;
            dbtSource = "remote";
        }
        catch {
            dbt = loadLocal("dbt");
            dbtRaw = JSON.stringify(dbt, null, 2);
            dbtSource = "local";
        }
    }
    else {
        dbt = loadLocal("dbt");
        dbtRaw = JSON.stringify(dbt, null, 2);
        dbtSource = "local";
    }
    return { osi, osiRaw, dbt, dbtRaw, osiSource, dbtSource };
}
