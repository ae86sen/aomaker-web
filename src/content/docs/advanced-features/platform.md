## 接入测试平台
`aomaker` 可以以服务的形式对接测试平台，通过`aomaker service start` 启动服务，并暴露如下接口：
HTTP:
- `/config/{param}`-GET : `/config/current` 获取当前环境配置信息，`/config` 获取配置文件全部配置信息
- `/stats`-GET： 获取静态接口统计信息
- `/stats/count`-GET：获取静态接口统计数量
- `/summary`-GET： 获取测试报告统计，包括：
	- 成功率
	- 失败率
	- 跳过率
	- 阻塞率
	- 用例总数
	- 通过数量
	- 失败数量
	- 跳过数量
	- 阻塞数量
	- 用例执行耗时
	- 测试任务执行开始时间
	- 测试任务结束时间
- `/progress`-GET： 用例进度时间

WebSocket:
- `/ws/logs`： 运行实时日志
- `/ws/progress`： 运行实时进度
