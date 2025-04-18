```plantuml
@startuml DDD

hide circle
hide fields

!theme crt-green
skinparam nodesep 150
hide empty members
left to right direction

package "<<agr Prosumer>>"{
    class Prosumer<<entity>><<root>>{}
    class ProsumerId<<vo>>{}
    class ProsumerDescription<<vo>>{}

    Prosumer --> "1" ProsumerId
    Prosumer --> "0..1" ProsumerDescription
    
}

package "<<agr Profile>>"{
    class Profile<<entity>><<root>>{

    }
    class ProfileId<<vo>>{}
    class ProfileTimeStamp<<vo>>{}
    class ProfileValue<<vo>>{}  
    note right{
        Balance of the Prosumer in kw/h, positive values lead to buy energy from the grid
    }

    Prosumer --> "1" Profile
    Profile --> "1" ProfileTimeStamp
    Profile --> "1" ProfileId
    Profile --> "1" ProfileValue
}

package "<<agr Grid>>"{
    class Grid <<entity>><<root>>{}
    class GridId<<vo>>{}
    class GridName<<vo>>{}

    Grid --> "1" GridId
    Grid --> "1" GridName
}

package "agr GridExchange>>"{
    class GridExchange <<entity>><<root>>{}
    class GridExchangeId<<vo>>{}
    class GridExchangeTimeStamp<<vo>>{}
    class GridExchangeBuy<<vo>>{}
    class GridExchangeSell<<vo>>{}
    class GridExchangePriceBuy<<vo>>{}
    class GridExchangePriceSell<<vo>>{}

    GridExchange ---> "1" Grid
    GridExchange ---> "1" Prosumer
    GridExchange ---> "1" GridExchangeId
    GridExchange ---> "1" GridExchangeTimeStamp
    GridExchange ---> "1" GridExchangeBuy
    GridExchange ---> "1" GridExchangeSell
    GridExchange --> "1" GridExchangePriceBuy
    GridExchange --> "1" GridExchangePriceSell
}

package "<<agr Community>>"{
    class Community<<entity>><<root>>{

    }
    class CommunityId<<vo>>{}
    class CommunityName<<vo>>{}
    class CommunityProsumers<<array>>{
    }
    Community --> "1" CommunityId
    Community -> "1" CommunityName
    Community --> "1" CommunityProsumers
}

package "<<agr CommunityExchange>>"{
    class CommunityExchange<<entity>><<root>>{}
    class CommunityExchangeId<<vo>>{}
    class CommunityExchangeTimeStamp<<vo>>{}
    class CommunityExchangePeerIn<<vo>>{}
    class CommunityExchangePeerOut<<vo>>{}

    CommunityExchange --> "1" Community
    CommunityExchange --> "1" Prosumer
    CommunityExchange --> "1" CommunityExchangeId
    CommunityExchange --> "1" CommunityExchangeTimeStamp
    CommunityExchange --> "1" CommunityExchangePeerIn
    CommunityExchange --> "1" CommunityExchangePeerOut
}

package "<<agr User>>"{
    class User<<entity>><<root>>{

    }
    class UserId<<vo>>{}
    class UserName<<vo>>{}
    class UserEmail<<vo>>{}
    class UserPassword<<vo>>{}
    class UserPhone<<vo>>{}

    User --> "1" UserId
    User --> "1" UserName
    User --> "1" UserEmail
    User --> "1" UserPassword
    User --> "1" UserPhone
    Community --> "1" User
    Prosumer --> "1" User
}

package "<<agr Administrator>>"{
    class Administrator<<entity>><<root>>{

    }
    Administrator --|> User
   
}

package "<<agr CommonUser>>"{
    class CommonUser<<entity>><<root>>{}
     CommonUser --|> User
}

package "<<agr Photovoltaic Panel>>"{
    class PhotovoltaicPanel<<entity>><<root>>{
    }
    class PhotovoltaicID<<vo>>{}
    class PhotovoltaicName<<vo>>{}

    PhotovoltaicPanel --> "1" PhotovoltaicID
    PhotovoltaicPanel --> "1" PhotovoltaicName
    Prosumer --> "1" PhotovoltaicPanel
}

package "<<agr Photovoltaic Energy>>"{
    class PhotovoltaicEnergy<<entity>><<root>>{}
    class PhotovoltaicEnergyId<<vo>>{}
    class PhotovoltaicEnergyTimeStamp<<vo>>{}
    class PhotovoltaicEnergyLoad<<vo>>{}
    class PhotovoltaicEnergyBattery<<vo>>{}

    PhotovoltaicEnergy --> "1" PhotovoltaicPanel
    PhotovoltaicEnergy --> "1" PhotovoltaicEnergyId
    PhotovoltaicEnergy --> "1" PhotovoltaicEnergyTimeStamp
    PhotovoltaicEnergy --> "1" PhotovoltaicEnergyLoad
    PhotovoltaicEnergy --> "1" PhotovoltaicEnergyBattery
}

package "<<agr Battery(ESS)>>"{
    class Battery<<entity>><<root>>{}
    class BatteryId<<vo>>{}
    class BatteryName<<vo>>{}

    Prosumer --> "1" Battery
    Battery --> "1" BatteryId
    Battery --> "1" BatteryName


}

package "<<agr BatteryEnergy>>"{
    class BatteryEnergy<<entity>><<root>>{}
    class BatteryEnergyId<<vo>>{}
    class BatteryEnergyState<<vo>>{}
    class BatteryEnergyCharge<<vo>>{}
     note right{
        this value will be equal to the value provided by PhotovoltaicEnergyBattery
    }
    class BatteryEnergyDischarge<<vo>>{}
    class BatteryEnergyTimeStamp<<vo>>{}
    class BatteryEnergyDischargeBinary<<vo>>{}
     note right{
        value in binary to acknowledge the battery is discharging
    }
    class BatteryEnergyChargeBinary<<vo>>{}
     note right{
        value in binary to acknowledge the battery is charging
    }

    BatteryEnergy ---> "1" Battery
    BatteryEnergy --> "1" BatteryEnergyId
    BatteryEnergy --> "1" BatteryEnergyState
    BatteryEnergy --> "1" BatteryEnergyCharge
    BatteryEnergy --> "1" BatteryEnergyDischarge
    BatteryEnergy --> "1" BatteryEnergyTimeStamp
    BatteryEnergy --> "1" BatteryEnergyDischargeBinary
    BatteryEnergy --> "1" BatteryEnergyChargeBinary

}
@enduml
