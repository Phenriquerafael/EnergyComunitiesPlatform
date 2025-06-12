```plantuml
@startuml
skinparam monochrome true
skinparam PackageStyle rectangle
skinparam Shadowing none
skinparam linetype ortho

title C4 Componente: Backend Node.js (Server-Centered)

component Server <<Container (C4)>> {
  port P1 as " "
  port P2 as " "
  port P3 as " "
  port P4 as " "

  [Services] <<Container (C4)>>
  [Controllers] <<Container (C4)>>
  [Repositories] <<Container (C4)>>
  [Domain] <<Container (C4)>>
  [Authorizer] <<Container (C4)>>
  [Logs] <<Container (C4)>>
  [Mapper] <<Container (C4)>>
  [DTO] <<Container (C4)>>

  [Controllers] --> [Services]
  [Repositories] --> [Services]
  [Domain] --> [Services]
  [Authorizer] --> [Services]
  [Logs] --> [Services]
  [Mapper] --> [Services]
  [DTO] --> [Services]

  interface Controller_API as "Controller API"
  interface DMAPI as "Data Model API"
  interface PAPI as "Persistence API"
  interface REPOAPI as "Repository API"
  interface ASAPI as "App Service API"
  interface DTOAPI as "DTO API"
  interface ModelAPI as "Model API"

  [Controllers] -- Controller_API
  [Repositories] -- REPOAPI
  [Services] -- ASAPI
  [Domain] -- ModelAPI
  [Mapper] -- DTOAPI
  [DTO] -- DTOAPI

  [Routing] <<Container (C4)>> --> Controller_API
  [Persistence] <<Container (C4)>> --> PAPI
  [Data_Model] <<Container (C4)>> --> DMAPI

  [Controllers] --> ASAPI
  [Repositories] --> ModelAPI
  [Repositories] --> DMAPI
  [Repositories] --> PAPI
  [Services] --> REPOAPI
  [Mapper] --> ASAPI
  [DTOAPI] --> ASAPI
  [DTOAPI] --> DTO
  [Authorizer] --> AuthAPI
  [Logs] --> Routing
}

interface EMAPI as "Energy Management API"
interface SGBDAPI as "SGBD API"
interface AuthAPI as "Authentication API"
interface OptimizationAPI as "Optimization API"

P1 -up- EMAPI
P2 -up- SGBDAPI
P3 -up- AuthAPI
P4 -up- OptimizationAPI

note right of Server
  Central server orchestrating energy management
  operations (US 001, 007, 010, 013-016, 018, 020, 024, 026, 028).
end note
note right of [Controllers]
  Handles HTTP requests and responses via Controller API.
end note
note right of [Repositories]
  Manages data access and persistence operations.
end note
note right of [Services]
  Orchestrates business logic and use cases.
end note
note right of [Domain]
  Contains core domain entities (Prosumer, Community, Battery).
end note
note right of [Authorizer]
  Integrates authentication and authorization.
end note
note right of [Logs]
  Manages logging and monitoring.
end note
note right of [Mapper]
  Maps domain objects to DTOs for API responses.
end note
note right of [DTO]
  Data transfer objects for external communication.
end note

@enduml
```