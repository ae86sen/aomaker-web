import React from 'react';
import { Outlet } from 'react-router-dom';

// 引入布局组件
import MainLayout from './layouts/MainLayout';
import DocLayout from './layouts/DocLayout';

// 引入页面组件
import Home from './pages/Home';
import Features from './pages/Features';
import Blog from './pages/Blog';
import Community from './pages/Community';
import NotFound from './pages/NotFound';
import Releases from './pages/Releases';

// 引入通用文档组件
import DocContent from './components/DocContent';

// Export route configuration instead of the component
const routeConfig = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/features", element: <Features /> },
      { path: "/blog", element: <Blog /> },
      { path: "/community", element: <Community /> },
      { path: "/releases", element: <Releases /> },
      {
        path: "/docs",
        element: <DocLayout />,
        children: [
          { index: true, element: <DocContent /> },
          { path: ":docId/*", element: <DocContent /> }
        ]
      },
    ]
  },
  { path: "*", element: <NotFound /> }
];

export default routeConfig; 