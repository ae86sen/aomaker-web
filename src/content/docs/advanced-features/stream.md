## HTTP流式响应
`aomaker`支持流式响应处理，适用于大量数据传输、实时数据获取等场景。
下面介绍流式响应的使用方法。
### 基本流程

流式响应处理流程包括：
1. 发送流式请求  
2. 接收流式响应  
3. 处理流数据  

### 基础流式请求
```python
from attrs import define, field
from aomaker.core.api_object import BaseAPIObject


@define(kw_only=True)
@router.post("/v1/chat/completions")
class StreamChatAPI(BaseAPIObject):
	
	@define
	class RequestBodyModel:
		messages: List[Dict]
		model: str = field(default="gpt-3.5-turbo")
	request_body: RequestBodyModel
		


messages = [{"role": "user", "content": "讲个故事"}]
request_body = StreamChatAPI.RequestBodyModel(messages=messages)
api = StreamChatAPI(request_body=request_body)

# 发送请求，并通过stream=True指定获取流式响应
response = api.send(stream=True)

# 处理流式响应
def process_chunk(chunk):
    print(f"收到数据: {chunk}")

# 使用行模式处理流
response.process_stream(
    stream_mode="lines",
    callback=process_chunk
)
```

### JSON流处理示例
```python
# JSON流处理
def handle_json_chunk(json_data):
    if "choices" in json_data:
        content = json_data["choices"][0]["delta"].get("content", "")
        if content:
            print(content, end="", flush=True)

# 发送请求
response = api.send(stream=True)

# 处理JSON流
response.process_stream(
    stream_mode="json",
    callback=handle_json_chunk
)
```
### 原始流处理示例
```python
# 原始流处理
def handle_raw_chunk(chunk):
    # 自行解析二进制数据
    print(f"原始数据块大小: {len(chunk)} 字节")
    # 处理二进制数据...

response = api.send(stream=True)
response.process_stream(
    callback=handle_raw_chunk
)
```

### 流式响应的三种模式

1. 原始流模式：直接处理原始二进制数据块  

2. 行模式：按行处理文本数据，适用于行分隔的数据流  

3. JSON模式：处理JSON格式的数据流，每个数据块解析为JSON对象  

根据实际需求选择合适的处理模式，通过回调函数处理流式数据。
