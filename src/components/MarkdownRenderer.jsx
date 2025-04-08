import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link } from 'react-router-dom';
import mermaid from 'mermaid';
import './MarkdownRenderer.css'; // 我们将添加一些样式

// 初始化mermaid配置
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'monospace',
  htmlLabels: true,
  logLevel: 5 // 设置日志级别为debug以帮助诊断问题
});

// 自定义插件，处理提示块指令
const remarkAdmonitionsPlugin = () => {
  return (tree) => {
    const visit = (node, index, parent) => {
      // 检查是否为blockquote节点
      if (node.type === 'blockquote' && node.children && node.children.length > 0) {
        const firstChild = node.children[0];
        
        // 检查第一个子节点是否为段落，且包含[!TYPE]格式的文本
        if (firstChild.type === 'paragraph' && 
            firstChild.children && 
            firstChild.children.length > 0 && 
            firstChild.children[0].type === 'text') {
          
          const text = firstChild.children[0].value;
          const match = text.match(/^\[!(.*?)\]/);
          
          if (match) {
            const admonitionType = match[1].toUpperCase();
            
            // 提取标记后的文本内容
            const remainingText = text.replace(/^\[!.*?\]\s*/, '');
            
            // 如果标记后有内容，将其添加为新的段落到内容中
            if (remainingText.trim()) {
              // 修改第一个子节点，只包含剩余文本
              firstChild.children[0].value = remainingText;
            } else {
              // 如果标记后没有内容，移除整个段落
              node.children.shift();
            }
            
            // 设置节点的类型和元数据
            node.type = 'admonition';
            node.admonitionType = admonitionType;
            node.data = {
              hName: 'div',
              hProperties: {
                className: ['admonition', `admonition-${admonitionType.toLowerCase()}`]
              }
            };
            
            // 添加标题节点
            const headingNode = {
              type: 'admonitionHeading',
              children: [], // 移除类型文本，留空数组
              data: {
                hName: 'div',
                hProperties: {
                  className: 'admonition-heading'
                }
              }
            };
            
            // 添加内容容器节点
            const contentNode = {
              type: 'admonitionContent',
              children: [...node.children],
              data: {
                hName: 'div',
                hProperties: {
                  className: 'admonition-content'
                }
              }
            };
            
            // 更新节点的子节点
            node.children = [headingNode, contentNode];
          }
        }
      }
      
      // 递归访问子节点
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          visit(node.children[i], i, node);
        }
      }
    };
    
    visit(tree, 0, null);
  };
};

// 使用try-catch封装的mermaid渲染函数，防止全局崩溃
const safeRenderMermaid = async (id, chart, fallbackContainer) => {
  try {
    // 尝试渲染图表
    const { svg } = await mermaid.mermaidAPI.render(id, chart);
    return { success: true, svg };
  } catch (error) {
    console.warn('Mermaid安全渲染失败，使用回退方案:', error);
    
    // 如果提供了回退容器，则显示原始代码
    if (fallbackContainer) {
      fallbackContainer.innerHTML = `
        <div class="mermaid-fallback">
          <div class="mermaid-error-message">图表渲染失败，显示原始代码:</div>
          <pre class="mermaid-code">${chart.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </div>
      `;
    }
    
    return { success: false, error };
  }
};

