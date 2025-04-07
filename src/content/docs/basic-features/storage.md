## 存储管理

###  设计背景

为解决多任务环境下测试变量管理难题，aomaker采用SQLite数据库作为核心存储方案。SQLite作为轻量级嵌入式数据库，具备零配置、无服务端、单文件存储等特点，完美契合测试框架对轻量化与便捷性的要求。

> SQLite是一个进程内的库，实现了自给自足的、无服务器的、零配置的、事务性的 >SQL 数据库引擎。它是一个零配置的数据库，这意味着与其他数据库不一样，您不需要在系统中配置。 就像其他数据库，SQLite 引擎不是一个独立的进程，可以按应用程序需求进行静态或动态连接。SQLite 直接访问其存储文件。

### 核心架构

项目初始化时自动创建`aomaker.db`数据库文件，内置四张功能明确的表结构：

| 表名             | 生命周期  | 存储内容              | 线程安全 | 典型应用场景        |
| -------------- | ----- | ----------------- | ---- | ------------- |
| **config**     | 持久化存储 | 全局配置参数            | ✅    | 环境host/账号信息等  |
| **cache**      | 会话级存储 | 临时变量/依赖数据         | ✅    | 接口依赖参数传递，临时变量 |
| **schema**     | 持久化存储 | 接口响应模型JSON Schema | -    | 响应结构验证        |
| **statistics** | 持久化存储 | 接口元数据统计           | -    | 测试平台数据可视化     |

*表结构*

![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/aomaker%20v3.0%E6%96%B0%E5%8A%9F%E8%83%BD%EF%BC%88%E5%90%ABquick%20start%EF%BC%89-20250319.png)

### 核心功能详解
#### 1. 全局配置管理 (config)

**存储机制**

- 自动加载`config.yaml`配置到数据库
- 支持多环境配置切换（test/release）
- 配置变更自动同步更新

**典型用法**

```yaml
# 配置文件示例（conf/config.yaml）
env: test
test:
  host: http://test.aomaker.com
  account: 
    user: aomaker002
    pwd: 123456
```

```python
# 代码调用示例
from aomaker.storage import config

def test_env_config():
    current_env = config.get("env")  # 获取当前环境
    test_host = config.get("host")  # 获取对应环境host
```

#### 2. 会话缓存管理 (cache)

**特性**
- 线程安全读写
- Worker进程隔离存储
- 支持任意数据类型存储
- 测试结束后自动清空

**使用场景**
```python
from aomaker.storage import cache

def setup():
    cache.set("auth_token", "Bearer xxxxx")  # 设置鉴权令牌

def test_api_call():
    headers = {"Authorization": cache.get("auth_token")}  # 获取缓存令牌
```

#### 3. Schema自动化管理 (schema)

**运作机制**
- 自动解析接口响应模型
- 生成标准化JSON Schema
- 支持响应结构验证

**案例演示**
例如某个接口的响应模型为`UserResponse`：
```python

@define(kw_only=True)  
class GenericResponse:  
    ret_code: int = field(default=0)  
    message: str = field(default="success")
    
@define(kw_only=True)  
class User:  
    id: int = field()  
    username: str = field()  
    email: str = field()  
    created_at: datetime = field()  
    is_active: bool = field(default=True)
    
@define(kw_only=True)  
class UserResponse(GenericResponse):  
    data: Optional[User] = field(default=None)
    
```

那`UserResponse` 模型对应的JsonSchema为：
```json
{  
  "title": "UserResponse",  
  "type": "object",  
  "properties": {  
    "ret_code": {  
      "type": "integer"  
    },  
    "message": {  
      "type": "string"  
    },  
    "data": {  
      "anyOf": [  
        {  
          "title": "User",  
          "type": "object",  
          "properties": {  
            "id": {  
              "type": "integer"  
            },  
            "username": {  
              "type": "string"  
            },  
            "email": {  
              "type": "string"  
            },  
            "created_at": {  
              "type": "string",  
              "format": "date-time"  
            },  
            "is_active": {  
              "type": "boolean"  
            }  
          },  
          "required": [  
            "id",  
            "username",  
            "email",  
            "created_at"  
          ]  
        },  
        {  
          "type": "null"  
        }  
      ]  
    }  
  },  
  "required": []  
}
```

最终每个响应模型对应的JsonSchema会自动生成并自动存到`schema` 表中：
![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/aomaker%20v3.0%E6%96%B0%E5%8A%9F%E8%83%BD%EF%BC%88%E5%90%ABquick%20start%EF%BC%89-20250319-1.png)

> JSON Schema是基于JSON格式，用于定义JSON数据结构以及校验JSON数据内容。
>  JSON Schema官网地址：[http://json-schema.org/](https://link.zhihu.com/?target=http%3A//json-schema.org/)

#### 4.statics
存储所有接口的类名和包名信息。
![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/aomaker%20v3.0%E6%96%B0%E5%8A%9F%E8%83%BD%EF%BC%88%E5%90%ABquick%20start%EF%BC%89-20250319-2.png)