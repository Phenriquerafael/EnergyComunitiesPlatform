```plantuml
@startuml
component SATCOMM <<Container (C4)>>{
    port p1 as " "
    component View_UI as "View (UI)" <<Container (C4)>>{
        port p2 as " "
        port p5 as " "
        port p6 as " "
        port p10 as " "
    }
    component Authentication <<Container (C4)>>{
        port p3 as " "
        port p7 as " "
    }
    component EM as "Energy Management" <<Container (C4)>>{
        port p4 as " "
        port p8 as " "
        port p11 as " "
    }
    component OTAPI as "Optimization" <<Container (C4)>>{
        port p9 as " "
        port p12 as " "
    }
    interface OtimizationAPI as "Optimization API"
    interface AuthAPI as "Authentication API"
    p5 --- AuthAPI
    AuthAPI --- p7
    interface EMAPI as "Energy Management API"
    p6 --- EMAPI
    EMAPI --- p8
    p3 -- EMAPI
    EMAPI -- p4
    p10 -- OtimizationAPI
    OtimizationAPI --- p9
    p11 -- OtimizationAPI
    OtimizationAPI -- p12

}

p1 -- p2
interface UI_User as "UI User"
interface UI_Administrator as "UI Administrator"
UI_User -- p1
UI_Administrator -- p1


@enduml