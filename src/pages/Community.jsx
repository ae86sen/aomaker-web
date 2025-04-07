import React, { useState } from 'react';
import { 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  BookOpenIcon, 
  CodeBracketIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const Community = () => {
  const [showQRCode, setShowQRCode] = useState(false);

  const communityResources = [
    {
      title: '加入讨论组',
      description: '加入我们的微信/钉钉讨论组，与其他AOmaker用户交流经验和问题解决方案。',
      icon: <UserGroupIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />,
      link: {
        text: '获取邀请二维码',
        url: '#',
        isQRCode: true
      },
    },
    {
      title: '问题讨论',
      description: '在GitHub Discussions中提问，分享您的使用经验，或者参与功能讨论。',
      icon: <ChatBubbleLeftRightIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />,
      link: {
        text: '前往讨论区',
        url: 'https://github.com/ae86sen/aomaker/discussions',
      },
    },
    {
      title: '贡献文档',
      description: '帮助改进AOmaker的文档，纠正错误或添加新的教程和示例。',
      icon: <BookOpenIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />,
      link: {
        text: '文档仓库',
        url: 'https://github.com/ae86sen/aomaker',
      },
    },
    {
      title: '提交Issue',
      description: '发现bug或有新功能建议？在GitHub上提交Issue帮助我们改进产品。',
      icon: <DocumentTextIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />,
      link: {
        text: '提交Issue',
        url: 'https://github.com/ae86sen/aomaker/issues/new/choose',
      },
    },
    {
      title: '贡献代码',
      description: '通过提交Pull Request为AOmaker贡献代码，帮助社区构建更好的工具。',
      icon: <CodeBracketIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />,
      link: {
        text: '共享代码',
        url: 'https://github.com/ae86sen/aomaker/pulls',
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* 社区页面头部 */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            加入AOmaker社区
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            与优秀同行一起交流，分享经验，共同成长
          </p>
        </div>
      </div>

      {/* 社区资源 */}
      <div className="max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {communityResources.map((resource, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4">
                {resource.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {resource.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {resource.description}
              </p>
              {resource.link?.isQRCode ? (
                <button
                  onClick={() => setShowQRCode(true)}
                  className="mt-4 text-base font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                >
                  {resource.link.text}
                </button>
              ) : (
                <a
                  href={resource.link?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-base font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                >
                  {resource.link?.text}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 加入我们 */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-600 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:px-16">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-white">
                准备好参与贡献了吗？
              </h2>
              <p className="mt-4 text-lg leading-6 text-primary-100">
                无论是提交代码、改进文档，还是报告Bug，您的每一份贡献都至关重要
              </p>
              <div className="mt-8 flex justify-center">
                <a
                  href="https://github.com/ae86sen/aomaker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 shadow-sm"
                >
                  访问GitHub仓库
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 添加二维码弹窗 */}
      {showQRCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowQRCode(false)}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">加入讨论组</h3>
              <button 
                onClick={() => setShowQRCode(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center">
              <img 
                src="/images/qr_code.png" 
                alt="讨论组二维码" 
                className="w-64 h-64 object-cover"
              />
            </div>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              扫描上方二维码加入AOmaker讨论组
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community; 