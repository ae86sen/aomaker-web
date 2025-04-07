## 注册自定义请求中间件
### 作用
AOMaker 中间件系统提供了一种灵活的方式来扩展和定制请求处理流程，允许在发送请求前和接收响应后执行自定义逻辑，例如日志记录、请求修改、响应验证等。

中间件是一个接收请求和下一个处理函数的可调用对象：
```python
from aomaker.core.middlewares.registry import middleware,RequestType, CallNext, registry


def my_middleware(request: RequestType, call_next: CallNext) -> ResponseType:

    # 请求处理前的逻辑

    response = call_next(request) # 调用下一个中间件或发送请求

    # 响应处理后的逻辑

    return response
```

### 中间件注册位置
自定义中间件应在项目脚手架的 middlewares 目录下创建：
```
project/
├── middlewares/           # 中间件目录
│   ├── __init__.py        # 保持空文件或导入中间件
│   ├── retry_middleware.py           # 自定义重试中间件
│   ├── mock_middleware.py            # 自定义模拟响应中间件
│   └── middleware.yaml    # 中间件配置文件
```
当启动`aomaker run` 后，系统会自动扫描该目录加载所有中间件。

### 中间件配置和控制
####  配置文件结构
通过 `middlewares/middleware.yaml` 配置文件控制中间件行为：
```yaml
# 中间件名称作为键
logging_middleware:
  enabled: true            # 是否启用
  priority: 900            # 优先级，数值越大越先执行

retry_middleware:
  enabled: true
  priority: 800
  options: #
    max_retries: 3
    retry_delay: 1.0
    retry_on_status_codes: [500, 502, 503]
```

注意📢：配置文件中的参数优先级会高于装饰器参数，比如装饰器中`enabled=True` ，但配置文件中为False，那么会以配置文件为准，不会执行这个中间件。
#### 配置参数说明

| 参数       | 类型  | 说明             |
| -------- | --- | -------------- |
| enabled  | 布尔值 | 控制中间件是否启用      |
| priority | 整数  | 执行优先级，数值越大越先执行 |
| options  | 对象  | 中间件特定配置项，可自定义  |
### 编写自定义中间件
#### 基本结构
```python
# middlewares/my_middleware.py
from aomaker.core.middlewares.registry import middleware, RequestType, CallNext, ResponseType

@middleware(
    name="my_middleware",     # 中间件名称，配置文件中使用
    enabled=True,             # 默认是否启用
    priority=500,             # 默认优先级
    log_level="INFO"          # 自定义选项示例
)
def my_middleware(request: RequestType, call_next: CallNext) -> ResponseType:
    """自定义中间件功能描述"""
    
    # 1. 请求前处理
    print(f"处理请求: {request.get('url')}")
    
    # 2. 调用下一个中间件
    response = call_next(request)
    
    # 3. 响应后处理
    print(f"收到响应: {response.status_code}")
    
    return response
```

#### 中间件装饰器参数

| 参数       | 类型  | 说明             |
| -------- | --- | -------------- |
| name     | 字符串 | 中间件名称，用于配置文件引用 |
| enabled  | 布尔值 | 默认是否启用         |
| priority | 整数  | 默认优先级          |
| options  | 字典  | 其他自定义选项        |
### 内置中间件使用说明
AOMaker 内置了结构化日志中间件 `logging_middleware`，用于记录请求和响应信息。
#### 开启/关闭方法

在 middleware.yaml 中配置：
```yaml
logging_middleware:
  enabled: true  # 设为 false 可关闭日志记录
  priority: 900
```

### 使用场景示例
#### 示例一：模拟响应中间件
当我们希望拦截某些接口，对响应做修改，就可以利用中间件来处理。
比如，我们想拦截url中带有"products"的接口，让它返回自定义的mock响应。

```yaml
# 框架自带的中间件配置
logging_middleware:
  enabled: true
  priority: 900

mock:
  priority: 800
  enabled: true
  options:
    rules:
      - "products"
```

```python
import json
import re
import requests

from aomaker.core.middlewares.registry import registry,RequestType,CallNext,middleware, ResponseType
from aomaker.core.base_model import CachedResponse
    
@middleware(name="mock", priority=800, enabled=True, options={"rules":[]})
def mock_middleware(request: RequestType, call_next: CallNext):
    """接口模拟中间件"""
    config = registry.middleware_configs["mock"].options
    mock_rules = config.get("rules", [])
    
    # 检查是否匹配模拟规则
    url = request.get("url", "")
    for rule in mock_rules:
        if rule in url:
            # 创建模拟响应
            mock_resp = requests.Response()
            mock_resp.status_code = 200
            
            # 根据URL确定返回不同的模拟数据
            if "products" in url:
                # 确保模拟数据结构与ProductResponse模型匹配
                mock_resp._content = json.dumps({
                    "ret_code": 0, 
                    "message": "success",
                    "data": {
                        "id": 1, 
                        "name": "模拟产品",
                        "price": 99.99,
                        "stock": 100,
                        "category": "测试类别"
                    }
                }).encode()
            else:
                # 其他API的模拟数据
                mock_resp._content = json.dumps({
                    "ret_code": 0, 
                    "message": "success",
                    "data": {"mock": True}
                }).encode()
                
            mock_resp.headers["Content-Type"] = "application/json"
            
            print(f"已模拟响应: {url}")
            return CachedResponse(mock_resp)
    
    # 无匹配规则，继续实际请求
    return call_next(request)

```

当进行请求后，url中有路由products的接口的响应将会被替换为mock响应
![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/aomaker%20v3.0%E6%96%B0%E5%8A%9F%E8%83%BD%EF%BC%88%E5%90%ABquick%20start%EF%BC%89-20250327.png)

#### 示例二：性能统计中间件

```python
import time

from aomaker.core.middlewares.registry import registry,RequestType,CallNext,middleware, ResponseType


@middleware(name="performance", priority=700, options={"slow_threshold": 1.0})
def performance_middleware(request: RequestType, call_next: CallNext):
    """请求性能统计中间件"""
    # 记录开始时间
    start_time = time.time() 
    # 执行请求
    response = call_next(request)
    # 计算耗时
    duration = time.time() - start_time
    # 记录性能数据
    url = request.get("url", "").split("?")[0]  # 移除查询参数
    method = request.get("method", "GET")
    status = response.status_code
    
    print(f"性能统计 - {method} {url}: {duration:.3f}秒, 状态码: {status}")
    
    # 如果配置了性能阈值，可以记录慢请求
    config = registry.middleware_configs["performance"].options
    threshold = config.get("slow_threshold")
    if duration > threshold:
        print(f"⚠️ 检测到慢请求: {method} {url} 耗时 {duration:.3f}秒")
    
    return response
```

```yaml
# 框架自带的中间件配置
logging_middleware:
  enabled: true
  priority: 900

performance:
  priority: 700
  enabled: true
  options:
    slow_threshold: 1.0
```

作用： 当接口响应时间慢于{slow_threshold}时（示例中为1.0 s），进行上报
![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/aomaker%20v3.0%E6%96%B0%E5%8A%9F%E8%83%BD%EF%BC%88%E5%90%ABquick%20start%EF%BC%89-20250327-1.png)
