import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-8xl font-extrabold text-primary-600 dark:text-primary-400">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">页面未找到</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="btn-primary"
          >
            返回首页
          </Link>
          <Link
            to="/docs"
            className="ml-4 btn-secondary"
          >
            查看文档
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 