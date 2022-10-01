import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getRandomSessionId(
    socketIds: string[],
    exclude: string[] = [],
  ): string {
    const whitelistedSocketIds = this.getWhitelistedSessionIds(
      socketIds,
      exclude,
    );

    return whitelistedSocketIds[
      Math.floor(Math.random() * whitelistedSocketIds.length)
    ];
  }

  public getRandomSessions(
    socketIds: string[],
    amount = 5,
    exclude: string[] = [],
  ) {
    const whitelistedSocketIds = this.getWhitelistedSessionIds(
      socketIds,
      exclude,
    );

    const shuffled = whitelistedSocketIds.sort(() => 0.5 - Math.random());

    return shuffled.splice(0, amount);
  }

  public getWhitelistedSessionIds(
    socketIds: string[],
    exclude: string[],
  ): string[] {
    const whitelistedSocketIds = socketIds.filter(
      (socketId) => !exclude.includes(socketId),
    );

    if (!whitelistedSocketIds.length) {
      throw new Error('Not enough clients');
    }

    return whitelistedSocketIds;
  }
}