// Mermaid图表渲染组件
const MermaidRenderer = ({ chart }) => {
  const mermaidRef = useRef(null);
  
  useEffect(() => {
    let timer;
    let isMounted = true; // 跟踪组件是否仍然挂载
    
    const renderMermaid = async () => {
      if (!mermaidRef.current || !isMounted) return;
      
      try {
        // 清空容器
        mermaidRef.current.innerHTML = '';
        
        // 创建唯一ID
        const id = `mermaid-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        
        // 创建中间容器元素
        const containerDiv = document.createElement('div');
        containerDiv.className = 'mermaid-inner-container';
        containerDiv.style.width = '100%';
        containerDiv.style.height = 'auto';
        containerDiv.style.visibility = 'hidden'; // 先隐藏以避免闪烁
        mermaidRef.current.appendChild(containerDiv);
        
        // 先确保DOM更新，然后渲染
        await new Promise(resolve => setTimeout(resolve, 50));
        
        if (!isMounted) return; // 再次检查是否仍然挂载
        
        // 安全渲染mermaid图表
        const result = await safeRenderMermaid(id, chart, containerDiv);
        
        if (!isMounted) return; // 再次检查是否仍然挂载
        
        if (result.success) {
          containerDiv.innerHTML = result.svg;
        }
        
        // 显示容器，无论成功与否
        containerDiv.style.visibility = 'visible';
        
      } catch (error) {
        console.error('Mermaid整体处理错误:', error);
        if (mermaidRef.current && isMounted) {
          mermaidRef.current.innerHTML = `
            <div class="error-message">
              图表处理失败: ${error.message || '未知错误'}
            </div>
          `;
        }
      }
    };
    
    // 延迟执行以确保DOM已准备好
    timer = setTimeout(renderMermaid, 100);
    
    return () => {
      isMounted = false; // 标记组件已卸载
      clearTimeout(timer);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = '';
      }
    };
  }, [chart]);
  
  return (
    <div className="mermaid-container">
      <div className="mermaid-diagram" ref={mermaidRef} />
    </div>
  );
};

const MarkdownRenderer = ({ content }) => {
  // 图标映射
  const admonitionIcons = {
    WARNING: '⚠️',
    IMPORTANT: '❗',
    CAUTION: '🔥',
    NOTE: 'ℹ️',
    TIP: '💡'
  };

  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkGfm,
        remarkDirective,
        remarkAdmonitionsPlugin
      ]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // 自定义提示块渲染
        admonition: ({ node, ...props }) => {
          const type = node.admonitionType;
          return <div {...props} className={`admonition admonition-${type.toLowerCase()}`} />;
        },
        admonitionHeading: ({ node, ...props }) => {
          const type = node.parent.admonitionType;
          const icon = admonitionIcons[type] || '';
          return (
            <div {...props} className="admonition-heading">
              {icon && <span className="admonition-icon">{icon}</span>}
            </div>
          );
        },
        admonitionContent: ({ node, ...props }) => {
          return <div {...props} className="admonition-content" />;
        },
        // 自定义代码块渲染
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const code = String(children).replace(/\n$/, '');

          // 处理Mermaid图表
          if (!inline && match && match[1] === 'mermaid') {
            return <MermaidRenderer chart={code} />;
          }

          return !inline && match ? (
            <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="rounded-lg overflow-hidden my-4 shadow-lg"
            customStyle={{
              padding: '1.5rem',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              backgroundColor: '#1E1E1E',
            }}
            showLineNumbers={true}
            wrapLines={true}
            wrapLongLines={true}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              backgroundColor: '#1E1E1E',
              color: '#606366',
              textAlign: 'right'
            }}
            lineProps={{
              style: { 
                backgroundColor: '#1E1E1E',
                width: '100%'
              }
            }}
              {...props}
            >
              {code}
            </SyntaxHighlighter>
          ) : (
            <code className="px-2 py-1 font-mono bg-gray-100 dark:bg-gray-800 rounded-md" {...props}>
              {children}
            </code>
          );
        },
        // 自定义链接渲染
        a({ node, ...props }) {
          const href = props.href || '';
          const isInternalLink = href.startsWith('/') || href.startsWith('#');
          
          if (isInternalLink) {
            return (
              <Link
                to={href}
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {props.children}
              </Link>
            );
          }
          
          return (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
              {...props}
            />
          );
        },
        // 自定义标题渲染
        h1({ node, children, ...props }) {
          // 处理可能存在的ID
          const idMatch = String(children).match(/{#([\w-]+)}/);
          let id = null;
          let cleanChildren = children;
          
          if (idMatch) {
            id = idMatch[1];
            cleanChildren = String(children).replace(/{#[\w-]+}/, '').trim();
          }
          
          return <h1 id={id} className="text-3xl font-bold mt-8 mb-4" {...props}>{cleanChildren}</h1>;
        },
        h2({ node, children, ...props }) {
          // 处理可能存在的ID
          const idMatch = String(children).match(/{#([\w-]+)}/);
          let id = null;
          let cleanChildren = children;
          
          if (idMatch) {
            id = idMatch[1];
            cleanChildren = String(children).replace(/{#[\w-]+}/, '').trim();
          }
          
          return <h2 id={id} className="text-2xl font-bold mt-6 mb-3" {...props}>{cleanChildren}</h2>;
        },
        h3({ node, children, ...props }) {
          // 处理可能存在的ID
          const idMatch = String(children).match(/{#([\w-]+)}/);
          let id = null;
          let cleanChildren = children;
          
          if (idMatch) {
            id = idMatch[1];
            cleanChildren = String(children).replace(/{#[\w-]+}/, '').trim();
          }
          
          return <h3 id={id} className="text-xl font-bold mt-5 mb-2" {...props}>{cleanChildren}</h3>;
        },
        // 自定义表格渲染
        table({ node, ...props }) {
          return <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm my-6" {...props} />;
        },
        thead({ node, ...props }) {
          return <thead className="bg-gray-100 dark:bg-gray-800" {...props} />;
        },
        tbody({ node, ...props }) {
          return <tbody className="divide-y divide-gray-300 dark:divide-gray-700" {...props} />;
        },
        tr({ node, ...props }) {
          return <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50" {...props} />;
        },
        th({ node, ...props }) {
          return <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700" {...props} />;
        },
        td({ node, ...props }) {
          return <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100" {...props} />;
        },
        // 自定义段落渲染
        p({ node, ...props }) {
          return <p className="my-4 text-gray-700 dark:text-gray-300" {...props} />;
        },
        // 自定义列表渲染
        ul({ node, ...props }) {
          return <ul className="list-disc pl-8 my-4 text-gray-700 dark:text-gray-300" {...props} />;
        },
        ol({ node, ...props }) {
          return <ol className="list-decimal pl-8 my-4 text-gray-700 dark:text-gray-300" {...props} />;
        },
        li({ node, ...props }) {
          return <li className="my-1" {...props} />;
        },
        // 自定义引用渲染
        blockquote({ node, ...props }) {
          return <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1 my-4 italic text-gray-700 dark:text-gray-400" {...props} />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer; 