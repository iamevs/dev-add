# 📦 dev add

> A powerful CLI tool to scaffold components or utility files with templates and maintain consistent exports across JavaScript/TypeScript projects.

---

## ✨ Features

- 🚀 Scaffold components/utilities with a single command
- 📂 Supports batch file creation using shorthand like `[Comp1,Comp2]`
- 📦 Automatically updates or creates `index.js` for streamlined exports
- 🎯 Supports React-style templates and named exports
- 🧪 Dry-run mode for previewing actions
- 🧠 Intelligent resolution of alias paths via `tsconfig.json`/`jsconfig.json`

---

## 📦 Installation

```bash
npm install -g dev-add
```

## 🔧 Usage

```bash
dev add <filePath> [options]
```

### Example:

```bash
dev add src/components/[Header,Footer] --template react-component --ext tsx
```

This will:

- Create `Header.tsx` and `Footer.tsx` inside `src/components`
  
- Insert default React component templates
  
- Update or create `index.js` in the same directory
  

---

## ⚙  Options

| Option | Description |
| --- | --- |
| `--ext` | File extension (e.g., `tsx`, `js`, default: `tsx`) |
| `--template` | Template type (e.g., `react-component`) |
| `--named` | Use named exports instead of default |
| `--dry` | Run without writing files (simulation only) |
| `--verbose` | Print detailed logs |
| `--nocomp` | Skip updating or creating `index.js` |

---

## 📁 Template Support

- React Component (`--template react-component`)
  
  ```tsx
  const ComponentName = () => {
   return <div>ComponentName</div>;
  }; 
  
  export default ComponentName;
  ```
  

- With `--named`:
  
  ```tsx
  export const ComponentName = () => {
    return null;
  };
  ```
  

---

## 🔍 Path Alias Resolution

        If your project uses path aliases in `tsconfig.json` or `jsconfig.json` (e.g.,         `@components/*`), the CLI internally resolves it for correct file generation.

---

## 🧪 Development

```bash
# Run locally
npm install
npm run dev add src/utils/[math,parser] --ext ts
```

---

## 📌 Requirements

- Node.js ≥ 14.x
  
- A valid `package.json` in the project root
  

---

## 📃 License

Licensed under the MIT License.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open an [issue](https://github.com/iamevs/dev-add/issues) or submit a PR.

---

## 📈 Future Plans

- Custom template support
  
- Plugin architecture
  
- In-place file updating
  

---

## ⭐ Star This Project

If you find this project useful, please consider starring it on [GitHub](https://github.com/iamevs/dev-add) ⭐
