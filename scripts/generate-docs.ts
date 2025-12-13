import { Project, SyntaxKind } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
    skipAddingFilesFromTsConfig: true,
});

const SOURCE_DIRS = ["app", "lib", "components", "actions"];
const OUTPUT_DIR = path.join(process.cwd(), "docs", "reference");

async function generateDocs() {
    console.log("🚀 Starting documentation generation...");

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const dir of SOURCE_DIRS) {
        const dirPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(dirPath)) continue;

        // Add files to project
        const files = project.addSourceFilesAtPaths(`${dir}/**/*.{ts,tsx}`);

        for (const sourceFile of files) {
            const relativePath = path.relative(process.cwd(), sourceFile.getFilePath());
            const baseName = path.basename(relativePath, path.extname(relativePath));
            const docPath = path.join(OUTPUT_DIR, path.dirname(relativePath));

            if (!fs.existsSync(docPath)) {
                fs.mkdirSync(docPath, { recursive: true });
            }

            const mdContent = generateMarkdownForFile(sourceFile, relativePath);
            if (mdContent) {
                fs.writeFileSync(path.join(docPath, `${baseName}.md`), mdContent);
                console.log(`✅ Generated: ${relativePath}`);
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateMarkdownForFile(sourceFile: any, relativePath: string): string | null {// ignore-any-check
    const exports = sourceFile.getExportedDeclarations();
    if (exports.size === 0) return null;

    let md = `# ${path.basename(relativePath)}\n\n`;
    md += `**Path**: \`${relativePath}\`\n\n`;

    // Get file description from top-level comments
    const fileComments = sourceFile.getStatements()[0]?.getLeadingCommentRanges();
    if (fileComments && fileComments.length > 0) {
        md += `${fileComments[0].getText()}\n\n`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exports.forEach((declarations: any[], name: string) => { // ignore-any-check
        declarations.forEach((decl) => {
            md += `## ${name}\n\n`;

            // Type/Kind
            md += `**Type**: \`${decl.getKindName()}\`\n\n`;

            // JSDoc / TSDoc
            const jsDocs = decl.getJsDocs ? decl.getJsDocs() : [];
            if (jsDocs.length > 0) {
                md += `${jsDocs[0].getDescription().trim()}\n\n`;
            }

            // Signature for functions
            if (decl.getKind() === SyntaxKind.FunctionDeclaration || decl.getKind() === SyntaxKind.ArrowFunction) {
                const signature = decl.getText().split("{")[0].trim();
                md += "```typescript\n" + signature + "\n```\n\n";

                // Parameters
                const params = decl.getParameters();
                if (params.length > 0) {
                    md += "### Parameters\n\n";
                    md += "| Name | Type | Required |\n";
                    md += "|------|------|----------|\n";

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    params.forEach((p: any) => {// ignore-any-check
                        md += `| ${p.getName()} | \`${p.getType().getText()}\` | ${!p.isOptional()} |\n`;
                    });
                    md += "\n";
                }
            }

            // Props for Interfaces
            if (decl.getKind() === SyntaxKind.InterfaceDeclaration) {
                md += "### Properties\n\n";
                md += "| Name | Type |\n";
                md += "|------|------|\n";

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                decl.getProperties().forEach((p: any) => {// ignore-any-check
                    md += `| ${p.getName()} | \`${p.getType().getText()}\` |\n`;
                });
                md += "\n";
            }
        });
    });

    return md;
}

generateDocs().catch(console.error);
