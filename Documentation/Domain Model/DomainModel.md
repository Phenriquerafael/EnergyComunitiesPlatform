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
        probably the value in kw/h
    }

    Prosumer -> "1" Profile
    Profile -> "1" ProfileTimeStamp
    Profile -> ProfileId
    Profile -> ProfileValue
}

package "<<agr Community>>"{
    class Community<<entity>><<root>>{

    }
    class CommunityId<<vo>>{}
    class CommunityName<<vo>>{}
    
    Community --> "1..*" Prosumer
    Community -> "1" CommunityId
    Community -> CommunityName
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

package "<<agr Common>>"
@enduml
