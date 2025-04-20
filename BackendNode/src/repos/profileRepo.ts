import { Service } from "typedi";
import IProfileRepo from "./IRepos/IProfileRepo";
import { Result } from "../core/logic/Result";
import { Profile } from "../domain/Prosumer/Profile/Profile";
import prisma from "../../prisma/prismaClient";
import { ProfileMap } from "../mappers/ProfileMap";
import { Prosumer } from "../domain/Prosumer/Prosumer";

@Service()
export default class ProfileRepo implements IProfileRepo {
  public async save(profile: Profile, prosumer:Prosumer): Promise<Result<Profile>> {
    try {
      const prosumerId = profile.prosumer.id.toString();

      // Mapear o Profile para o formato de persistência
      const rawProfile = ProfileMap.toPersistence(profile);

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
            prosumerId: prosumerId,
          },
          include: {
            prosumer: {
              include: {
                user: true, // Include the full User object
                battery: true, // Include the full Battery object
              },
            },
          },
        });
      }
      else {
        // Atualizar Profile existente
        savedProfile = await prisma.profile.update({
          where: { id: profile.id.toString() },
          data: {
            ...rawProfile,
            prosumerId: prosumerId,
          },
          include: {
            prosumer: {
              include: {
                user: true, // Include the full User object
                battery: true, // Include the full Battery object
              },
            },
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
              prosumer: {
                include: {
                  user: true, // Include the full User object
                  battery: true, // Include the full Battery object
                },
              },
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
            const profile = await prisma.profile.findUnique({
                where: { prosumerId: String(prosumerId) },
                include: {
                    prosumer: {
                        include: {
                            user: true, // Include the full User object
                            battery: true, // Include the full Battery object
                        },
                    },
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
            return Result.fail<Profile>(error.message);
            
        }
    }
    public async findAll(): Promise<Result<Profile[]>> {
      try {
        const profiles = await prisma.profile.findMany({
          include: {
            prosumer: {
              include: {
                user: true, // Include the full User object
                battery: true, // Include the full Battery object
              },
            },
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