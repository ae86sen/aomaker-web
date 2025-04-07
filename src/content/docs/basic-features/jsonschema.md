## JsonSchema校验
针对接口响应字段复杂度高、传统断言方案存在结构性遗漏的痛点，`aomaker`采用双维度校验体系：

### 自动化结构校验（核心防御层）

- **动态Schema管理**：系统自动提取接口定义中响应体的JSON Schema结构，持久化存储至专用Schema表，当响应体发生变化时，Schema表会同步更新
- **实时结构验证**：每次请求响应后，自动触发当前响应体与历史Schema的智能比对
- **异常机制**：当检测到未注册的新字段/结构变更时，自动阻断测试流程并抛出`Validation AssertionError`

通过JSON Schema校验响应结构完整性，实现：  
✅ 全字段类型校验  
✅ 数据结构匹配验证  
✅ 必填字段兜底检查  
✅ 字段枚举值验证  

### 业务语义校验（用户自定义层）
用户自定义核心业务断言：  
✅ 关键字段值验证  
✅ 业务逻辑校验  
✅ 数据一致性检查  
✅ 多接口数据联检  

### 校验策略配置方案
默认会开启Schema校验，提供两种关闭方案：

局部关闭
```python
xxxAPI().send(enable_schema_validation=False)
```

全局关闭
```python
from aomaker.core.api_object import BaseAPIObject

class CustomBaseAPIObject(BaseAPIObject):
	"""全局禁用Schema校验的API基类"""
	enable_schema_validation: bool = field(default=False)
```