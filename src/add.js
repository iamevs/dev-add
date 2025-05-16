const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
function parseFileInput(input) {
  const match = input.match(/^(.*?)\/\[(.*)\](\.tsx)?$/);
  if (match) {
    const basePath = match[1];
    const items = match[2].split(',').map(s => s.trim());
    const ext = match[3] || '';
    return items.map(name => `${basePath}/${name}${ext}`);
  } else {
    return [input];
  }
}
async function ensureIndexFile(folderPath) {
  const indexPath = path.join(folderPath, 'index.js');
  if (!(await fs.pathExists(indexPath))) {
    await fs.writeFile(indexPath, '', 'utf8');
  }
  return indexPath;
}
async function rebuildIndex(indexPath) {
  const folder = path.dirname(indexPath);
  const files = await fs.readdir(folder);
  const componentFiles = files
    .filter(f => f !== 'index.js')
    .filter(f => /\.(tsx|ts|js)$/.test(f));
  const imports = componentFiles.map(f => {
    const name = path.basename(f, path.extname(f));
    return `import ${name} from './${name}';`;
  });
  const exports = `export { ${componentFiles.map(f => path.basename(f, path.extname(f))).join(', ')} };`;
  const content = `${imports.join('\n')}\n\n${exports}\n`;
  await fs.writeFile(indexPath, content, 'utf8');
}
function findPackageJson(startDir) {
  let dir = startDir;

  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      return true;
    }
    dir = path.dirname(dir);
  }

  return false;
}
function resolveAliasPath(inputPath) {
  const cwd = process.cwd();
  const tsconfigPath = path.join(cwd, 'tsconfig.json');
  const jsconfigPath = path.join(cwd, 'jsconfig.json');
  let configPath = null;
  if (fs.existsSync(tsconfigPath)) {
    configPath = tsconfigPath;
  } else if (fs.existsSync(jsconfigPath)) {
    configPath = jsconfigPath;
  }
  if (!configPath) {
    return inputPath;
  }
  const config = fs.readJsonSync(configPath);
  const paths = config.compilerOptions?.paths || config.paths || {};
  for (const alias in paths) {
    const cleanAlias = alias.replace('/*', '');
    const targetPaths = paths[alias];
    if (inputPath.startsWith(`${cleanAlias}/`)) {
      const target = targetPaths[0].replace('/*', '');
      const resolved = inputPath.replace(`${cleanAlias}/`, target + '/');
      return resolved;
    }
  }
  return inputPath;
}
function getTemplateContent(name, filename, options) {
  const baseName = path.basename(filename, path.extname(filename));

  if (options.named) {
    return `export const ${baseName} = () => {\n  return null;\n};\n`;
  }

  if (name === 'react-component') {
    return `const ${capitalize(baseName)} = () => {\n  return <div>${capitalize(baseName)}</div>;\n};\n\nexport default ${capitalize(baseName)};\n`;
  }

  return `// ${filename}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  getTemplateContent
};

async function addFiles(inputPath, options = {}) {
  const cwd = process.cwd();

  if (!findPackageJson(cwd)) {
    console.log(chalk.red('✖ Error: package.json not found. Make sure you are inside a Node.js project.'));
    process.exit(1);
  }

  const resolvedPath = resolveAliasPath(inputPath);
  const files = parseFileInput(resolvedPath, options.ext ? `.${options.ext}` : '.tsx');

  for (const file of files) {
    const fullPath = path.resolve(process.cwd(), file);
    const folder = path.dirname(fullPath);
    const filename = path.basename(fullPath);

    const content = getTemplateContent(options.template, filename, options);

    if (!(await fs.pathExists(fullPath))) {
      await fs.ensureDir(folder);
      if (options.dry) {
        console.log(chalk.gray(`[dry] Would create: ${file}`));
      } else {
        await fs.writeFile(fullPath, content, 'utf8');
      }
      console.log(chalk.green(`✔ Created: ${file}`));
    } else {
      console.log(chalk.yellow(`⚠ Already exists: ${file}`));
    }

    const indexPath = await ensureIndexFile(folder);
    await rebuildIndex(indexPath);
    console.log(chalk.cyan(`↪ Updated: ${path.relative(process.cwd(), indexPath)}`));
  }
}

module.exports = { addFiles };
