import fs from 'fs';
import path from 'path';

const WEB_DIR = path.join(process.cwd(), 'apps/web');
const FORBIDDEN_PATTERNS = [
    'localhost:4000',
    '127.0.0.1:4000',
    ':4000',
];

// Files to exclude (like this script itself if it were in apps/web, or env files)
const EXCLUDE_FILES = [
    '.env',
    '.env.example',
    '.env.local',
    'internal-api.ts', // The helper itself is allowed to use the env var
    'check-internal-api-usage.ts',
    'pnpm-lock.yaml',
    'env.ts', // Allowed to define default
];

const EXCLUDE_DIRS = [
    'node_modules',
    '.next',
    '.git',
    '.turbo',
];

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!EXCLUDE_DIRS.includes(file)) {
                getAllFiles(fullPath, arrayOfFiles);
            }
        }
        else if (!EXCLUDE_FILES.some(ex => file.endsWith(ex) || file === ex)) {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

async function checkFiles() {
    console.log('🔍 Checking for forbidden internal API usage in apps/web...');

    const files = getAllFiles(WEB_DIR);
    const relevantFiles = files.filter(f => /\.(ts|tsx|js|jsx)$/.test(f));

    let hasError = false;

    for (const filePath of relevantFiles) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(WEB_DIR, filePath);

        for (const pattern of FORBIDDEN_PATTERNS) {
            if (content.includes(pattern)) {
                // Double check if it's not the internal-api.ts file (already excluded by name but path might differ)
                if (filePath.endsWith('internal-api.ts')) continue;

                console.error(`❌ Forbidden pattern "${pattern}" found in: ${relativePath}`);
                // Print context
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    if (line.includes(pattern)) {
                        console.error(`   Line ${index + 1}: ${line.trim()}`);
                    }
                });
                hasError = true;
            }
        }
    }

    if (hasError) {
        console.error('🚨 Internal API usage check failed! Please use @/lib/internal-api helper instead of direct URLs.');
        process.exit(1);
    } else {
        console.log('✅ No forbidden internal API usage found.');
    }
}

checkFiles().catch(err => {
    console.error('Script error:', err);
    process.exit(1);
});
