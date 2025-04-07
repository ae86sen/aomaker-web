import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  BookOpenIcon,
  BoltIcon,
  CubeTransparentIcon,
  PuzzlePieceIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const DocLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // 为每个菜单项创建折叠状态，格式为 {菜单标题: 是否展开}
  const [expandedMenus, setExpandedMenus] = useState({});
  
  // 文档菜单项
  const docMenuItems = [
    { title: '介绍', path: '/docs', icon: <BookOpenIcon className="h-5 w-5" /> },
    { title: '快速开始', path: '/docs/quick-start', icon: <BoltIcon className="h-5 w-5" /> },
    { 
      title: '基础特性', 
      // path: '/docs/basic-features', 
      icon: <CubeTransparentIcon className="h-5 w-5" />,
      submenu: [
        { title: '接口定义', path: '/docs/basic-features/api-modeling' },
        { title: '接口文档一键生成', path: '/docs/basic-features/openapi' },
        { title: 'JsonSchema校验', path: '/docs/basic-features/jsonschema' },
        { title: '存储管理', path: '/docs/basic-features/storage' },
        { title: '鉴权管理', path: '/docs/basic-features/auth' },
        { title: 'Dashboard', path: '/docs/basic-features/dashboard' },
        { title: 'Mock服务', path: '/docs/basic-features/mock' },
        { title: '接口信息静态统计', path: '/docs/basic-features/statics' },
        { title: '测试报告', path: '/docs/basic-features/report' },
      ]
    },
    { 
      title: '高级特性', 
      // path: '/docs/', 
      icon: <PuzzlePieceIcon className="h-5 w-5" />,
      submenu: [
        { title: '自定义转换器', path: '/docs/advanced-features/custom-converter' },
        { title: '注册自定义CLI参数', path: '/docs/advanced-features/cli' },
        { title: '并行运行测试用例', path: '/docs/advanced-features/parallel' },
        { title: '注册全局钩子函数', path: '/docs/advanced-features/hooks' },
        { title: '注册自定义请求中间件', path: '/docs/advanced-features/middlewares' },
        { title: 'HTTP流式响应', path: '/docs/advanced-features/stream' },
        { title: '接入测试平台', path: '/docs/advanced-features/platform' },
      ]
    },

  ];

  // 初始化展开状态，将基础特性设为默认展开
  useEffect(() => {
    const initialExpandState = {};
    docMenuItems.forEach(item => {
      if (item.submenu) {
        // 默认将基础特性展开
        initialExpandState[item.title] = item.title === '基础特性';
        
        // 如果当前路径匹配子菜单，也展开该菜单
        if (item.submenu.some(subItem => location.pathname === subItem.path)) {
          initialExpandState[item.title] = true;
        }
      }
    });
    setExpandedMenus(initialExpandState);
  }, []);

  // 切换菜单折叠状态
  const toggleMenu = (title, event) => {
    event.preventDefault();
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* 侧边栏 - 桌面版 */}
        <aside className="hidden md:block w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <nav className="p-4 sticky top-16">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">文档</h3>
            <ul className="space-y-1">
              {docMenuItems.map((item) => {
                const isActive = location.pathname === item.path || 
                                (item.submenu && item.submenu.some(subItem => location.pathname === subItem.path));
                
                return (
                  <li key={item.title + (item.path || '')}>
                    {item.submenu ? (
                      // 有子菜单的项目，使用按钮而不是链接
                      <div>
                        <button
                          onClick={(e) => toggleMenu(item.title, e)}
                          className={`flex items-center w-full justify-between px-3 py-2 rounded-md text-sm font-medium ${
                            isActive
                              ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="mr-2">{item.icon}</span>
                            {item.title}
                          </div>
                          {/* 折叠/展开图标 */}
                          {expandedMenus[item.title] ? 
                            <ChevronDownIcon className="h-4 w-4" /> : 
                            <ChevronRightIcon className="h-4 w-4" />
                          }
                        </button>
                        
                        {/* 子菜单，根据折叠状态显示或隐藏 */}
                        {expandedMenus[item.title] && (
                          <ul className="ml-6 mt-1 space-y-1">
                            {item.submenu.map((subItem) => (
                              <li key={subItem.path}>
                                <Link
                                  to={subItem.path}
                                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                    location.pathname === subItem.path
                                      ? 'text-primary-600 dark:text-primary-400'
                                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  {subItem.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      // 没有子菜单的项目，使用普通链接
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          isActive
                            ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        
        {/* 移动版侧边栏切换按钮 */}
        <div className="md:hidden p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">文档</h3>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <span className="sr-only">打开侧边栏</span>
            <svg
              className={`${sidebarOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className={`${sidebarOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 移动版侧边栏 */}
        {sidebarOpen && (
          <aside className="md:hidden w-full bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <nav className="p-4">
              <ul className="space-y-1">
                {docMenuItems.map((item) => {
                  const isActive = location.pathname === item.path || 
                                  (item.submenu && item.submenu.some(subItem => location.pathname === subItem.path));
                  
                  return (
                    <li key={item.title + (item.path || '')}>
                      {item.submenu ? (
                        // 有子菜单的项目，使用按钮而不是链接
                        <div>
                          <button
                            onClick={(e) => toggleMenu(item.title, e)}
                            className={`flex items-center w-full justify-between px-3 py-2 rounded-md text-sm font-medium ${
                              isActive
                                ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="mr-2">{item.icon}</span>
                              {item.title}
                            </div>
                            {/* 折叠/展开图标 */}
                            {expandedMenus[item.title] ? 
                              <ChevronDownIcon className="h-4 w-4" /> : 
                              <ChevronRightIcon className="h-4 w-4" />
                            }
                          </button>
                          
                          {/* 子菜单，根据折叠状态显示或隐藏 */}
                          {expandedMenus[item.title] && (
                            <ul className="ml-6 mt-1 space-y-1">
                              {item.submenu.map((subItem) => (
                                <li key={subItem.path}>
                                  <Link
                                    to={subItem.path}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                      location.pathname === subItem.path
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                  >
                                    {subItem.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        // 没有子菜单的项目，使用普通链接
                        <Link
                          to={item.path}
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                            isActive
                              ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="mr-2">{item.icon}</span>
                          {item.title}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        )}
        
        {/* 主内容 */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocLayout; 