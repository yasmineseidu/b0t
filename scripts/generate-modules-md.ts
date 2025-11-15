import { getModuleRegistry } from '../src/lib/workflows/module-registry';
import * as fs from 'fs';
import * as path from 'path';

function generateModulesMd(): string {
  const registry = getModuleRegistry();

  let md = '# b0t Modules & Endpoints\n\n';
  md += 'Complete reference of all 16 module categories and 140+ integrated services in the b0t platform.\n\n';
  md += '## Table of Contents\n\n';

  // Generate TOC
  registry.forEach(category => {
    md += `- [${category.name.charAt(0).toUpperCase() + category.name.slice(1)}](#${category.name})\n`;
  });

  md += '\n---\n\n';

  // Generate detailed sections for each category
  registry.forEach(category => {
    const categoryTitle = category.name.charAt(0).toUpperCase() + category.name.slice(1);
    md += `## ${categoryTitle}\n\n`;
    md += `**Modules:** ${category.modules.length} | **Total Functions:** ${category.modules.reduce((sum, m) => sum + m.functions.length, 0)}\n\n`;

    category.modules.forEach(module => {
      md += `### ${module.name}\n\n`;

      if (module.functions.length === 0) {
        md += '*No exported functions*\n\n';
        return;
      }

      module.functions.forEach(func => {
        md += `#### \`${func.signature}\`\n\n`;
        md += `${func.description}\n\n`;

        if (func.example) {
          md += '**Example:**\n```typescript\n';
          // Unescape the example string
          const example = func.example
            .replace(/\\n/g, '\n')
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"');
          md += example;
          md += '\n```\n\n';
        }
      });

      md += '\n';
    });

    md += '---\n\n';
  });

  // Add footer
  md += '## Summary\n\n';
  const totalModules = registry.reduce((sum, cat) => sum + cat.modules.length, 0);
  const totalFunctions = registry.reduce((sum, cat) =>
    sum + cat.modules.reduce((sum2, mod) => sum2 + mod.functions.length, 0), 0);

  md += `- **Total Categories:** ${registry.length}\n`;
  md += `- **Total Modules:** ${totalModules}\n`;
  md += `- **Total Functions:** ${totalFunctions}\n\n`;

  md += '*Generated automatically from module registry*\n';

  return md;
}

// Generate and write the file
const markdown = generateModulesMd();
const outputPath = path.join(__dirname, '..', 'modules.md');
fs.writeFileSync(outputPath, markdown, 'utf-8');

console.log(`✓ Generated modules.md with complete module documentation`);
console.log(`  Location: ${outputPath}`);
