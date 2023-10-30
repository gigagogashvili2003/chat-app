import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsLibService {
  public constructor() {}

  public generateOtpCode() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
