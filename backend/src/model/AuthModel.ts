import { IsDefined, MinLength, Matches } from 'class-validator';
import mongoose from "mongoose";
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export class AuthModel {
  username: string | undefined;
  email: string | undefined;

  // TODO beautify pattern message
  @IsDefined()
  @MinLength(6, { message: 'Title is too short, min length is 6 characters' })
  @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$', undefined, { message: 'password is weak' })
  password: string;
}

export class RegisterModel extends AuthModel {
  @IsDefined()
  @MinLength(4, { message: 'Title is too short, min length is 6 characters' })
  username: string;

  // TODO add pattern validation
  @IsDefined()
  email: string;
}

export const authDbSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

export const authDbModel = mongoose.model('auth', authDbSchema)