## 并行运行测试用例
`aomaker` 提供了**多线程**和**多进程**两种方式以加速用例执行效率，并支持三种粒度的任务分配模式。
同时，在多线程模式下对 `allure` 报告进行了优化，避免了类似 `pytest-parallel` 可能出现的报告生成异常问题。
### aomaker 运行流程
![x.png](https://picgo2listen.oss-cn-beijing.aliyuncs.com/imgs/ChatGPT%20Image%202025%E5%B9%B43%E6%9C%8831%E6%97%A5%2023_15_29.png)


启动后，执行流程如下：

1. 读取并加载 `config.yaml` 配置文件。
2. 执行 `hooks.py` 中定义的自定义 CLI 命令和 hook（若存在）。
3. 根据 CLI 参数指定的多任务模式（线程或进程）及分配模式，启动相应的子任务。（若在 `aomaker.yaml` 中定义了 worker 策略，则按照该策略执行）
4. 在子线程或子进程中启动 `pytest` 运行用例。
5. 所有子任务完成后，进行报告收集、聚合及环境清理，结束运行。

### 多线程

#### 启动方式

提供两种启动方式：**CLI** 和 **run.py**。

1. CLI启动

```shell
arun --mt --dist-xxx xxx
# 或
aomaker run --mt --dist-xxx xxx
```

CLI参数说明：
```css
--mt, --multi-thread     指定多线程模式
--dist-mark              按标记(mark)分配任务
--dist-file              按测试模块分配任务
--dist-suite             按测试套件分配任务
```

2. run.py启动

_run.py_

```python
from aomaker.cli import main_run  
  
if __name__ == '__main__':  
    main_run(env="mock", mt=True, d_mark="mock_api1 mock_api2 mock_api3")
```


#### 任务分配模式（从细粒度到粗粒度）

1. 按标记(mark)分配
按照 pytest 的 `mark` 功能为子线程分配任务。

- CLI示例：
```shell
arun --mt --dist-mark demo1 demo2 demo3
```
- run.py 示例:
```python
    main_run(mt=True, d_mark="demo1 demo2 demo3")
```

> [!WARNING]注意：  
>  
> - 每个标记下的用例必须相互独立。
> - 提供多少个标记，即开启多少个线程。

2. 按测试模块分配
即按照测试文件来分配任务给子线程，比如在`testcases\test_api`目录下有`test_demo1.py`、`test_demo2.py`、`test_demo3.py`三个测试模块，比如希望这三个模块下的测试case分别由三个子线程接管执行。

- CLI示例：
```shell
arun --mt --dist-file testcases\test_api
```
- run.py 示例:
```python
main_run(env="mock", mt=True, d_file="testcases\test_api")
```

> [!WARNING]注意：  
>  
> - 每个测试模块内的用例必须相互独立。
> - 指定目录下测试模块的数量即为开启线程数。


3. 按测试套件分配
即按照测试目录来分配任务给子线程，比如在`testcases\test_scenario`目录下，有`test_scenario1`、`test_scenario2`、`test_scenario3`等三个测试目录，每个目录下还有若干测试模块，比如希望这三个目录下的所有测试case分别由三个子线程接管执行。

- CLI示例：
```shell
arun --mt --dist-suite testcases\test_scenario
```
- run.py 示例:
```python
main_run(env="mock", mt=True, d_suite="testcases\test_scenario")
```

> [!WARNING]注意：  
>  
> - 每个测试套件内的用例必须相互独立。
> - 指定目录下测试套件的数量即为开启线程数。

### 多进程

`aomaker`目前暂时不支持在windows上创建多进程，linux、mac是完美支持的。

#### 启动方式

提供两种启动方式：**CLI** 和 **run.py**。

1. CLI启动

```shell
arun --mp --dist-xxx xxx
# 或
aomaker run --mp --dist-xxx xxx
```


2. run.py启动

```python
from aomaker.cli import main_run  
  
if __name__ == '__main__':  
    main_run(env="mock", mp=True, d_mark="mock_api1 mock_api2 mock_api3")
```

#### 分配模式

与多线程模式一致，区别仅在于任务分配给子进程。

> [!WARNING]注意： 
>在多进程模式下，默认最大子进程数为当前系统可用CPU核心数，可以通过`-p` 参数指定核心数，如果任务数量超过指定核心数，任务将会进行排队。

### worker策略分配配置（推荐大规模用例场景）
当测试工程较大且需并行多个标记时，CLI 命令可能过长。因此，`aomaker` 自 v2.3.0 起支持通过配置文件定义多任务分配策略。

#### 策略配置文件示例
在 `conf/dist_strategy.yaml` 中配置：
```yaml
target: ['iaas', 'hpc']
marks:
  iaas:
    - iaas_image
    - iaas_volume
  hpc:
    - hpc_sw
    - hpc_fs

```
参数说明：

- `target`: 指定要执行的策略目标。
- `marks`: 定义标签分类，每个分类下包含具体的测试标签。

例如，上述配置将产生4个标签（iaas_image、iaas_volume、hpc_sw、hpc_fs），并分配给4个 worker 并行执行。

#### 多策略配置示例

有时候，我们可能有不同的测试场景，需要跑不同的用例，即不同的标签，又不想每次重新配置。所以在此基础上，还支持**多策略配置，**具体用法如下：

_conf/dist_strategy.yaml_

```yaml
target: ['iaas.smoke','hpc']
marks:
  iaas:
    smoke:
      - iaas_image
      - iaas_volume
    p2:
      - iaas_image_p2
      - iaas_volume_p2
      - iaas_network_p2
 
  hpc:
    - hpc_sw
    - hpc_fs
    
```

- 执行 iaas 冒烟测试时，设置 `target: ['iaas.smoke']`；
- 执行 iaas P2 测试时，设置 `target: ['iaas.p2']`；
- 若设置 `target: ['iaas.p2', 'hpc']`，则产生5个标签并分配给5个 worker 并行执行。

#### 使用策略配置启动

当使用策略配置时，CLI 启动变为：

- 多进程：`arun --mp`
- 多线程：`arun --mt`

> [!WARNING]注意：
> -  若不指定具体分配模式参数，则默认使用策略配置文件进行任务分配；
> -  若指定了具体分配模式参数，则优先使用指定参数进行任务分配。
