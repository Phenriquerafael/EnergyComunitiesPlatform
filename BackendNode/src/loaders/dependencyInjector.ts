import { Container } from '../container';
import Logger from './logger'; // Import the logger

export default async ({ prismaClient, controllers, repos, services }) => {
  try {
    // Register the logger first
    Container.set('logger', Logger);
    console.log('Logger registered in container:', Container.get('logger'));

    // Register Prisma client
    Container.set('prisma', prismaClient);

    // Load and instantiate repos
    for (const repo of repos) {
      console.log(`Loading repo: ${repo.name} from ${repo.path}`);
      const loadedRepo = (await import(repo.path)).default;
      const repoInstance = Container.get(loadedRepo);
      Container.set(repo.name, repoInstance);
      console.log(`Instantiated repo: ${repo.name}`, repoInstance);
    }

    // Load and instantiate services
    for (const service of services) {
      console.log(`Loading service: ${service.name} from ${service.path}`);
      const loadedService = (await import(service.path)).default;
      const serviceInstance = Container.get(loadedService);
      Container.set(service.name, serviceInstance);
      console.log(`Instantiated service: ${service.name}`, serviceInstance);
    }

    // Load and instantiate controllers
    for (const controller of controllers) {
      console.log(`Loading controller: ${controller.name} from ${controller.path}`);
      const loadedController = (await import(controller.path)).default;
      console.log(`Loaded controller: ${controller.name}`, loadedController);
      const controllerInstance = Container.get(loadedController);
      Container.set(controller.name, controllerInstance);
      console.log(`Instantiated controller: ${controller.name}`, controllerInstance);
    }

    console.log('Container after setup:', Container.get('RoleController'));
  } catch (e) {
    Logger.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};