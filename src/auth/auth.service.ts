import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  public constructor(private readonly jwtService: JwtService) {}

  public createTempToken(): string {
    return this.jwtService.sign({
      sub: crypto.randomUUID(),
    });
  }

  public decodeTempToken(token: string): string | Record<string, any> {
    return this.jwtService.decode(token);
  }

  public verifyTempToken(token: string): boolean {
    try {
      return !!this.jwtService.verify(token);
    } catch (e) {
      console.error('Error verify jwt token', e);
      return false;
    }
  }
}
