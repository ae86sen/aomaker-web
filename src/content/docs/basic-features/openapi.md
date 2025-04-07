## 根据接口文档自动生成接口定义

`aomaker`提供强大的自动化能力，可将遵循`Swagger 2.0`与`OpenAPI 3.x`规范的接口文档一键转化为Python接口定义。

### 用法

```bash
Usage: aomaker gen models [OPTIONS]

Options:
  -s, --spec TEXT                   OpenAPI规范文件路径（支持JSON/YAML/URL）
  -o, --output TEXT                 生成代码的输出目录
  -c, --class-name-strategy TEXT    接口类命名策略，支持operation_id/summary/tags [默认: operation_id]
  -cs, --custom-strategy TEXT       自定义类名策略的Python模块路径（例如: 'mypackage.naming.custom_function'）
  -B, --base-api-class TEXT         指定接口基类完整路径 [默认: aomaker.core.api_object.BaseAPIObject]
  -A, --base-api-class-alias TEXT   指定接口基类的别名（可选）
```

### 类名生成策略

`aomaker`内置三种命名策略：

- **operation_id**（默认）：依据OpenAPI文档中的`operation_id`生成，若无则回退到其他策略
- **summary**：基于接口的`summary`字段生成（中文时不推荐）
- **tags**：根据接口的`tag`、`path`和`method`组合生成

如果内置策略无法满足命名需求，可以自定义类名生成函数。
例如，若接口路径如下：

- `/api/v1/user/regist`
- `/api/v1/user/login`

期望类名分别为`UserRegistAPI`、`UserLoginAPI`，可在`conf/naming.py`中定义函数：

```python
from aomaker.maker.models import Operation  
  
  
def custom_naming(path: str, method: str, operation: Operation) -> str:  
    parts = path.split('/')  
    parts = [p for p in parts if p]  
    last_two = parts[-2:]  
  
    if len(last_two) > 1:  
        first_part = last_two[0].capitalize()  
  
        last_part = last_two[1]  
        if last_part and last_part[0].islower():  # 检查是否为小驼峰（首字母小写）  
            last_part = last_part[0].upper() + last_part[1:]  
  
        camel_case = first_part + last_part  
    elif len(last_two) == 1:  
        last_part = last_two[0]  
        if last_part and last_part[0].islower():  
            camel_case = last_part[0].upper() + last_part[1:]  
        else:  
            camel_case = last_part.capitalize()  
    else:  
        camel_case = ""  
  
    return f"{camel_case}API"
```

执行时指定`--cs conf.naming.custom_naming`参数即可。

### 自动生成目录结构

```
apis/demo/
├── notebooks/            # 按OpenAPI的tag自动分包
│   ├── apis.py           # 接口类定义
│   └── models.py         # 嵌套模型定义
└── ...                   # 其他业务模块
```

为避免每次手动输入参数，可以将配置预定义在`conf/aomaker.yaml`中：

```yaml
openapi:
    spec: "api-doc.json"                # OpenAPI规范文件
    output: "apis/demo"                 # 代码输出目录
    class_name_strategy: "operation_id" # 预定义命名策略
    custom_strategy: "conf.naming.custom_naming"  # 自定义命名策略（可选）
    base_api_class: "aomaker.core.api_object.BaseAPIObject"  # 基类路径
    base_api_class_alias: "BaseAPI"     # 基类别名（可选）
```

