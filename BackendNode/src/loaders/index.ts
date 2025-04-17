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
  const batteryController = {
    name: config.controllers.battery.name,
    path: config.controllers.battery.path
  };
  const batteryRepo = {
    name: config.repos.battery.name,
    path: config.repos.battery.path
  };
  const batteryService = {
    name: config.services.battery.name,
    path: config.services.battery.path
  };
  const profileController = {
    name: config.controllers.profile.name,
    path: config.controllers.profile.path
  };
  const profileRepo = {
    name: config.repos.profile.name,
    path: config.repos.profile.path
  };
  const profileService = {
    name: config.services.profile.name,
    path: config.services.profile.path
  };
  const prosumerController = {
    name: config.controllers.prosumer.name,
    path: config.controllers.prosumer.path
  };
  const prosumerRepo = {
    name: config.repos.prosumer.name,
    path: config.repos.prosumer.path
  };
  const prosumerService = {
    name: config.services.prosumer.name,
    path: config.services.prosumer.path
  };

  await dependencyInjectorLoader({
    prismaClient: prisma,
    controllers: [
      roleController,
      userController,
      batteryController,
      profileController,
      prosumerController
    ],
    repos: [
      roleRepo,
      userRepo,
      batteryRepo,
      prosumerRepo,
      profileRepo,
    ],
    services: [
      roleService,
      userService,
      batteryService,
      profileService,
      prosumerService
    ]
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