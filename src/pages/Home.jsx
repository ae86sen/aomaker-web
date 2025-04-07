import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import MarkdownRenderer from '../components/MarkdownRenderer';

const Home = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* 英雄区 */}
      <div className="relative bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              <span className="block">新一代接口自动化测试框架</span>
              <span className="block text-primary-600 dark:text-primary-400 text-5xl md:text-6xl font-audiowide tracking-wider transform hover:scale-105 transition-transform duration-300 drop-shadow-md">AOMAKER</span>            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              通过『声明式建模+文档化驱动』范式，彻底解决企业级接口自动化测试中的维护难题，提升测试效率
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/docs/quick-start"
                className="btn-primary flex items-center"
              >
                开始使用
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/docs"
                className="ml-4 btn-secondary"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>
        
        {/* 装饰背景 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <svg
            className="absolute right-0 top-0 transform translate-x-1/3 -translate-y-1/4 opacity-10 dark:opacity-5"
            width="800"
            height="800"
            fill="none"
            viewBox="0 0 800 800"
          >
            <circle cx="400" cy="400" r="400" fill="url(#paint0_radial)" />
            <defs>
              <radialGradient
                id="paint0_radial"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(400 400) rotate(90) scale(400)"
              >
                <stop stopColor="#7C3AED" />
                <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* 特点简介 */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              为什么选择 AOmaker？
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              AOmaker 重新定义了接口自动化测试的工程范式
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* 特点1 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">声明式接口建模</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                通过attrs库进行清晰、简洁的接口定义，摆脱低效的硬编码模式，提升接口维护效率
              </p>
            </div>

            {/* 特点2 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">OpenAPI集成</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                一键从OpenAPI/Swagger文档生成接口定义模型，确保接口定义与文档保持同步
              </p>
            </div>

            {/* 特点3 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">模块化设计</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                接口定义与测试用例分离，降低耦合度，提高代码复用率和可维护性
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/features"
              className="text-base font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
            >
              查看所有特性 →
            </Link>
          </div>
        </div>
      </div>

      {/* 代码示例 */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              优雅的接口定义方式
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              AOmaker 让接口维护变得简单
            </p>
          </div>

          <div className="mt-12 bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-2">•••</span>
                <span>instance_api.py</span>
              </div>
            </div>
            <div className="p-4">
              <MarkdownRenderer content={`\`\`\`python
from attrs import define, field 
from aomaker.core.router import router
from aomaker.core.api_object import BaseAPIObject

@define(kw_only=True)  
@router.get("/api/{namespace}/instances")  
class GetInstancesAPI(BaseAPIObject[InstancesResponse]):  
    """获取实例列表"""  
  
    @define  
    class PathParams:  
        namespace: str = field()  
  
    @define  
    class QueryParams:  
        status: Optional[str] = field(default=None)  
        limit: Optional[int] = field(default=10)  
        offset: Optional[int] = field(default=0)  
  
    path_params: PathParams
    query_params: QueryParams = field(factory=QueryParams)
    
    # 响应数据结构自动映射到类型
    response: Optional[InstancesResponse] = field(default=InstancesResponse)

# 在测试中使用
def test_list_instances():
    # 明确的参数类型，IDE自动补全支持
    path_params = GetInstancesAPI.PathParams(namespace="default")
    query_params = GetInstancesAPI.QueryParams(status="running", limit=20)
    
    # 发送请求并自动映射响应
    res = GetInstancesAPI(
        path_params=path_params, 
        query_params=query_params
    ).send()
    
    # 通过类型提示访问响应数据
    assert res.response_model.total >= 0
\`\`\``} />
            </div>
          </div>
        </div>
      </div>

      {/* CTA区域 */}
      <div className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              准备好开始使用了吗？
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-primary-100">
              只需几分钟即可开始使用 AOmaker
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/docs/quick-start"
                className="px-5 py-3 bg-white text-primary-600 font-medium rounded-md shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-600 focus:ring-white"
              >
                快速开始
              </Link>
              <a
                href="https://github.com/ae86sen/aomaker"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 px-5 py-3 border border-transparent text-primary-100 font-medium rounded-md bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-600 focus:ring-white"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 