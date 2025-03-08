
***
```c#
public async void SendProductMessage<T>(T message)
{
	var factory = new ConnectionFactory()
	{
		HostName = "localhost",
		Port = 5672,
		UserName = "guest",
		Password = "guest"
	};
	using var connection = await factory.CreateConnectionAsync();
	using var channel = await connection.CreateChannelAsync();

	// 声明队列
	await channel.QueueDeclareAsync(
		queue: "myqueue",
		durable: true, //是否持久化
		exclusive: false, //false-可以被多个连接访问
		autoDelete: false,
		arguments: null
	);
	
	// 准备消息内容
	var json=JsonSerializer.Serialize(message);
	var body = Encoding.UTF8.GetBytes(json);
	
	// 发送消息
	await channel.BasicPublishAsync(
		exchange: "",
		routingKey: "myqueue",
		body: body
	);
}
```

```c#
public async void ReceiveMessage()
{
	var factory = new ConnectionFactory()
	{
		HostName = "localhost",
		Port = 5672,
		UserName = "guest",
		Password = "guest"
	};
	using var connection = await factory.CreateConnectionAsync();
	using var channel = await connection.CreateChannelAsync();
	// 声明队列
	await channel.QueueDeclareAsync(
		queue: "myqueue",
		durable: true,
		exclusive: false,
		autoDelete: false,
		arguments: null
	);
	
	// 设置消费者
	var consumer = new AsyncEventingBasicConsumer(channel);
	consumer.ReceivedAsync += async (model, ea) => {
		var receivedMessage = Encoding.UTF8.GetString(ea.Body.ToArray());
		Console.WriteLine($"接收到消息：{receivedMessage}");
		// 确认消息已处理
		await channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
	};
	
	// 开始消费
	await channel.BasicConsumeAsync(
	queue: "myqueue",
	autoAck: false,
	consumer: consumer
	);
}
```