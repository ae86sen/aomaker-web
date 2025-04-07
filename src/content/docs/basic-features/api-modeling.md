## 接口建模


在`aomaker`中，每个接口都对应一个Python类定义。

### 步骤

1. **导入必要模块**

   ```python
   from attrs import define, field
   from aomaker.core.router import router
   from aomaker.core.api_object import BaseAPIObject  # 如有自定义基类，则导入对应基类
   ```

2. **指定路由及请求方法**

   ```python
   @router.post("/api/xxx/yyy")
   ```

3. **定义接口类**

   - 类名推荐以`API`结尾，继承接口基类`BaseAPIObject`
   - 若需IDE对接口响应提供自动补全和类型提示，需指定响应模型的泛型类。

4. **核心参数说明**
   每个接口类一般包含以下4个核心参数：

   - `path_params`：路径参数，替换路由中`{}`内的变量
   - `query_params`：查询参数
   - `request_body`：请求体
   - `response`：响应体

   > [!tip] 建议
   >
   > - 上述四个参数模型使用`@define`定义
   > - 除`response`外，其它参数模型推荐定义在接口类内部，以获得更友好的IDE提示，且避免额外导入
   > - 推荐使用接口文档自动生成，不建议手动编写

### 推荐的目录结构

```
apis/
├── xxx/
│   ├── apis.py       # 接口类定义
│   └── models.py     # 嵌套模型定义
└── ...               # 其他接口类型
```

### 案例展示  

*example1-查询列表接口*
```python
@define(kw_only=True)  
@router.get("/api/users")  
class GetUsersAPI(BaseAPIObject[UserListResponse]):  
    """获取用户列表"""  
  
    @define  
    class QueryParams:  
        offset: int = field(default=0, metadata={"description": "偏移量"})  
        limit: int = field(default=10, metadata={"description": "限制数量"})  
        username: Optional[str] = field(  
            default=None, metadata={"description": "用户名，模糊搜索"}  
        )  
  
    query_params: QueryParams = field(factory=QueryParams)  
    response: Optional[UserListResponse] = field(default=UserListResponse)
```

*example2-详细查询接口*
```python
@define(kw_only=True)  
@router.get("/api/users/{user_id}")  
class GetUserAPI(BaseAPIObject[UserResponse]):  
    """获取单个用户信息"""  
  
    @define  
    class PathParams:  
        user_id: int = field(metadata={"description": "用户ID"})  
  
    path_params: PathParams  
    response: Optional[UserResponse] = field(default=UserResponse)
```

*example3-创建接口*
```python
@define(kw_only=True)  
@router.post("/api/users")  
class CreateUserAPI(BaseAPIObject[UserResponse]):  
    """创建新用户"""  
  
    @define  
    class RequestBodyModel:  
        id: int = field()  
        username: str = field()  
        email: str = field()  
        created_at: datetime = field()  
        is_active: bool = field(default=True)  
  
    request_body: RequestBodyModel  
    response: Optional[UserResponse] = field(default=UserResponse)
```

*example-有嵌套字段的接口*
```python
@define(kw_only=True)  
class Comment:  
    id: int = field()  
    product_id: int = field()  
    user_id: int = field()  
    content: str = field()  
    rating: int = field()  
    created_at: datetime = field()

@define(kw_only=True)  
@router.post("/api/product_details")  
class CreateProductDetailAPI(BaseAPIObject[ProductDetailResponse]):  
    """创建产品详细信息"""  
  
    @define  
    class RequestBodyModel:  
        basic_info: Product = field()  
        sales_count: int = field(default=0)  
        comments: List[Comment] = field(factory=list)  
        related_products: List[int] = field(factory=list)  
        specifications: Dict[str, Any] = field(factory=dict)  
  
    request_body: RequestBodyModel  
    response: Optional[ProductDetailResponse] = field(default=ProductDetailResponse)
```