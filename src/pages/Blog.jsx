import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 模拟从API获取博客文章列表
    // 在实际项目中，这里应该是从服务器或静态文件获取数据
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // 这里使用模拟数据，实际应用中应该从服务器获取
        const mockPosts = [
          {
            id: 'aomaker-v1-released',
            title: 'AOmaker v1.0 正式发布：接口自动化新时代',
            date: '2023-08-01',
            author: 'AOmaker团队',
            authorImage: '/images/authors/team.jpg',
            coverImage: '/images/blog/aomaker-v1-release.jpg',
            excerpt: 'AOmaker v1.0正式发布，带来接口自动化测试新时代，革新接口维护方式，提升测试效率。',
            tags: ['发布公告', '接口自动化', '测试框架']
          },
          {
            id: 'api-as-code',
            title: '接口即代码: 重思接口自动化测试的范式',
            date: '2023-07-15',
            author: '张工',
            authorImage: '/images/authors/zhang.jpg',
            coverImage: '/images/blog/api-as-code.jpg',
            excerpt: '探讨"接口即代码"理念如何改变传统接口自动化测试模式，提高维护效率。',
            tags: ['技术思考', '最佳实践', '接口维护']
          },
          {
            id: 'migrate-to-aomaker',
            title: '从传统框架迁移到AOmaker的实践指南',
            date: '2023-06-20',
            author: '李工',
            authorImage: '/images/authors/li.jpg',
            coverImage: '/images/blog/migration-guide.jpg',
            excerpt: '详细介绍如何将现有的接口自动化测试项目平滑迁移到AOmaker框架。',
            tags: ['迁移指南', '实践案例', '工程化']
          }
        ];
        
        setPosts(mockPosts);
        setLoading(false);
      } catch (err) {
        console.error('获取博客文章失败:', err);
        setError('无法加载博客文章，请稍后再试。');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
          <h3 className="text-lg font-medium">加载博客文章时出错</h3>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* 博客页面头部 */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            博客
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            关于AOmaker的最新资讯、教程和技术分享
          </p>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover"
                  src={post.coverImage || '/images/blog/default.jpg'}
                  alt={post.title}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white dark:bg-gray-800 p-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <time dateTime={post.date}>{post.date}</time>
                    <span>&middot;</span>
                    <div className="flex space-x-1">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link to={`/blog/${post.id}`} className="block">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                      {post.excerpt}
                    </p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={post.authorImage || '/images/authors/default.jpg'}
                      alt={post.author}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {post.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog; 