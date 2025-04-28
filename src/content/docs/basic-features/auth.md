## 鉴权管理

### 1.登录认证配置
在脚手架的根目录下有`login.py`，这里预置了mock服务的接口鉴权信息获取与注入的方式，实际的项目只需依葫芦画瓢即可。

首先，在`conf/config.yaml` 中配置好环境的登录信息：

```yaml
env: mock  
mock:  # 环境名，自定义即可
  base_url: 'http://127.0.0.1:9999'  
  account:  
    user: 'aomaker'  
    pwd: '123456'  
  
release:  
  base_url: 'https://release.aomaker.com'  
  account:  
    user: 'aomaker'  
    pwd: '123456'
```

然后，在`login.py`中编写项目的登录代码，有两种方式(以预置的mock服务的登录接口为例)：
1.调用登录接口模型

_apis/mock/apis.py_

```python
@define(kw_only=True)  
@router.post("/api/login/token")  
class LoginAPI(BaseAPIObject[TokenResponseData]):  
    """登录"""  
  
    @define  
    class RequestBodyModel:  
        username: str = field()  
        password: str = field()  
  
    request_body: RequestBodyModel  
    response: Optional[TokenResponseData] = field(default=TokenResponseData)
```


_login.py_

```python
from typing import Union  
  
from aomaker.fixture import BaseLogin  
from aomaker.core.http_client import HTTPClient  
  
from apis.mock.apis import LoginAPI  
  
class Login(BaseLogin):  
  
  
    def login(self) -> Union[dict, str]:  
        login_request_data = LoginAPI.RequestBodyModel(  
            username=self.account['user'],  
            password=self.account['pwd']  
        )  
        login_api = LoginAPI(  
            request_body=login_request_data,  
            http_client=HTTPClient() # 注意： 必须初始化一个http_client 
        )  
        resp_login = login_api.send()  
        return resp_login.response_model.data.access_token  
  
    def make_headers(self, resp_login: Union[dict, str]) -> dict:  
        token = resp_login  
        headers = {  
            'Authorization': f'Bearer {token}'  
        }  
        return headers
```


2.直接request请求

如果接口文档中没有定义登录接口，或者登录接口很简单，也可以直接用requests请求即可。
```python
import requests

from aomaker.fixture import BaseLogin


class Login(BaseLogin):

    def login(self) -> dict:
        login_url = self.base_url + "/api/login/token"
        login_data = {
            "username": self.account['user'],
            "password": self.account['pwd']
        }
        resp_login = requests.post(url=login_url, json=login_data).json()
        return resp_login



    def make_headers(self, resp_login:dict) -> dict:
        token = resp_login['data']['access_token']
        headers = {
            'Authorization': f'Bearer {token}'
        }
        return headers
```

>[!NOTE] 核心要点：
>1. 在脚手架项目根目录下的`login.py` 中定义 
>2. 继承`BaseLogin` ，该类会自动读取配置文件中当前环境的所有配置信息，子类可以通过`self.base_url` 和`self.account` 获取基础登录信息，也可以通过`self.env_vars.current_env_conf` 获取当前环境的整个配置信息
>3. 须实现`login` 和`make_headers` 这两个方法
>4. `login`方法返回登录响应信息 
>5. `make_headers`方法构造好带有鉴权信息的请求头，并返回


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
