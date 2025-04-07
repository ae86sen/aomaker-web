# 快速开始

> [!WARNING]
>📢**安装之前**：    
>  
>0.确保python版本>=3.8  
>1.测试报告依赖allure，所以请提前安装好allure-command  
>2.先创建一个虚拟环境，用venv，conda，uv（推荐），poetry都行  
>3.确保进到这个虚拟环境后，再安装aomaker  



## 1.创建脚手架
```bash
# 创建脚手架
aomaker create xxx
# 进入脚手架项目
cd xxx
```

## 2.开启mock server
```bash
aomaker mock start --web
```
可以查看接口文档
![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/aomaker%20v3.0%E6%96%B0%E5%8A%9F%E8%83%BD-20250227.png)

## 3.根据接口文档自动生成接口定义
> 脚手架已经带有mock接口的定义，也可以不自动生成。

接口定义会自动生成到指定目录下，该目录下会有若干个package，每个package代表一个接口类（根据接口文档中的tag对接口分类），每个接口package下会有两个模块：apis.py和models.py
- apis.py: 该类下所有接口的接口定义
- models.py: 接口定义中所有引用的模型定义，包括响应模型
![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/aomaker%20v3.0%E6%96%B0%E5%8A%9F%E8%83%BD-20250227-7.png)

执行自定生成：
```bash
aomaker gen models -s http://127.0.0.1:9999/api/aomaker-openapi.json -o apis/mock2
```

*apis.py*
```python

...
# 1. GET请求，带路径参数  
@define(kw_only=True)  
@router.get("/api/user_details/{user_id}")  
class GetUserDetailAPI(BaseAPIObject[UserDetailResponse]):  
    """获取用户详细信息"""  
  
    @define  
    class PathParams:  
        user_id: int = field(metadata={"description": "用户ID"})  
  
    path_params: PathParams  
    response: Optional[UserDetailResponse] = field(default=UserDetailResponse)  
    endpoint_id: Optional[str] = field(default="get_user_detail_api_user_details__user_id__get")  
  
  
# 2. GET请求，带查询参数  
@define(kw_only=True)  
@router.get("/api/comments")  
class GetCommentsAPI(BaseAPIObject[CommentListResponse]):  
    """获取评论列表"""  
  
    @define  
    class QueryParams:  
        product_id: Optional[int] = field(default=None, metadata={"description": "产品ID"})  
        user_id: Optional[int] = field(default=None, metadata={"description": "用户ID"})  
        min_rating: Optional[int] = field(default=None, metadata={"description": "最低评分"})  
        offset: int = field(default=0, metadata={"description": "偏移量"})  
        limit: int = field(default=10, metadata={"description": "限制数量"})  
  
    query_params: QueryParams = field(factory=QueryParams)  
    response: Optional[CommentListResponse] = field(default=CommentListResponse)  
    endpoint_id: Optional[str] = field(default="get_comments_api_comments_get")  
  
  
# 3. GET请求，无路径参数和查询参数  
@define(kw_only=True)  
@router.get("/api/system/status")  
class GetSystemStatusAPI(BaseAPIObject[SystemStatusResponse]):  
    """获取系统状态"""  
  
    response: Optional[SystemStatusResponse] = field(default=SystemStatusResponse)  
    endpoint_id: Optional[str] = field(default="get_system_status_api_system_status_get")  
  
  
# 4. POST请求，带路径参数和请求体  
@define(kw_only=True)  
@router.post("/api/products/{product_id}/comments")  
class AddProductCommentAPI(BaseAPIObject[CommentResponse]):  
    """添加产品评论"""  
  
    @define  
    class PathParams:  
        product_id: int = field(metadata={"description": "产品ID"})  
  
    @define  
    class RequestBodyModel:  
        id: int = field()  
        product_id: int = field()  
        user_id: int = field()  
        content: str = field()  
        rating: int = field()  
        created_at: datetime = field()  
  
    path_params: PathParams  
    request_body: RequestBodyModel  
    response: Optional[CommentResponse] = field(default=CommentResponse)  
    endpoint_id: Optional[str] = field(default="add_product_comment_api_products__product_id__comments_post")

...

```

*models.py*
```python
...

@define(kw_only=True)  
class Address:  
    street: str = field()  
    city: str = field()  
    province: str = field()  
    postal_code: str = field()  
    country: str = field(default="中国")  
  
  
@define(kw_only=True)  
class UserDetail:  
    user_id: int = field()  
    address: Address = field()  
    phone: str = field()  
    birth_date: Optional[datetime] = field(default=None)  
    tags: List[str] = field(factory=list)  
    preferences: Dict[str, Any] = field(factory=dict)  
  
  
@define(kw_only=True)  
class Comment:  
    id: int = field()  
    product_id: int = field()  
    user_id: int = field()  
    content: str = field()  
    rating: int = field()  
    created_at: datetime = field()
    
...

```

## 4.运行测试用例
mock测试用例在`testcase/test_mock.py`中
```python

@pytest.mark.mock_api  
def test_get_users():  
    """测试获取用户列表API"""  
    query_params = GetUsersAPI.QueryParams(limit=2)  
    res = GetUsersAPI(query_params=query_params).send()  
  
    assert res.response_model.ret_code == 0  
    assert len(res.response_model.data) <= 2  
    assert res.response_model.total >= 0  
  
  
@pytest.mark.mock_api  
def test_create_user():  
    """测试创建用户API"""  
    request_body = CreateUserAPI.RequestBodyModel(  
        id=4,  
        username="赵四",  
        email="zhaoliu@example.com",  
        created_at=datetime.now()  
    )  
  
    res = CreateUserAPI(request_body=request_body).send()  
  
    assert res.response_model.ret_code == 0  
    assert res.response_model.data.id == 4  
    assert res.response_model.data.username == "赵四"


```

运行测试用例
```bash
arun -e mock -m mock_api
```

## 6.查看aomaker live console（可选）
可以在开始运行用例前，打开该页面，可以实时查看各个子进程的用例执行进度和日志。
打开方式：
```bash
aomaker service start --web
```
![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/aomaker%20v3.0%E6%96%B0%E5%8A%9F%E8%83%BD%EF%BC%88%E5%90%ABquick%20start%EF%BC%89-20250316.png)



## 后续步骤

恭喜！你已经了解了 AOmaker 的基本使用方法。接下来你可以：

- 查看 [API 建模](/docs/api-modeling) 文档，学习更多接口定义方法
- 了解 [环境管理](/docs/environments)，实现多环境测试
- 探索 [插件系统](/docs/plugins)，扩展 AOmaker 功能
- 访问 [GitHub 仓库](https://github.com/aomaker/aomaker) 获取更多示例 