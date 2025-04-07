# 新增文档示例

这是一个新增的Markdown文档示例，用于演示如何通过通用的文档加载组件挂载新的文档内容。

## 文档内容结构

Markdown文档应当包含以下基本结构：

1. 标题（使用`#`）
2. 小节标题（使用`##`、`###`等）
3. 段落文本
4. 代码示例（使用```包围）
5. 列表（有序或无序）
6. 链接

## 代码示例

以下是一个Python代码示例：

```python
def hello_world():
    """打印Hello, World!"""
    print("Hello, World!")
    
if __name__ == "__main__":
    hello_world()
```

## 如何添加更多文档

要添加更多文档，只需要：

1. 在`src/content/docs/`目录下创建新的Markdown文件
2. 在`DocContent.jsx`中的`docMap`对象中添加新的映射关系
3. 在`DocLayout.jsx`的导航菜单中添加相应的链接

例如，要添加一个名为`advanced-usage.md`的文档，过程如下：

### 1. 创建Markdown文件

在`src/content/docs/`目录下创建`advanced-usage.md`文件。

### 2. 更新文档映射

在`DocContent.jsx`中添加映射：

```jsx
const docMap = {
  // 现有映射...
  'advanced-usage': 'advanced-usage.md',
};
```

### 3. 更新导航菜单

在`DocLayout.jsx`中添加菜单项：

```jsx
const docMenuItems = [
  // 现有菜单项...
  { 
    title: '高级用法', 
    path: '/docs/advanced-usage', 
    icon: <ChevronRightIcon className="h-5 w-5" /> 
  },
];
```

## 文档链接示例

下面是一些文档内部链接的示例：

- [返回介绍](/docs)
- [查看快速开始](/docs/quick-start)
- [API建模](/docs/api-modeling)

## 图片示例

您也可以在Markdown中包含图片：

![示例图片](https://via.placeholder.com/600x300) 