import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 引入布局组件
import MainLayout from './layouts/MainLayout';
import DocLayout from './layouts/DocLayout';

// 引入页面组件
import Home from './pages/Home';
import Features from './pages/Features';
import Blog from './pages/Blog';
import Community from './pages/Community';
import NotFound from './pages/NotFound';

// 引入通用文档组件
import DocContent from './components/DocContent';

function App() {
  return (
    <Routes>
      {/* 主布局下的路由 */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/community" element={<Community />} />
        
        {/* 文档布局下的路由 - 使用参数化路由 */}
        <Route path="/docs" element={<DocLayout />}>
          <Route index element={<DocContent />} /> {/* 默认文档页面 */}
          <Route path=":docId/*" element={<DocContent />} /> {/* 动态匹配所有文档路径 */}
        </Route>
        
        {/* 404页面 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App; 