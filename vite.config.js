import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// 创建一个简单的插件来复制文件
function copyMarkdownPlugin() {
  return {
    name: 'copy-markdown-files',
    closeBundle() {
      // 确保目标目录存在
      const targetDir = path.resolve(__dirname, 'dist/content/docs');
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // 源目录
      const sourceDir = path.resolve(__dirname, 'src/content/docs');
      
      // 复制文件函数
      function copyDir(src, dest) {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          
          if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath, { recursive: true });
            }
            copyDir(srcPath, destPath);
          } else if (entry.name.endsWith('.md')) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${srcPath} -> ${destPath}`);
          }
        }
      }
      
      // 开始复制
      if (fs.existsSync(sourceDir)) {
        copyDir(sourceDir, targetDir);
        console.log('Markdown files copied successfully!');
      } else {
        console.warn(`Source directory does not exist: ${sourceDir}`);
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copyMarkdownPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.md'],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(md)$/i.test(assetInfo.name)) {
            return `content/docs/[name][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    copyPublicDir: true,
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
}); 