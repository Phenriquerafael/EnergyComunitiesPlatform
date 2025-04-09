import { Container } from 'typedi';
import Logger from './logger';

export default async ({ prismaClient, controllers, repos, services }) => {
  try {
    Container.set('prisma', prismaClient);

    // Load all controllers
    for (const controller of controllers) {
      const loadedController = (await import(controller.path)).default;
      Container.set(controller.name, loadedController);
    }

    // Load all services
    for (const service of services) {
      const loadedService = (await import(service.path)).default;
      Container.set(service.name, loadedService);
    }

    // Load all repositories
    for (const repo of repos) {
      const loadedRepo = (await import(repo.path)).default;
      Container.set(repo.name, loadedRepo);
    }

  } catch (e) {
    Logger.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
   