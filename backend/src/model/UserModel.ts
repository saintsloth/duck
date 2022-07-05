import { IsDefined } from 'class-validator';

export class UserModel {
  @IsDefined()
    country: string;

  @IsDefined()
    city: string;
}
