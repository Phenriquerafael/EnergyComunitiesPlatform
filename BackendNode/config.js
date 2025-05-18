import dotenv from 'dotenv';
import { Battery } from './src/domain/Prosumer/Battery.ts/Battery';
import path from 'path';
import { profile } from 'console';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000, 

  /**
   * That long string from mlab
   */
/*   databaseURL: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test", */
  databaseURL: process.env.DATABASE_URL,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my secret sauce ahb2hufhn24ufion",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    role: {
      name: "RoleController",
      path: "../controllers/roleController.ts"
    },
    user:{
      name: "UserController",
      path: "../controllers/userController.ts"
    },
    battery:{
      name: "BatteryController",
      path: "../controllers/batteryController.ts"
    },
    prosumer:{
      name: "ProsumerController",
      path: "../controllers/prosumerController.ts"
    },
    profile:{
      name: "ProfileController",
      path: "../controllers/profileController.ts"
    },
    communityManager:{
      name: "CommunityManagerController",
      path: "../controllers/communityManagerController.ts"
    },
    community:{
      name: "CommunityController",
      path: "../controllers/communityController.ts"
    },

    
    // Add other controllers here
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo.ts"
    },
    user: {
      name: "UserRepo",
      path: "../repos/userRepo.ts"
    },
    battery: {
      name: "BatteryRepo",
      path: "../repos/batteryRepo.ts"
    },
    profile: {
      name: "ProfileRepo",
      path: "../repos/profileRepo.ts"
    },
    prosumer: {
      name: "ProsumerRepo",
      path: "../repos/prosumerRepo.ts"
    },

    communityManager: {
      name: "CommunityManagerRepo",
      path: "../repos/communityManagerRepo.ts"
    },
    community: {
      name: "CommunityRepo",
      path: "../repos/communityRepo.ts"
    },


    // Add other repos here
  },

  services: {
    role: {
      name: "RoleService",
      path: "../services/roleService.ts"
    },
    user: {
      name: "UserService",
      path: "../services/userService.ts"
    },

    battery: {
      name: "BatteryService",
      path: "../services/batteryService.ts"
    },
    prosumer: {
      name: "ProsumerService",
      path: "../services/prosumerService.ts"
    },
    profile: {
      name: "ProfileService",
      path: "../services/profileService.ts"
    },
    communityManager: {
      name: "CommunityManagerService",
      path: "../services/communityManagerService.ts"
    },

    community: {
      name: "CommunityService",
      path: "../services/communityService.ts"
    },
    // Add other services here
  },


};
