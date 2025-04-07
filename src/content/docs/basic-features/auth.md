## 鉴权管理
### 1.登录认证配置
在`login.py`中实现认证逻辑，框架通过继承机制自动注入环境配置：
```python
from aomaker.fixture import BaseLogin

class Login(BaseLogin):
    """登录认证基类（自动继承环境配置）"""
    
    def login(self) -> dict:
        """执行登录并返回认证响应"""
        # 内置环境变量调用：
        # 访问基础地址：self.base_url
        # 获取账户信息：self.account
        # 获取自定义配置：self.env_vars.current_env_conf.get("your_key")
        
        resp_login = auth_service.login(
            base_url=self.base_url,
            username=self.account["user"],
            password=self.account["pwd"]
        )
        return resp_login

    def make_headers(self, resp_login: dict) -> dict:
        """构建全局请求头"""
        return {
            "Authorization": f"Bearer {resp_login['token']}",
            "X-Client-Type": "auto_test"
        }

```

> 框架特性：
> 登录操作仅在会话开始时执行一次，自动将`make_headers`返回的请求头附加到整个request session。

### 2.请求头动态管控
#### 场景1：单次请求头覆盖

```python
# 正常请求携带鉴权头
UserAPI().get_profile()  # headers: Authorization

# 特殊请求覆盖头（如测试无鉴权场景）
UserAPI().send(
    headers={"X-Custom": "value"}, 
    override_headers=True
)  # 最终headers只有X-Custom
```

#### 场景2：作用域级头管理
```python
from aomaker.core.http_client import get_http_client
# 测试用例：验证接口头校验逻辑
def test_header_validation():
	default_http_client = get_http_client()
    with default_http_client.header_override_scope({"X-Test": "123"}):
        # 该作用域内所有请求使用新头
        UserAPI().get_profile()  # headers: X-Test
        OrderAPI().list()       # headers: X-Test
        
    # 作用域外恢复原头
    UserAPI().get_profile()  # headers: Authorization
```

#### 场景3： 全局请求头变更
todo。。

>[!NOTE] 模式说明：
>- `override=True`：完全替换请求头
>- `override=False`：智能合并头字段（冲突时局部优先）
>- `with default_http_client.header_override_scope` 作用域退出后自动执行头部状态回滚
