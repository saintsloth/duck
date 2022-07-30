import mongoose from 'mongoose';

export const userDbSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: { type: String, required: true },
  session_id: { type: String, required: true },
  token: { type: String, required: true },
});

export const AuthDbModel = mongoose.model('auth', userDbSchema);
