import { Project, SyntaxKind, SourceFile, ExportedDeclarations } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const project = new Project({
    // tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"), // Removed dependency on root tsconfig
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
        allowJs: true,
    }
});

const SOURCE_DIRS = [
    "apps/web/app",
    "apps/web/components",
    "apps/web/lib",
    "apps/api/src",
    "packages/db/src",
    "packages/logger/src",
    "packages/storage/src",
    "packages/validation/src"
];
const OUTPUT_DIR = path.join(process.cwd(), "docs", "reference");

async function generateDocs() {
    try {
        console.log("🚀 Starting documentation generation...");

        // Ensure output directory exists
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        for (const dir of SOURCE_DIRS) {
            const dirPath = path.join(process.cwd(), dir);
            if (!fs.existsSync(dirPath)) {
                console.warn(`⚠️ Directory not found: ${dirPath}`);
                continue;
            }

            console.log(`📂 Processing directory: ${dir}`);

            // Add files to project
            const globPattern = `${dir}/**/*.{ts,tsx}`;
            console.log(`   Glob: ${globPattern}`);

            try {
                const files = project.addSourceFilesAtPaths(globPattern);
                console.log(`   Found ${files.length} files.`);

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
                        console.log(`   ✅ Generated: ${relativePath}`);
                    }
                }
            } catch (err) {
                console.error(`   ❌ Error processing ${dir}:`, err);
            }
        }
    } catch (error) {
        console.error("🔥 Fatal error:", error);
        process.exit(1);
    }
}

function generateMarkdownForFile(sourceFile: SourceFile, relativePath: string): string | null {
    const exports = sourceFile.getExportedDeclarations();
    if (exports.size === 0) return null;

    let md = `# ${path.basename(relativePath)}\n\n`;
    md += `**Path**: \`${relativePath}\`\n\n`;

    // Get file description from top-level comments
    const fileComments = sourceFile.getStatements()[0]?.getLeadingCommentRanges();
    if (fileComments && fileComments.length > 0) {
        md += `${fileComments[0].getText()}\n\n`;
    }

    exports.forEach((declarations: ExportedDeclarations[], name: string) => {
        declarations.forEach((decl) => {
            md += `## ${name}\n\n`;

            // Type/Kind
            md += `**Type**: \`${decl.getKindName()}\`\n\n`;

            // JSDoc / TSDoc
            // @ts-expect-error - getJsDocs might not exist on all types in the union, but we check existence
            const jsDocs = decl.getJsDocs ? decl.getJsDocs() : [];
            if (jsDocs.length > 0) {
                md += `${jsDocs[0].getDescription().trim()}\n\n`;
            }

            // Signature for functions
            if (decl.getKind() === SyntaxKind.FunctionDeclaration || decl.getKind() === SyntaxKind.ArrowFunction) {
                const signature = decl.getText().split("{")[0].trim();
                md += "```typescript\n" + signature + "\n```\n\n";

                // Parameters
                const functionDecl = decl.asKind(SyntaxKind.FunctionDeclaration) || decl.asKind(SyntaxKind.ArrowFunction);
                if (functionDecl) {
                    const params = functionDecl.getParameters();
                    if (params.length > 0) {
                        md += "### Parameters\n\n";
                        md += "| Name | Type | Required |\n";
                        md += "|------|------|----------|\n";

                        params.forEach((p) => {
                            md += `| ${p.getName()} | \`${p.getType().getText()}\` | ${!p.isOptional()} |\n`;
                        });
                        md += "\n";
                    }
                }
            }

            // Props for Interfaces
            if (decl.getKind() === SyntaxKind.InterfaceDeclaration) {
                md += "### Properties\n\n";
                md += "| Name | Type |\n";
                md += "|------|------|\n";

                const interfaceDecl = decl.asKind(SyntaxKind.InterfaceDeclaration);
                if (interfaceDecl) {
                    interfaceDecl.getProperties().forEach((p) => {
                        md += `| ${p.getName()} | \`${p.getType().getText()}\` |\n`;
                    });
                    md += "\n";
                }
            }
        });
    });

    return md;
}

generateDocs().catch(console.error);
