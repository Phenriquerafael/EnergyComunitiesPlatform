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
    
          const profileOrError = await ProfileMap.toDomain({
              ...profile,
              prosumer: profile.prosumer, // Ensure the prosumer property is included
              batteryCharge: profile.batteryCharge, // Add missing property
              batteryDischarge: profile.batteryDischarge, // Add missing property
          });
          if (profileOrError.isFailure) {
            return Result.fail<Profile>(profileOrError.error);
          }
          return Result.ok<Profile>(profileOrError.getValue());
        } catch (error) {
          console.error("Error finding profile by ID:", error);
          return Result.fail<Profile>(error.message);
        }
      }

      
    public async findByProsumerId(prosumerId: string): Promise<Result<Profile[]>> {
        try {
            const profiles = await prisma.profile.findMany({
                where: { prosumerId: prosumerId },
                include: {
                    prosumer: {
                        include: {
                            user: true, // Include the full User object
                            battery: true, // Include the full Battery object
                        },
                    },
                },
            });

            if (!profiles || profiles.length === 0) {
                return Result.fail<Profile[]>("Profile not found");
            }

            const profileResults = await Promise.all(
                profiles.map(profile => ProfileMap.toDomain(profile))
            );

            const failedProfiles = profileResults.filter(result => result.isFailure);
            if (failedProfiles.length > 0) {
                const errors = failedProfiles.map(result => result.error).join(", ");
                return Result.fail<Profile[]>(`Error converting some profiles to domain objects: ${errors}`);
            }

            const validProfiles = profileResults.map(result => result.getValue());

            return Result.ok<Profile[]>(validProfiles);
        } catch (error) {
            return Result.fail<Profile[]>(error instanceof Error ? error.message : "Unexpected error fetching profiles by prosumerId");
        }
    }
    
    public async findAll(): Promise<Result<Profile[]>> {
      try {
        // Fetch all profiles with related prosumer, user, and battery
        const profiles = await prisma.profile.findMany({
          include: {
            prosumer: {
              include: {
                user: true,
                battery: true,
              },
            },
          },
        });
  
        // Debug log to verify raw profiles
        /* console.log('Raw profiles:', profiles); */
  
        // Handle empty result
        if (profiles.length === 0) {
          return Result.ok<Profile[]>([]); // Return empty array for no profiles
          // Alternatively: return Result.fail<Profile[]>("Profiles not found");
        }
  
        // Map profiles to domain objects
        const profileResults = await Promise.all(
          profiles.map(profile => ProfileMap.toDomain(profile))
        );
  
        // Check for failed mappings
        const failedProfiles = profileResults.filter(result => result.isFailure);
        if (failedProfiles.length > 0) {
          const errors = failedProfiles.map(result => result.error).join(", ");
          return Result.fail<Profile[]>(`Error converting some profiles to domain objects: ${errors}`);
        }
  
        // Extract successful profiles
        const validProfiles = profileResults.map(result => result.getValue());
  
        return Result.ok<Profile[]>(validProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        return Result.fail<Profile[]>(
          error instanceof Error ? error.message : "Unexpected error fetching profiles"
        );
      }
    }

    public async delete(profile: Profile): Promise<Result<void>> {
        try {
            await prisma.profile.delete({
                where: { id: profile.id.toString() }
            });

            return Result.ok<void>();
        } catch (error) {
            console.error("Error deleting profile:", error);

            // Handle specific error like trying to delete a non-existent record
            if (
                error instanceof Error &&
                'code' in error &&
                (error as any).code === 'P2025'
            ) {
                return Result.fail<void>("Profile not found");
            }

            return Result.fail<void>(
                error instanceof Error ? error.message : "Unexpected error deleting profile"
            );
        }
    }


}