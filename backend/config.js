import dotenv from 'dotenv';

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
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo.ts"
    },
    user: {
      name: "UserRepo",
      path: "../repos/userRepo.ts"
    }
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
  },


};
