import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  public constructor(private readonly authService: AuthService) {}

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth.token;

    if (!token) {
      throw new WsException('Unauthorized');
    }

    return this.authService.verifyTempToken(token);
  }
}
