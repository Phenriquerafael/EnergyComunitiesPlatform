import { isEmail } from 'validator';
import { IUserPersistence } from '../../dataschema/IUserPersistence';
import mongoose from 'mongoose';


const User = new mongoose.Schema(
  {
    domainId: { 
      type: String,
      unique: true
    },

    firstName: {
      type: String,
      required: [true, 'Please enter first name'],
      index: true,
    },

    lastName: {
      type: String,
      required: [true, 'Please enter last name'],
      index: true,
    },

    email: {
      type: String,
      lowercase: true,  
      unique: true,
      required: [true, 'Please enter email'],
      validate: [isEmail, 'Please enter a valid email'],
      index: true,

    },
    phoneNumber: {
      type: String,
      required: [true, 'Please enter phone number'],
      index: true,
    },

    password: String,

    isEmailVerified: {
      type: Boolean,
      required: false,
    },

    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUserPersistence & mongoose.Document>('User', User);
