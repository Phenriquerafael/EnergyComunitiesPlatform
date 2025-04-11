import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';
import config from '../../config';
import { PrismaClient } from '@prisma/client';
import { Container } from '../container'; // Use centralized Container

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
    prismaClient: prisma,
    controllers: [roleController, userController],
    repos: [roleRepo, userRepo],
    services: [roleService, userService]
  });

  Logger.info('✌️ Controllers, Repositories, Services, etc. loaded with Prisma');

  // Verify RoleController is in the container before loading routes
  const roleCtrl = Container.get('RoleController');
  if (!roleCtrl) {
    throw new Error('RoleController not found in container after dependency injection');
  }
  Logger.info('RoleController verified in container:', roleCtrl);

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};