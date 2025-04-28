## 接口信息静态统计
如果你想统计当前项目中有多少接口，每个接口的位置，`aomaker` 提供命令进行收集统计到`statistics` 表中。
比如要统计`apis/mock2` 下的所有接口信息：
```bash
aomaker gen stats --api-dir apis/mock2 
```

在`aomaker.db` 中的`statistics` 表中可以查看：

![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/aomaker%20v3.0%E6%96%B0%E5%8A%9F%E8%83%BD%EF%BC%88%E5%90%ABquick%20start%EF%BC%89-20250330.png)

也可以通过命令`aomaker show stats` 查看。

![image.png](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/20250428203444.png)
