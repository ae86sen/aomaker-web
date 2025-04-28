## aomaker dashboard
在并行运行用例的情况下，想看到每个子进程/线程的测试进度，可以通过`aomaker dashboard` 查看，
该面板提供： 
- 当前测试的环境配置信息
- 当前测试的总体进度，子进程/线程进度
- 当前测试的实时日志信息
打开方式:
```bash
aomaker service start --web
```

参数说明：
- `--web` : 打开dashboard页面
- `--port`: 指定服务端口号，默认8888

![image.png](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/20250428204248.png)

![image.png](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/20250428201246.png)