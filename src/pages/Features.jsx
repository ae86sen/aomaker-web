import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CodeBracketIcon, 
  DocumentArrowDownIcon, 
  CubeTransparentIcon,
  ArrowPathIcon,
  BoltIcon,
  CommandLineIcon,
  PuzzlePieceIcon,
  ServerStackIcon,
  ClockIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

import FeatureCard from '../components/FeatureCard';
import CodeBlock from '../components/CodeBlock';

const Features = () => {
  // 主要特性列表
  const mainFeatures = [
    {
      icon: <CodeBracketIcon className="h-6 w-6" />,
      title: '声明式接口建模',
      description: '使用attrs库进行清晰、简洁的接口定义，摆脱低效的硬编码模式，提升接口维护效率'
    },
    {
      icon: <DocumentArrowDownIcon className="h-6 w-6" />,
      title: 'OpenAPI集成',
      description: '一键从OpenAPI/Swagger文档生成接口定义模型，确保接口定义与文档保持同步'
    },
    {
      icon: <CubeTransparentIcon className="h-6 w-6" />,
      title: '模块化设计',
      description: '接口定义与测试用例分离，降低耦合度，提高代码复用率和可维护性'
    },
    {
      icon: <ArrowPathIcon className="h-6 w-6" />,
      title: '高度可维护',
      description: '结构化参数管理，即使接口数量激增，维护成本也能保持线性增长'
    },
    {
      icon: <BoltIcon className="h-6 w-6" />,
      title: '智能IDE支持',
      description: '完整的类型提示和自动补全功能，提升开发效率，减少错误概率'
    },
    {
      icon: <CommandLineIcon className="h-6 w-6" />,
      title: '灵活的测试执行',
      description: '支持多环境配置、并行执行，提供丰富的测试报告和日志'
    },
  ];

  // 高级特性列表
  const advancedFeatures = [
    {
      icon: <PuzzlePieceIcon className="h-6 w-6" />,
      title: '自定义转换器',
      description: '支持自定义HTTP请求转换逻辑，灵活适配前后端接口差异'
    },
    {
      icon: <ServerStackIcon className="h-6 w-6" />,
      title: '并行运行测试用例',
      description: '内置多线程和多进程支持，显著提高大规模测试场景的执行效率'
    },
    {
      icon: <ArrowPathIcon className="h-6 w-6" />,
      title: '自定义请求中间件',
      description: '自由扩展请求生命周期行为，实现日志、Mock、重试等功能'
    },
    {
      icon: <CloudIcon className="h-6 w-6" />,
      title: '测试平台集成',
      description: '提供标准接口与测试平台无缝对接，实现接口自动化与平台一体化管理'
    },
    {
      icon: <CodeBracketIcon className="h-6 w-6" />,
      title: '全局钩子函数',
      description: '全局级别扩展点，轻松在主进程启动前执行自定义逻辑'
    },
    {
      icon: <CommandLineIcon className="h-6 w-6" />,
      title: '自定义CLI参数',
      description: '轻松扩展命令行参数，简化多进程、多线程环境的参数管理'
    }
  ];

  // 代码示例
  const codeExample = `from attrs import define, field 
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
    for instance in res.response_model.data:
        assert instance.status == "running"`;

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* 特性页面头部 */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            AOmaker 核心特性
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            AOmaker 重新定义了接口自动化测试的工程范式，为企业级接口自动化场景提供全方位解决方案
          </p>
        </div>
      </div>

      {/* 主要特性部分 */}
      <div className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              主要特性
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              AOmaker 解决了传统接口自动化测试中的核心痛点，提供了全面的工程化解决方案
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {mainFeatures.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 代码示例部分 */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              优雅的声明式接口定义
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              aomaker 采用声明式编程范式，基于attrs库实现强大的接口建模能力。通过简单的装饰器和类型注解，实现接口与业务逻辑的彻底解耦。
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              这种方式相比传统的硬编码方式，大幅降低了接口维护成本，提高了代码可读性和可维护性。
            </p>
            <div className="mt-8">
              <Link
                to="/docs/api-modeling"
                className="text-base font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
              >
                深入了解接口建模 →
              </Link>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-7">
            <CodeBlock code={codeExample} language="python" filename="instance_api.py" />
          </div>
        </div>
      </div>

      {/* 高级特性部分 */}
      <div className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              高级特性
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              除了核心功能外，AOmaker 还提供了多种高级特性，满足企业级定制化测试需求
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2">
            {advancedFeatures.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA部分 */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            开始使用 aomaker
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            通过简单几步，开始使用 aomaker 彻底改变你的接口测试方式
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/docs/quick-start"
              className="btn-primary mx-2"
            >
              快速开始
            </Link>
            <a
              href="https://github.com/ae86sen/aomaker"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mx-2"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 