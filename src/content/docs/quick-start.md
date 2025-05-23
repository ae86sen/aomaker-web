# 快速开始

> [!WARNING]
>📢**安装之前**：    
>  
>0.确保python版本为3.9~3.12  
>1.测试报告依赖allure，所以请提前安装好allure-command  
>2.先创建一个虚拟环境，用venv，conda，uv（推荐），poetry都行  
>3.确保进到这个虚拟环境后，再安装aomaker  

## 0.安装

```bash
pip install aomaker
```

## 1.创建脚手架

```bash
# 创建脚手架
aomaker create xxx
# 进入脚手架项目
cd xxx
```
<img src="https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/20250429140340.png" width="50%" height="50%" alt="描述文本">


## 2.开启mock server

为了调用预置的mock接口，先开启mock服务：

```bash
aomaker mock start --web
```

可以查看接口文档
![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/aomaker%20v3.0%E6%96%B0%E5%8A%9F%E8%83%BD-20250227.png)

## 3.根据接口文档自动生成接口定义

> 脚手架已经预置了mock接口的定义，也可以体验如何自动生成。

执行自动生成后，会在项目根目录下的apis/mock2目录下生成模型定义代码。

```bash
aomaker gen models -s http://127.0.0.1:9999/api/aomaker-openapi.json -o apis/mock2
```

> -s 指定接口文档位置，可以是url，也可以是本地文件（JSON/YAML），-o 指定最终生成代码的目录。
>
> 更多参数和用法可以通过 aomaker gen models --help 查看。

![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/20250429150804.png)


## 4.运行测试用例

执行：
```bash
arun -e mock -m mock_api
```


> arun是aomaker运行测试用例的主命令，-e为环境切换参数，-m为指定运行哪些标记的测试用例（用法完全同pytest）。
>
> 更多参数和使用方法可以通过 arun --help 查看。


![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/20250429145331.png)


## 5.查看测试报告
测试报告位置：项目根目录下reports/aomaker-report.html

![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/20250428200733.png)

## 6.查看aomaker live console（可选）

可以在开始运行用例前，打开该页面，可以实时查看各个子进程的用例执行进度和日志。

打开方式：
```bash
aomaker service start --web
```

![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/20250428204248.png)

![](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/20250428201246.png)



## 后续步骤

恭喜！你已经了解了 AOmaker 的基本使用方法，接下来你可以了解更多基础特性和高级特性。