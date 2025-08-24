import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(socket: Socket, data: any): void {
    const { message, nickname } = data;
    socket.broadcast.emit('message', `${nickname}: ${message}`);
  }
}

@WebSocketGateway({
  namespace: 'room',
})
export class RoomGateway {
  constructor(private readonly chatGateway: ChatGateway) {}
  rooms: string[] = [];

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createRoom')
  handleMessage(@MessageBody() data) {
    const { nickname, room } = data;
    this.chatGateway.server.emit('notice', {
      message: `${nickname}님이 ${room}방을 생성했습니다.`,
    });
    this.rooms.push(room);
    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(socket: Socket, data: any) {
    const { room, nickname, toLeaveRoom } = data;
    socket.leave(toLeaveRoom);
    this.chatGateway.server.emit('notice', {
      message: `${nickname}님이 ${room}방에 참여했습니다.`,
    });
    socket.join(room);
  }

  @SubscribeMessage('message')
  handleMessageToRoom(socket: Socket, data: any) {
    const { message, nickname, room } = data;
    console.log(data);
    socket.broadcast.emit('message', {
      message: `${nickname}: ${message}`,
      room,
    });
  }
}
