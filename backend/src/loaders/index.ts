import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';
import config from '../../config';
import { PrismaClient } from '@prisma/client';

export default async ({ expressApp }) => {
  const prisma = new PrismaClient();

  Logger.info('✌️ Prisma Client connected!');

  const roleController = {
    name: config.controllers.role.name,
    path: config.controllers.role.path
  };

  const roleRepo = {
    name: config.repos.role.name,
    path: config.repos.role.path
  };
  
  const roleService = {
    name: config.services.role.name,
    path: config.services.role.path
  };

  const userController = {
    name: config.controllers.user.name,
    path: config.controllers.user.path
  };

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path
  };

  const userService = {
    name: config.services.user.name,
    path: config.services.user.path
  };

  await dependencyInjectorLoader({
    prismaClient: prisma, // substitui mongoConnection
    controllers: [
      roleController,
      userController
    ],
    repos: [
      roleRepo,
      userRepo
    ],
    services: [
      roleService,
      userService
    ]
  });

  Logger.info('✌️ Controllers, Repositories, Services, etc. loaded with Prisma');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
