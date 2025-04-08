import React, { useState, useEffect, useRef } from 'react';
import MarkdownRenderer from '../components/MarkdownRenderer';

const Releases = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [versions, setVersions] = useState([]);
  const [activeVersion, setActiveVersion] = useState('');
  const contentRef = useRef(null);
  
  // 提取版本信息和添加额外数据
  const extractVersions = (markdownContent) => {
    const versionRegex = /^## (.*?)$/gm;
    const matches = [];
    let match;
    
    while ((match = versionRegex.exec(markdownContent)) !== null) {
      const title = match[1];
      const id = title.replace(/\s+/g, '-').replace(/[^\w\-]/g, '').toLowerCase();
      
      // 提取版本号和日期
      const versionMatch = title.match(/(v\d+\.\d+\.\d+.*?)$/);
      const dateMatch = title.match(/^(\d{4}\.\d{1,2}\.\d{1,2})-/);
      
      matches.push({
        title: title,
        id: id,
        version: versionMatch ? versionMatch[1] : '',
        date: dateMatch ? dateMatch[1] : '',
        isNew: matches.length < 1 // 前2个版本标记为"新"
      });
    }
    
    return matches;
  };
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        // 根据环境选择不同的基础路径
        const basePath = import.meta.env.MODE === 'production' 
          ? '/content/docs/' 
          : '/src/content/docs/';
        
        // 加载发布日志
        const response = await fetch(`${basePath}changelogs.md`);
        
        if (!response.ok) {
          throw new Error(`无法加载发布日志: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        
        // 提取版本标题并设置ID
        const versionsData = extractVersions(text);
        setVersions(versionsData);
        if (versionsData.length > 0) {
          setActiveVersion(versionsData[0].id);
        }
        
        // 处理Markdown内容，为标题添加ID
        const processedContent = text.replace(
          /^## (.*?)$/gm, 
          (match, title) => {
            const id = title.replace(/\s+/g, '-').replace(/[^\w\-]/g, '').toLowerCase();
            return `## ${title} {#${id}}`;
          }
        );
        
        setContent(processedContent);
        setLoading(false);
      } catch (err) {
        console.error('加载发布日志失败:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContent();
  }, []); // 只在组件挂载时加载一次

  const scrollToVersion = (id) => {
    setActiveVersion(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 监控滚动位置，更新活动版本
  useEffect(() => {
    if (!contentRef.current || versions.length === 0) return;
    
    const handleScroll = () => {
      const headings = versions.map(v => document.getElementById(v.id)).filter(Boolean);
      
      // 找到当前在视口中最靠上的标题
      const scrollPosition = window.scrollY + 100; // 添加偏移量以提高准确性
      
      for (let i = 0; i < headings.length; i++) {
        const currentHeading = headings[i];
        const nextHeading = headings[i + 1];
        
        if (!nextHeading || (currentHeading.offsetTop <= scrollPosition && 
            (nextHeading.offsetTop > scrollPosition))) {
          setActiveVersion(versions[i].id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [versions, content]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">正在加载发布日志...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-12">
        <div className="text-red-600 dark:text-red-400 text-xl text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>加载发布日志时出错:</p>
          <p className="text-sm mt-2 text-red-500">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-5 py-2.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 左侧目录栏 */}
      <div className="w-full md:w-72 flex-shrink-0 mb-8 md:mb-0 md:mr-8">
        <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            版本目录
          </h2>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1 custom-scrollbar">
            <ul className="space-y-1">
              {versions.map((version) => (
                <li key={version.id} className="group">
                  <button
                    onClick={() => scrollToVersion(version.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-md text-sm transition-all duration-200 flex items-center ${
                      activeVersion === version.id
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="flex-1 truncate">{version.title}</span>
                        {version.isNew && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            新
                          </span>
                        )}
                      </div>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        activeVersion === version.id ? 'opacity-100 text-primary-600 translate-x-0' : 'opacity-0 group-hover:opacity-50 group-hover:translate-x-0 -translate-x-1'
                      }`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* 主内容区 */}
      <div className="flex-1" ref={contentRef}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              发布日志
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
              {versions.length} 个版本
            </span>
          </div>
          
          <div className="prose dark:prose-invert prose-lg max-w-none">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Releases; 