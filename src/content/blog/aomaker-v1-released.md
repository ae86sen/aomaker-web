---
title: "AOmaker v1.0 正式发布：接口自动化新时代"
date: "2023-08-01"
author: "AOmaker团队"
authorImage: "/images/authors/team.jpg"
coverImage: "/images/blog/aomaker-v1-release.jpg"
excerpt: "AOmaker v1.0正式发布，带来接口自动化测试新时代，革新接口维护方式，提升测试效率。"
tags: ["发布公告", "接口自动化", "测试框架"]
---

# AOmaker v1.0 正式发布：接口自动化新时代

我们非常兴奋地宣布，经过近一年的开发和内部测试，AOmaker v1.0 正式发布了！这是一个重要的里程碑，标志着接口自动化测试领域的新突破。

## 核心理念

AOmaker的核心理念是"接口即代码"(API as Code)，通过结构化定义接口，实现接口与业务逻辑的彻底分离。我们相信，优秀的接口自动化不应该浪费时间在重复的接口维护上，而应该聚焦于业务场景的构建。

## 主要特性

1. **声明式接口定义**：使用装饰器和类型注解，简洁地定义接口结构
2. **自动请求构建**：基于接口定义自动构建HTTP请求，无需手动拼接URL和参数
3. **类型安全**：完整的类型提示和检查，IDE智能提示，告别拼写错误
4. **环境管理**：优雅的环境切换机制，一次定义多环境运行
5. **插件生态**：可扩展的插件架构，满足企业级定制需求
6. **OpenAPI集成**：与Swagger/OpenAPI无缝集成，自动生成接口代码

## 快速入门示例

使用AOmaker定义和调用API非常简单：

```python
from aomaker.api import API, Path, Query
from typing import Optional

class ContainerAPI(API):
    @Path("/api/{namespace}/containers")
    def get_containers(self, namespace: str, limit: Optional[Query[int]] = 10):
        return self.get()

# 在测试中使用
def test_get_containers():
    api = ContainerAPI()
    response = api.get_containers(namespace="usr-xxx", limit=20)
    assert response.status_code == 200
```

相比传统方案，AOmaker让接口定义更加清晰、集中，同时提供完整的类型提示，让IDE可以实时校验参数正确性。

## 未来计划

AOmaker v1.0只是起点，我们的路线图包括：

- **测试数据管理**：更强大的数据驱动能力
- **场景编排DSL**：面向业务场景的测试描述语言
- **AI辅助测试**：基于大模型的测试用例生成与优化
- **分布式执行引擎**：海量API并发测试能力

## 立即开始

```bash
pip install aomaker
```

访问我们的[官方文档](https://aomaker.cn/docs/introduction)了解更多详情，加入我们的[社区](https://aomaker.cn/community)分享您的想法和建议。

感谢所有早期用户的反馈和支持，让我们一起开启接口自动化测试的新篇章！ 