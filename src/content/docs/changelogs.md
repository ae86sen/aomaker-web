## 2025.4.17- v3.0.0 正式发布🚀

## 2025.4.17- v3.0.0 beta0.15
- 新增 Mock Server中增加登录接口，部分mock接口增加权限校验
- 新增 aomaker图标和logo，更新dashboard页面logo
- 增强 JsonSchemaParser的健壮性，在JsonSchemaParser类中添加递归深度检查，以防止在处理schema时出现过深递归导致的潜在问题。返回类型为Any以确保稳定性。
- 修复 接口定义中response字段type_hint为列表嵌套自定义模型时，导入信息不对的问题
- 修复 流式响应异常处理的问题
- 优化 OpenAPIParser类中的响应解析逻辑，增加对响应内容存在性的检查，确保在解析schema时捕获异常并记录错误
- 修复 anyOf 或 oneOf 只包含一个非 null 类型和一个 null 类型的时，生成的type_hint，重复生成Optional的问题
- 优化 类名规范化函数，增强对Unicode字符的支持，处理非法字符和数字开头的情况，确保生成有效的Python类名

## 2025.4.3- v3.0.0 beta0.14
- 优化 接口类名符合规范化处理逻辑
- 增强 类型映射，支持更多JSON schema format 关键字
- 增强  JSON schema约束转换 (`minLength` , `maxLength`, `minimum`, `maximum`, `exclusiveMinimum` , `exclusiveMaximum`, `pattern`, `multipleOf`, `minItems`, `maxItems`, `uniqueItems`)
- 支持 OPENAPI 3.1中的 const 关键字

## 2025.3.28- v3.0.0 beta0.13
- 优化 解析openapi文档时类型名称处理逻辑，确保自定义类型名称规范化。

## 2025.3.27- v3.0.0 beta0.12
- 新增 自定义中间件注册机制
- 优化 JsonSchemaParser 中属性名称的处理逻辑，确保生成的模型名称符合规范
- 优化 自动生成的apis.py和models.py文件写入逻辑，确保生成的文件使用UTF-8编码
- 脚手架新增中间件文件夹及配置文件

## 2025.3.24- v3.0.0 beta0.11
- 新增 HTTP流式响应支持
- 修复 自动生成代码时接口类名的判断逻辑
- 增强 text/plain类型的请求体/响应体处理
- 修复 无响应模型的接口请求发送时报错的问题
- 兼容 python3.8类型注解问题
- 修复 aomaker.yaml中custom_strategy覆盖命令行参数的问题

## 2025.3.17- v3.0.0 beta0.10
- 新增dist_strategy.yaml配置文件，用于用例并行策略配置
- 新增aomaker.yaml配置文件，重构命名策略加载逻辑，支持自定义命名策略。
- 优化命令行参数处理，确保优先使用命令行参数。
- 移除APIRouter的backend_prefix和frontend_prefix参数，参数重组聚焦在post_prepare钩子函数中处理。

## 2025.3.12- v3.0.0 beta0.9
- 增强 SwaggerAdapter 对 body、formData 参数的处理逻辑
- 优化 ClassNameStrategy 生成类名的策略
- 改进 JsonSchemaParser 中模型名称和导入的规范化处理
- 修复 OpenAPIParser 中请求体和响应体解析的边界情况
- 增强 响应模式验证逻辑，支持动态更新和比较模式
- 优化 OpenAPI 解析器，增强对多媒体类型和参数处理的兼容性

## 2025.3.6- v3.0.0 beta0.8
- feat: 增加兼容swagger2.0接口文档转换
- fix: 修复模板渲染时模型中有python关键字导致失败的问题
- fix: 修复接口响应头无content-type时response转化json格式失败的问题

## 2025.3.4- v3.0.0 beta0.7
- fix: 修复解析openapi 3.x数据时，未适配java泛型类的问题
- refactor: 重构aomaker live console UI/UX
- fix: 修复aomaker live console页面日志和进度条显示问题
- fix：修复main_run执行失败的问题
- fix: 修复main_run带自定义参数时参数解析错误的问题
- fix：修复脚手架创建时报错找不到.aomaker文件的问题
## 2025.2.27- v3.0.0 beta0.6
- feat: 增加mock server和cli命令
- bugfix: 修复openapi文档解析时anyof字段处理问题
- bugfix: 修复openapi文档解析时非必填参数类型问题
- update: 增加转换器对datetime,decimal,uuid等类型的反序列化钩子
- bugfix: 修复日志中间件未生效问题
- update: 脚手架增加mock示例文件

## 2025.2.26- v3.0.0 beta0.5
- 移除@dependence，@aysnc_api,@update
- 优化aomaker live console页面ui
- 优化脚手架
- 优化数据库路径查找

## 2025.2.22- v3.0.0 beta0.4
- 调整优化response jsonschema存储方案
- 优化sqlite基类操作api
- 优化cache，stats，schema，config四张表的操作api

## 2025.2.21- v3.0.0 beta0.3
- 优化单/多进程下的session管理
- 优化鉴权管理
- cache模块更名为storage

## 2025.2.18- v3.0.0 beta0.2
- 修复enum模型解析问题
- 优化request body/response 多类型content解析

## 2025.2.17- v3.0.0 beta0.1
- 标准化的接口建模和编排方案
- 全面对接openapi规范，支持从接口文档一键生成标准化接口定义
- aomaker服务化，提供一些统计、日志、进度接口给到测试平台，方便集成