import { Container, Inject, Service } from 'typedi';
import config from '../../config';
import prisma from '../../prisma/prismaClient';
import IRoleService from '../services/IServices/IRoleService';
import IRoleDTO from '../dto/IRoleDTO';
import { Logger } from 'winston';



@Service() 
export default class BootstrapService {
    
  private get roleService(): IRoleService {
    return Container.get(config.services.role.name) as IRoleService;
  }
  private get logger() {
    return Container.get('logger') as Logger;
  }

  public async run() {
    try {
    this.logger.info('🚀 Running bootstrap process...');

    // Get RoleRepo instance via config name
/*     const roleService = Container.get<IRoleService>(config.services.role.name); */


    // Step 1: Clean DB 
    // Limpar todas as tabelas da base de dados
    await prisma.profile.deleteMany({});
    await prisma.prosumer.deleteMany({});
    await prisma.battery.deleteMany({});
    await prisma.communityManager.deleteMany({});
    await prisma.community.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    
    this.logger.info('✅ Cleared existing entities from database');

    // Step 2: Create new roles
    const rolesToCreate = ['ADMIN', 'GUEST', 'PROSUMER', 'COMMUNITY_MANAGER'];

    for (const roleName of rolesToCreate) {
      const role = this.roleService.createRole({name: roleName}as IRoleDTO);
      this.logger.info(`✅ Created role: ${role}`);
    }

    this.logger.info('🎉 Bootstrap completed successfully.');
  } catch (error) {
    this.logger.error('❌ Error running bootstrap: ', error);
  };
  }
}


export async function runBootstrap() {
  const logger = Container.get('logger') as any;
  try {
    logger.info('🚀 Running bootstrap process...');

    // Get RoleRepo instance via config name
    const roleService = Container.get<IRoleService>(config.services.role.name);


    // Step 1: Clean DB 
    // Limpar todas as tabelas da base de dados
    await prisma.profile.deleteMany({});
    await prisma.prosumer.deleteMany({});
    await prisma.battery.deleteMany({});
    await prisma.communityManager.deleteMany({});
    await prisma.community.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    
    logger.info('✅ Cleared existing entities from database');

    // Step 2: Create new roles
    const rolesToCreate = ['ADMIN', 'GUEST', 'PROSUMER', 'COMMUNITY_MANAGER'];

    for (const roleName of rolesToCreate) {
      const role = roleService.createRole({name: roleName}as IRoleDTO);
      logger.info(`✅ Created role: ${role}`);
    }

    logger.info('🎉 Bootstrap completed successfully.');
  } catch (error) {
    logger.error('❌ Error running bootstrap: ', error);
  }
}
