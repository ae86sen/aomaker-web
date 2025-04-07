import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';

// 文档映射配置
const docMap = {
  // 路径参数: 文档文件名
  'introduction': 'introduction.md',
  'quick-start': 'quick-start.md',
  // 'basic-features': '',
  'basic-features/api-modeling': 'basic-features/api-modeling.md',
  'basic-features/openapi': 'basic-features/openapi.md',
  'basic-features/jsonschema': 'basic-features/jsonschema.md',
  'basic-features/storage': 'basic-features/storage.md',
  'basic-features/auth': 'basic-features/auth.md',
  'basic-features/dashboard': 'basic-features/dashboard.md',
  'basic-features/mock': 'basic-features/mock.md',
  'basic-features/statics': 'basic-features/statics.md',
  'basic-features/report': 'basic-features/report.md',
  'environments': 'environments.md',
  'plugins': 'plugins.md',
  'openapi': 'openapi.md',
  'advanced-features/custom-converter': 'advanced-features/converter.md',
  'advanced-features/cli': 'advanced-features/cli.md',
  'advanced-features/parallel': 'advanced-features/parallel.md',
  'advanced-features/hooks': 'advanced-features/hooks.md',
  'advanced-features/middlewares': 'advanced-features/middlewares.md', 
  'advanced-features/stream': 'advanced-features/stream.md',
  'advanced-features/platform': 'advanced-features/platform.md',

};

const DocContent = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { docId = 'introduction', '*': restPath } = useParams(); // 获取主路径参数和剩余路径
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        // 构建完整路径
        const fullPath = restPath ? `${docId}/${restPath}` : docId;
        
        // 从映射表中获取文档文件名
        const docFileName = docMap[fullPath] || 'introduction.md';
        
        // 加载文档
        const response = await fetch(`/src/content/docs/${docFileName}`);
        
        if (!response.ok) {
          throw new Error(`无法加载文档: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        setContent(text);
        setLoading(false);
      } catch (err) {
        console.error('加载文档失败:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContent();
  }, [docId, restPath]); // 当docId或restPath变化时重新加载

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          <h3 className="text-lg font-medium">加载文档时出错</h3>
          <p className="mt-2">{error}</p>
          <p className="mt-2">请尝试刷新页面或联系网站管理员。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <article className="prose prose-lg dark:prose-invert max-w-none markdown-content">
        <MarkdownRenderer content={content} />
      </article>
    </div>
  );
};

export default DocContent; 