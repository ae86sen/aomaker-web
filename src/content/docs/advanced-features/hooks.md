## 注册全局钩子函数
虽然pytest已经提供了丰富且强大的hook注册机制，为什么aomaker仍要设计自己的hook机制呢？

原因与@command类似，aomaker设计的hook机制并非简单的重复造轮子，而是对pytest在多任务模式下的一种功能补充。

在aomaker的多任务模式下，pytest注册的session级别hook函数仅会在子进程或子线程中执行，而无法在主进程或主线程中生效。
而aomaker注册的hook函数则恰好解决了这个问题：
它会在主进程或主线程中执行，并且其执行顺序是在pytest hook之前。

通过使用aomaker的@hook装饰器，用户可以在主进程或主线程内自定义各类启动前配置，随后再交由pytest使用。

示例用法（hooks.py）：

```python
from aomaker.aomaker import hook

@hook
def echo_hello():
    print("echo hello~~~~~")
```

上述hook函数在注册后，将在aomaker的配置初始化阶段自动调用，即pytest启动之前。
