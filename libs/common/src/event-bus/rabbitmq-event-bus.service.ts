import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, ChannelModel, Channel, ConsumeMessage } from 'amqplib';

import { AbstractEventBus, Event } from '@app/common/event-bus/abstracts';

@Injectable()
export class RabbitmqEventBusService
  implements AbstractEventBus, OnModuleInit, OnModuleDestroy
{
  private connection: ChannelModel;
  private channel: Channel;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.connection = await connect(this.configService.get('RABBITMQ_URL'));
    this.channel = await this.connection.createChannel();
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }

  async publish(event: Event): Promise<void> {
    await this.channel.assertQueue(event.type, { durable: true });
    this.channel.sendToQueue(event.type, Buffer.from(JSON.stringify(event)));
  }

  async subscribe(
    eventType: string,
    handler: (event: Event) => Promise<void>
  ): Promise<void> {
    await this.channel.assertQueue(eventType, { durable: true });
    this.channel.consume(eventType, async (msg: ConsumeMessage) => {
      if (!msg) return;
      const event = JSON.parse(msg.content.toString());
      await handler(event);
      this.channel.ack(msg);
    });
  }
}
