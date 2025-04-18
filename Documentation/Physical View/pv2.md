```plantuml
@startuml
    top to bottom direction
    node localhost as "Localhost:?"{
        component Browser{
            component UI
        }
        
    }
    node server1 as "Server1:??"{
        component EM as "EnergyManagement"
        component Auth as "Authentication"
        component Optimization
    }

    node server2 as "Server2:?"{
        component HTTP as "HTTP Server"
        folder U_I as "UI"
    }

    localhost ---  server2 : http/s
    localhost ---server1 : http/s

@enduml