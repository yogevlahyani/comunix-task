import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/auth.guard';
import { AuthService } from './auth/auth.service';

@UseGuards(JwtAuthGuard)
@WebSocketGateway(8080, {
  path: '/socket.io',
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  public constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  public handleConnection(client: Socket) {
    if (!client.handshake.auth.token) {
      return client.disconnect();
    }

    const isAuthorized = this.authService.verifyTempToken(
      client.handshake.auth.token,
    );

    return !isAuthorized && client.disconnect();
  }

  public handleDisconnect(client: Socket) {
    // TODO: Revoke token
    // JWT is not the best choice when there is a requirement of revoking a token
    // A good idea would be to save the session token within a database so it would be easy to revoke the token
    return;
  }

  @SubscribeMessage('spin')
  public async spinEvent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const allSockets = await this.server.allSockets();
    const currentSocketId = client.id;

    const randomUser = this.appService.getRandomSessionId(
      Array.from(allSockets),
      [currentSocketId],
    );

    console.log('Send a message to a random user', randomUser, message);
    this.server.sockets.to(randomUser).emit('message', message);
  }

  @SubscribeMessage('wild')
  public async wildEvent(
    @MessageBody() body: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { amount, message } = JSON.parse(body);

    if (!message) {
      throw new WsException('Message must be provided');
    }

    const allSockets = await this.server.allSockets();
    const currentSocketId = client.id;

    const randomUsers = this.appService.getRandomSessions(
      Array.from(allSockets),
      amount,
      [currentSocketId],
    );

    console.log(
      'Send a message to X random users. X will be determined by the client.',
      randomUsers,
      message,
    );

    this.server.in(randomUsers).emit('message', message);
  }

  @SubscribeMessage('blast')
  public async blastEvent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const allSockets = await this.server.allSockets();
    const currentSocketId = client.id;

    const users = this.appService.getWhitelistedSessionIds(
      Array.from(allSockets),
      [currentSocketId],
    );

    console.log('Sends a message to all users', users, message);

    this.server.in(users).emit('message', message);
  }
}
