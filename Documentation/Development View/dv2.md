```plantuml
@startuml
    folder SATCOMM as "System SATCOMM"{
        folder UI as "User Interface"
        folder Auth as "Authentication"
        folder EM as "Energy Management"
        folder OT as "Optimization"
    }
    UI ..> Auth
    UI ..> EM
    UI ..> OT
    Auth ..> EM
    EM ..> OT
    
@enduml