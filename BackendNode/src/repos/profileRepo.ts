import { Service } from "typedi";
import IProfileRepo from "./IRepos/IProfileRepo";
import { Result } from "../core/logic/Result";
import { Profile } from "../domain/Prosumer/Profile/Profile";
import prisma from "../../prisma/prismaClient";
import { ProfileMap } from "../mappers/ProfileMap";
import { Prosumer } from "../domain/Prosumer/Prosumer";

@Service()
export default class ProfileRepo implements IProfileRepo {
  public async save(profile: Profile, prosumer: Prosumer): Promise<Result<Profile>> {
    try {
      // Validar se o prosumer existe no banco
      const prosumerId = prosumer.id.toString();
      const existingProsumer = await prisma.prosumer.findUnique({
        where: { id: prosumerId },
      });

      if (!existingProsumer) {
        return Result.fail<Profile>("Prosumer not found in database");
      }

      // Mapear o Profile para o formato de persistência
      const rawProfile = ProfileMap.toPersistence(profile);

      // Garantir que o prosumerId corresponde ao Prosumer fornecido
      if (rawProfile.prosumerId !== prosumerId) {
        return Result.fail<Profile>("prosumerId in Profile does not match provided Prosumer");
      }

      // Verificar se o Profile já existe
      const existingProfile = await prisma.profile.findUnique({
        where: { id: profile.id.toString() },
      });

      let savedProfile;
      if (!existingProfile) {
        // Criar novo Profile
        savedProfile = await prisma.profile.create({
          data: {
            ...rawProfile,
            prosumerId: prosumerId, // Garantir que o prosumerId é usado
          },
          include: {
            prosumer: true, // Incluir o Prosumer para o mapeamento
          },
        });
      } else {
        // Atualizar Profile existente
        savedProfile = await prisma.profile.update({
          where: { id: profile.id.toString() },
          data: {
            ...rawProfile,
            prosumerId: prosumerId, // Garantir que o prosumerId é atualizado, se necessário
          },
          include: {
            prosumer: true, // Incluir o Prosumer para o mapeamento
          },
        });
      }

      // Mapear o Profile salvo de volta para o domínio
      const profileOrError = await ProfileMap.toDomain(savedProfile);
      if (profileOrError.isFailure) {
        return Result.fail<Profile>(profileOrError.error);
      }
      return Result.ok<Profile>(profileOrError.getValue());
    } catch (error) {
      console.error("Error saving profile:", error);
      return Result.fail<Profile>(error.message);
    }
  }
    public async findById(id: string): Promise<Result<Profile>> {
        try {
          const profile = await prisma.profile.findUnique({
            where: { id: String(id) },
            
            include: {
              prosumer: true, // Carrega o Prosumer associado
            },
          });
    
          if (!profile) {
            return Result.fail<Profile>("Profile not found");
          }
    
          const profileOrError = await ProfileMap.toDomain(profile);
          if (profileOrError.isFailure) {
            return Result.fail<Profile>(profileOrError.error);
          }
          return Result.ok<Profile>(profileOrError.getValue());
        } catch (error) {
          console.error("Error finding profile by ID:", error);
          return Result.fail<Profile>(error.message);
        }
      }

      
    public async findByProsumerId(prosumerId: string): Promise<Result<Profile>> {
        try {
            
        } catch (error) {
            return Result.fail<Profile>(error.message);
            
        }
    }
    public async findAll(): Promise<Result<Profile[]>> {
      try {
        const profiles = await prisma.profile.findMany({
          include: {
            prosumer: true, // Carrega o Prosumer associado
          },
        });
    
        if (!profiles) {
          return Result.fail<Profile[]>("No profiles found");
        }
    
        const profileOrErrors = await profiles.map((profile) => ProfileMap.toDomain(profile));
        const failedProfiles = profileOrErrors.filter((profile) => profile);
        if (failedProfiles.length > 0) {
          return Result.fail<Profile[]>(
            "Error converting some profiles to domain objects"
          );
        }
    
        const validProfiles = await Promise.all(profileOrErrors.map(async (profile) => (await profile).getValue()));
        return Result.ok<Profile[]>(validProfiles);
      } catch (error) {
        return Result.fail<Profile[]>(error.message);
        
      }
    }

}