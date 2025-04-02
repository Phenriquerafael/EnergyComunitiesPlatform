```plantuml
@startuml
    folder SATCOMM as "Energy Management"{
        folder Infrastructure{
            folder Routes
            folder Persistence
        }
        folder Interface_Adapters as "Interface Adapters"{
            folder Repositories
            folder Controllers
        }
        Routes ..> Controllers
        Persistence <.. Repositories

        folder UCS as "Use Case Services"{
            folder AS as "App Services"
        }

        Controllers ..> AS
        Repositories ..> AS

        folder Domain{

            folder Aggregates
            folder Services
            folder VO as "Value Objects"
        }

        AS ..> Aggregates
        AS ..> Services
        AS ..> VO

    }

    
@enduml