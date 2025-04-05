# EnergyComunitiesPlatform 

## Introduction

**[Glossary](/documentation/Glossary.md)**


To ensure we align our development efforts with your vision, we’d like to clarify a few key aspects of the project scope, architecture, and data integration. Your input on the following questions will help us deliver a solution that meets your needs effectively.

## Q&A:
Q: How many dataset variations can exist? (Is every dataset a diferent variation or some have the same atributes)
A: Each dataset if diferent but certain atributes represent the same context value so they can be used in the same alghoritm:

- PPV_capacity: Max fotovoltaic energy geration capacity per hour
 
- PL: Load profile of a user along the day 

- buysell: The price of electricity bought from the grid

- buysell: The price of electricity sold to the grid

- ESS-Param: Energy Storage System parameters

Q: Regarding the unused input data in the sampleData file (e.g., Pev, Physical_Distance, EV-Param, etc.), should these be considered for inclusion in the project’s development scope, or should we prioritize building a product based solely on the data and functionality currently utilized by the optimization algorithm?

Q: Will the backend domain model be designed to represent only the results of the optimization algorithm, or should it also include the input data? In other words, are we aiming for a system where the optimization algorithm is accessed solely through APIs, with standardized formats for both input and output data?

Q: In addition to Excel/CSV files, what other methods will the optimization algorithm use to receive data? For example, should it be designed to directly access an organization’s or energy community’s database?

Q: The current algorithm supports multiple prosumers (nPlayers). Should the system be designed with scalability in mind to handle a growing number of prosumers or energy communities, and if so, are there specific performance or capacity targets we should aim for (e.g., maximum number of users, processing time)?

Q: How do you envision end-users interacting with the system? For example, should we include a user interface to input data, view optimization results (e.g., `P_buy`, `P_sell`, `SOC`), or adjust parameters, or will the system primarily operate as a backend service with outputs delivered via files or APIs?

## Notes
- Create plots to compare a prosumer inside and outside an energy community
- Study how tax is applied in Spain (sampleData)
- Study how to deploy the optimization algorithm 
- Study which calls the backend has to make to use the O.A

## System Interation:

1º Dataset 

2º Read Datasets 

3º Optimize Data

4º Calculate prices and results

5º Return Arrays with results

## Code Modifications

**Detailed results path changed from absolute to relative**

The use of an absolute path turns the use of the file specific to each computer, so I added the sample data in the project repository so the code can use the path of the file within the repo (relative path). 

satcomm-scen4.py: Line 245

From
~~~
detailed_results_path = r"D:\My Projects\Satcomm project\detailed_results.xlsx"
~~~

To 
~~~
detailed_results_path = r"sampledata.xlsx"
~~~~

sampleData.xlsx: prosumers section




## Interface:
Download the installer at 'https://www.python.org/downloads/' and follow the ins
2º Create an account and Get Academic license for 1 year at https://portal.gurobi.com/iam/licenses/list/

3º Download the gurobi.lic file and follow these instructions:
    #Open Windows PowerShell as an admin (mouse right click)

    # Create folder (in case it doesn't exist)
    mkdir C:\gurobi  

    # Move the license to the correct folder (copy the path of the gurobi.lic downloaded file)
    Move-Item "C:\Users\phenr\Downloads\gurobi.lic" "C:\gurobi\gurobi.lic"

    #Update the ambient variable:
    setx GRB_LICENSE_FILE "C:\gurobi\gurobi.lic"

    #Close the terminal, reopen and run:
    grbprobe

    #It should show the license data

## Install GLPK

**1º** - Download the file 'glpk-4.35.tar.gz' at 'https://ftp.gnu.org/gnu/glpk/'

**2º** - Extract the Zip folder by: right clicking on the folder and then>> 7-Zip >> Extract Here as shown. Move the glpk-4.65 folder from your downloads folder to your C: drive.

**3º** - Assuming you’re using 64-bit Windows, click on the C:\glpk-4.65 folder in Windows explorer, click on the w64 folder, and select and copy the file path, which should be C:\glpk-4.65\w64.

**4º** - Search and open your Control Panel, select System and Security>>System>>Advanced system settings>>Environment Variables. Then click on ‘path’ in the top window, click the ‘Edit’ button, then ‘New’.

**5º** - Paste the file path you copied above and save.

## Install Libraries 
Finally run:

    py satcomm-scen4.py

DONE.

---

## Optimization Algorithm Description

### Variables Mapping

The table below maps the original variables from the code to more comprehensible names, along with their meanings in the context of the energy optimization model:

| **Original Variable**           | **New Name**             | **Meaning**                                          |
|---------------------------------|--------------------------|-----------------------------------------------------|
| `P_Load`                       | `UserDemand`             | Energy required by the user in the interval         |
| `PPV_capacity`                 | `MaxSolarProduction`     | Maximum energy generated by the solar panel         |
| `P_PV_load`                    | `EnergyForDemand`        | Solar energy used directly for demand               |
| `P_PV_ESS`                     | `EnergyForBattery`       | Solar energy used to charge the battery             |
| `P_ESS_ch`                     | `BatteryCharge`          | Energy charged into the battery                     |
| `P_ESS_dch`                    | `BatteryDischarge`       | Energy discharged from the battery                  |
| `I_ESS_ch`                     | `BatteryCharging`        | Indicator that the battery is charging              |
| `I_ESS_dch`                    | `BatteryDischarging`     | Indicator that the battery is discharging           |
| `SOC`                          | `ChargeLevel`            | Current level of energy stored in the battery       |
| `P_buy`                        | `EnergyPurchased`        | Energy purchased from the grid                      |
| `P_sell`                       | `EnergySold`             | Energy sold to the grid                             |
| `P_peer_in`                    | `EnergyReceived`         | Energy received from another user in the community  |
| `P_peer_out`                   | `EnergySent`             | Energy sent to another user in the community        |
| `Cbuy`                         | `PurchasePrice`          | Price per kW/h to buy from the grid                 |
| `Csell`                        | `SellingPrice`           | Price per kW/h to sell to the grid                  |
| `ESSparams[1, PL]`             | `ChargeEfficiency`       | Efficiency when charging the battery                |
| `1/ESSparams[1, PL]`           | `DischargeEfficiency`    | Efficiency when discharging the battery             |
| `ESSparams[2, PL] * ESSparams[3, PL]` | `MaxCapacity`      | Maximum charge/discharge capacity of the battery    |
| `ESSparams[4, PL]`             | `MinLevel`               | Minimum charge level of the battery                 |
| `SOC_end_of_day`               | `FinalChargeLevel`       | Charge level at the end of the day                  |

---

### Fluxogram
**Level 1**
```plantuml
@startuml 

' Diagrama de Atividades
start

:Load Data (PLoad, PPV, Cbuy, Csell);
:Define parameters (η, SOCmax, SOCmin, Pmax, Pmin);
:Define time intervals (T, Δt);
:Initialize variables (SOC, Pcharge, Pdischarge, Ccost, Cprofit);

if (First period of the day?) then (Yes)
    :initial SOC = SOC of the previous day;
else (No)
    :Update SOC on charge and discharge;
endif

:Define objective (Minimize cost);
:Define restraints (SOC, Pcharge, Pdischarge);
:Solve solution (GUROBI);
:Store Results;
stop

@enduml
 
```

**Level 2**

```plantuml
@startuml 
start
if(Prosumer is out of home?) then (yes)
  :produces energy;
  if (Battery needs energy from \n the photovoltaic  panel?) then (yes)
  :Process \n ended;
else (no)
  :is going to send energy \n to the community;
  if(Community needs energy from \n the photovoltaic panel?) then (yes)
  :Process \n ended;
  else (no)
  : sells the energy \n to the grid, ends process;
  endif
endif
  else (no)
  : consumes energy ;
  if (Photovoltaic panel is giving enough energy?) then (yes)
  :Process \n ended;
  else (no)
  :is going to request \n the battery for energy;
  if(Battery has enough energy to give?) then (yes)
  :Process \n ended;
  else (no)
  : is going to request \n energy to the community;
    if(Community has enough energy to give?) then (yes)
    :Process \n ended;
    else (no)
    : is going to buy energy from \n the grid, ends process;
    endif
  endif
  endif
endif


stop

@enduml
```

**Level 2B**
```plantuml
@startuml 
    package "Photovoltaic Panel"{
        object p_pv_load as "Photovoltaic Load"{
            * P_Pv_Load()
        }
    }
    
    package "Prosumer"{
        object P as "Prosumer Load"{
            * P_Load()
        }
    }
   

    package "Battery" {
        object b_ch as "Charge"{
            * Ess_Charge()
        }

        object b_dch as "Discharge"{
            * Ess_Discharge()
        }
    }

    package "Grid" {
        object g_buy as "Buy energy"{
            * P_Buy()
        }
        object g_sell as "Sell energy"{
            * P_Sell()
        }
    }

    package "Community" {
        object peer_out as "Send energy"{
            * Peer_Out()
        }
        object peer_in as "Receive energy"{
            * Peer_In()
        }
    }
    diamond dia1
    diamond dia2
    diamond dia3
    p_pv_load --> P: "Prosumer is consuming energy"
    p_pv_load --> b_ch: "Prosumer is not consuming energy"
    b_dch --> dia1
    peer_out --> dia1
    g_buy --> dia1
    dia1 --> P: "Prosumer needs more energy"
    b_dch --> dia2
    p_pv_load --> dia2
    dia2 --> peer_in: "Community needs energy"
    p_pv_load --> dia3
    b_dch --> dia3
    dia3 --> g_sell: "Best case, nobody needs energy"
@enduml
```

**Level 3**

```plantuml
@startuml 
skinparam monochrome true
skinparam backgroundColor white

' Start of the process for one day '
start
:Load current day data;
note right: Maximum solar panel production,\nUser usage,\nPurchase price,\nSelling price,\nBattery parameters

' Loop for each time interval (15 minutes) '
:For each 15-minute interval in the day (total of 96);

' Prosumer Inputs '
:Get UserUsage and MaxSolarProduction;
note right: UserUsage = energy required\nMaxSolarProduction = energy generated by the solar panel

' Decision on solar energy usage '
:Split solar energy into EnergyForUsage and EnergyForBattery;
note right: EnergyForUsage + EnergyForBattery = MaxSolarProduction

' Battery Management '
if (EnergyForBattery > 0?) then (Yes)
  :Calculate BatteryCharge;
  note right: BatteryCharge = EnergyForBattery\nLimited by the battery's maximum capacity
  :ChargingBattery = True;
  :DischargingBattery = False;
else (No)
  if (UserUsage > EnergyForUsage?) then (Yes)
    :Calculate BatteryDischarge;
    note right: Limited by the battery's maximum capacity
    :DischargingBattery = True;
    :ChargingBattery = False;
  else (No)
    :BatteryCharge = 0;
    :BatteryDischarge = 0;
    :ChargingBattery = False;
    :DischargingBattery = False;
  endif
endif

' Update battery charge level '
:Calculate ChargeLevel;
note right: ChargeLevel = Previous level + 15min * (ChargeEfficiency * BatteryCharge - BatteryDischarge / DischargeEfficiency)\nMinimum defined by battery parameters

' User Energy Balance '
:Calculate required or excess energy;
note right: UserUsage = EnergyForUsage + BatteryDischarge + EnergyPurchased - EnergySold + EnergyReceived - EnergySent

' Decision on community or grid exchange '
if (UserUsage > EnergyForUsage + BatteryDischarge?) then (Yes)
  if (Community has spare energy?) then (Yes)
    :Receive EnergyReceived from community;
    note right: EnergyReceived = energy from another user
  else (No)
    :Buy EnergyPurchased from the grid;
    note right: EnergyPurchased limited to 12.5 kW\nCost = PurchasePrice * EnergyPurchased
  endif
else (No)
  if (MaxSolarProduction > UserUsage + EnergyForBattery?) then (Yes)
    if (Community needs energy?) then (Yes)
      :Send EnergySent to community;
      note right: EnergySent limited by solar excess
    else (No)
      :Sell EnergySold to the grid;
      note right: EnergySold limited to 10.5 kW\nRevenue = SellingPrice * EnergySold
    endif
  else (No)
    :EnergyPurchased = 0;
    :EnergySold = 0;
    :EnergyReceived = 0;
    :EnergySent = 0;
  endif
endif

' Store results for the interval '
:Store EnergyPurchased, EnergySold, ChargeLevel, BatteryCharge, BatteryDischarge, EnergyForUsage, EnergyForBattery, EnergyReceived, EnergySent;

' End of time loop '
:Next interval;
detach

' End of day '
:Save final ChargeLevel for the day;
note right: FinalChargeLevel = ChargeLevel at the last interval

' Calculate daily cost/revenue '
:Calculate total daily cost;
note right: Total Cost = Sum(PurchasePrice * EnergyPurchased - SellingPrice * EnergySold) for all intervals

stop

@enduml
```
**Level 3B**

```plantuml
@startuml 
skinparam monochrome true
skinparam backgroundColor white

' Start of the process for one day '
start
:Load current day data;
note right: PPV_capacity, P_Load, Cbuy, Csell, ESSparams

' Loop for each time interval (T = 1 to Thorizon) '
:For each T in Thorizon (96 intervals of 15 minutes);

' Prosumer Inputs '
:Get P_Load[T, PL] and PPV_capacity[T, PL];
note right: P_Load = Prosumer usage\nPPV_capacity = Maximum PV production

' Decision on PV energy usage '
:Calculate P_PV_load[T, PL] and P_PV_ESS[T, PL];
note right: P_PV_load + P_PV_ESS = PPV_capacity[T, PL]

' Battery (ESS) Management '
if (P_PV_ESS[T, PL] > 0?) then (Yes)
  :Calculate P_ESS_ch[T, PL];
  note right: P_ESS_ch = P_PV_ESS\nLimited by ESSparams[2, PL] * ESSparams[3, PL]
  :I_ESS_ch[T, PL] = 1;
  :I_ESS_dch[T, PL] = 0;
else (No)
  if (P_Load[T, PL] > P_PV_load[T, PL]?) then (Yes)
    :Calculate P_ESS_dch[T, PL];
    note right: Limited by ESSparams[2, PL] * ESSparams[3, PL]
    :I_ESS_dch[T, PL] = 1;
    :I_ESS_ch[T, PL] = 0;
  else (No)
    :P_ESS_ch[T, PL] = 0;
    :P_ESS_dch[T, PL] = 0;
    :I_ESS_ch[T, PL] = 0;
    :I_ESS_dch[T, PL] = 0;
  endif
endif

' Update battery state of charge '
:Calculate SOC[T, PL];
note right: SOC[T, PL] = SOC[T-1, PL] + ΔT * (ESSparams[1, PL] * P_ESS_ch[T, PL] - P_ESS_dch[T, PL] / ESSparams[1, PL])\nMinimum SOC = ESSparams[4, PL]

' Prosumer Energy Balance '
:Calculate net balance;
note right: P_Load[T, PL] = P_PV_load[T, PL] + P_ESS_dch[T, PL] + P_buy[T, PL] - P_sell[T, PL] + P_peer_in[T, PL] - P_peer_out[T, PL]

' Decision on community exchange '
if (P_Load[T, PL] > P_PV_load[T, PL] + P_ESS_dch[T, PL]?) then (Yes)
  if (Community has available energy?) then (Yes)
    :Receive P_peer_in[T, PL];
    note right: P_peer_in = Energy from another prosumer
  else (No)
    :Buy P_buy[T, PL] from Grid;
    note right: P_buy limited to 12.5 kW\nCost = Cbuy[T] * P_buy[T, PL]
  endif
else (No)
  if (PPV_capacity[T, PL] > P_Load[T, PL] + P_PV_ESS[T, PL]?) then (Yes)
    if (Community needs energy?) then (Yes)
      :Send P_peer_out[T, PL];
      note right: P_peer_out limited by excess PPV_capacity
    else (No)
      :Sell P_sell[T, PL] to Grid;
      note right: P_sell limited to 10.5 kW\nRevenue = Csell[T] * P_sell[T, PL]
    endif
  else (No)
    :P_buy[T, PL] = 0;
    :P_sell[T, PL] = 0;
    :P_peer_in[T, PL] = 0;
    :P_peer_out[T, PL] = 0;
  endif
endif

' Store results for interval T '
:Store P_buy[T, PL], P_sell[T, PL], SOC[T, PL], P_ESS_ch[T, PL], P_ESS_dch[T, PL], P_PV_load[T, PL], P_PV_ESS[T, PL], P_peer_in[T, PL], P_peer_out[T, PL];

' End of time loop '
:Next T;
detach

' End of day '
:Save final SOC for the day;
note right: SOC_end_of_day[PL, day] = SOC[Thorizon, PL]

' Calculate daily objective '
:Calculate total daily cost;
note right: Sum(Cbuy[T] * P_buy[T, PL] - Csell[T] * P_sell[T, PL]) for all T and PL

stop

@enduml
```


## Explanation of the Revised Flowcharts

The revised flowcharts describe the energy management process for a prosumer. Below is a detailed explanation of each step:

### Data Loading
Initial data, such as solar production (`MaxSolarProduction`), user demand (`UserDemand`), purchase and selling prices (`PurchasePrice` and `SellingPrice`), and battery parameters (e.g., `ChargeEfficiency`, `MaxCapacity`), are loaded for the day.

### Loop by Intervals
The process repeats for each 15-minute interval, totaling 96 intervals per day.

### Solar Energy Division
The energy generated by the solar panel (`MaxSolarProduction`) is split between:
- Directly meeting the user’s demand (`EnergyForDemand`).
- Charging the battery (`EnergyForBattery`).

### Battery Management
- **If there is energy for the battery** (`EnergyForBattery > 0`): The battery is charged (`BatteryCharge`), and the `BatteryCharging` indicator is activated.
- **If demand exceeds available energy** (`UserDemand > EnergyForDemand`): The battery is discharged (`BatteryDischarge`), and the `BatteryDischarging` indicator is activated.
- The `ChargeLevel` is updated based on the charging (`BatteryCharge`) and discharging (`BatteryDischarge`) actions, considering efficiencies (`ChargeEfficiency` and `DischargeEfficiency`).

### Energy Balance
Calculates whether there is a need for extra energy or a surplus, using the equation:
- `UserDemand = EnergyForDemand + BatteryDischarge + EnergyPurchased - EnergySold + EnergyReceived - EnergySent`.

### Transactions with Community and Grid
- **Energy Deficit**:
  - Attempts to receive energy from the community (`EnergyReceived`) if available.
  - Otherwise, purchases from the grid (`EnergyPurchased`), with cost calculated as `PurchasePrice * EnergyPurchased`.
- **Energy Surplus**:
  - Sends energy to the community (`EnergySent`) if needed.
  - Otherwise, sells to the grid (`EnergySold`), generating revenue as `SellingPrice * EnergySold`.

### Results
Stores all calculated variables (`EnergyPurchased`, `EnergySold`, `ChargeLevel`, etc.) for analysis. At the end of the day, calculates the total cost/revenue based on prices and transactions.

---



## Preconized Solution

### Use Case Diagram

**Level 1 - Version 1 (Functional Code)**

```plantuml
@startuml  

' Diagrama de Caso de Uso
left to right direction
actor Prosumer
actor Admin
actor CommunityManager

rectangle "Optimization System" {
    usecase "Load input data" as UC1
    usecase "Manage user account" as UC2
    usecase "Manage Users" as UC3
    usecase "Manage input data" as UC4
    usecase "Analyse output data" as UC5
    usecase "Manage Users Permissions" as UC6
    
}

Prosumer -- UC1
Prosumer -- UC2
Prosumer -- UC3
Prosumer -- UC4
Prosumer -- UC5

Admin -- UC3
Admin -- UC6

CommunityManager -- UC2
CommunityManager -- UC5

@enduml

```
**Level 1 - Version 2**

```plantuml
@startuml  

' Diagrama de Caso de Uso
left to right direction
actor Prosumer
actor Grid
actor Solver

rectangle "Optimization System" {
    usecase "Load input data" as UC1
    usecase "Optimize use of energy" as UC2
    usecase "Buy/Sell Energy" as UC3
    usecase "Trade energy between prosumers" as UC4
    usecase "see output data" as UC5
}

Prosumer -- UC1
Prosumer -- UC2
Prosumer -- UC3
Prosumer -- UC4
Prosumer -- UC5
Grid -- UC3
Solver -- UC2

@enduml

```

**Level 2 - Version 1**

```plantuml
@startuml 
left to right direction

actor Admin
actor User
actor Prosumer
actor "Community Manager" as CM



 
rectangle "Energy Community Platform" {
  usecase "Create users" as UC1
  usecase "Update users" as UC2
  usecase "Delete users" as UC3

  usecase "Register account" as UC4
  usecase "Update account" as UC5
  usecase "Delete account" as UC6

  usecase "Upload data" as UC7
  usecase "Update data" as UC8
  usecase "Analyse data" as UC9

  usecase "Create energy community" as UC10
  usecase "Add Data" as UC11
  usecase "Delete Data" as UC12
    
    Admin --> UC1
    Admin --> UC2
    Admin --> UC3

    User --> UC4
    User --> UC5
    User --> UC6

    Prosumer --> UC7
    Prosumer --> UC8
    Prosumer --> UC9

    CM --> UC10
    CM --> UC11
    CM --> UC9
    CM --> UC12
}
@enduml

```

**Level 2 - Version 2**

```plantuml
@startuml
left to right direction

actor Admin
actor User
actor Prosumer
actor "Community Manager" as CM

rectangle "Energy Community Platform" {

    ' Admin Use Cases
    Admin --> (Create users)
    Admin --> (Update users)
    Admin --> (Delete users)
    Admin --> (View system logs)
    Admin --> (Manage roles and permissions)
    Admin --> (Monitor platform usage)

    ' User Use Cases
    User --> (Register account)
    User --> (Update account)
    User --> (Delete account)
    User --> (View community data)
    User --> (Join energy community)

    ' Prosumer Use Cases
    Prosumer --> (Upload data)
    Prosumer --> (Update data)
    Prosumer --> (Analyse data)
    Prosumer --> (View own consumption/production history)
    Prosumer --> (Set energy usage preferences)

    ' Community Manager Use Cases
    CM --> (Create energy community)
    CM --> (Add data)
    CM --> (Analyse data)
    CM --> (Delete data)
    CM --> (Manage members)
    CM --> (Generate reports)
    CM --> (Configure energy sharing rules)
}
@enduml

```

**Level 3 - Version 1**

```plantuml
@startuml
left to right direction

' Actors
actor Admin
actor User
actor Prosumer
actor "Community Manager" as CM
/' actor Grid
actor Solver '/

' Actor Relationships
Prosumer --|> User : <<extends>>
CM --|> User : <<extends>>

rectangle "Energy Community Platform" {

  ' Admin Use Cases
  package "Admin Management" {
    usecase "UC1: Create User" as UC1
    usecase "UC2: Update User" as UC2
    usecase "UC3: Delete User" as UC3
    usecase "UC4: Manage Roles and Permissions" as UC4
    usecase "UC5: Monitor Platform Usage" as UC5

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
  }

  ' User Use Cases
  package "Account Management" {
    usecase "UC6: Register Account" as UC6
    usecase "UC7: Update Account" as UC7
    usecase "UC8: Delete Account" as UC8
    usecase "UC9: Join Energy Community" as UC9

    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
  }

  ' Prosumer Use Cases
  package "Energy Management for Prosumer" {
    usecase "UC10: Upload Energy Data" as UC10
    usecase "UC11: Update Energy Data" as UC11
    usecase "UC12: Analyse Energy Trends \n(define x, y values and relation)" as UC12
    usecase "UC13: View Consumption/Production History" as UC13
    /' usecase "UC14: Set Energy Usage Preferences" as UC14 '/
    /' usecase "UC15: Trade Energy with Community" as UC15 '/
    /' usecase "UC16: Optimize Energy Usage" as UC16 '/
    usecase "UC17: View Cost/Revenue from Trading" as UC17

    Prosumer --> UC10
    Prosumer --> UC11
    Prosumer --> UC12
    Prosumer --> UC13
/'     Prosumer --> UC14
    Prosumer --> UC15
    Prosumer --> UC16 '/
    Prosumer --> UC17
  }

  ' Community Manager Use Cases
  package "Community Management" {
    usecase "UC18: Create Energy Community" as UC18
    usecase "UC19: Add Community Data" as UC19
    usecase "UC20: Analyse Community Energy Balance" as UC20
    usecase "UC21: Delete Community Data" as UC21
    usecase "UC22: Manage Community Members" as UC22
    usecase "UC23: Generate Community Reports" as UC23
    usecase "UC24: Configure Energy Sharing Rules" as UC24
    usecase "UC25: Monitor Energy Sharing Efficiency" as UC25
    /' usecase "UC26: Set Community Energy Goals" as UC26 '/

    CM --> UC18
    CM --> UC19
    CM --> UC20
    CM --> UC21
    CM --> UC22
    CM --> UC23
    CM --> UC24
    CM --> UC25
/'     CM --> UC26 '/
  }


}

@enduml
```
**Level 3 - Version 2**

```plantuml
@startuml
left to right direction

' Actors
actor Admin
actor User
actor Prosumer
actor "Community Manager" as CM
/' actor Grid
actor Solver '/

' Actor Relationships
Prosumer --|> User : <<extends>>
CM --|> User : <<extends>>

rectangle "Energy Community Platform" {

  ' Admin Use Cases
  package "Admin Management" {
    usecase "UC1: Create User" as UC1
    usecase "UC2: Update User" as UC2
    usecase "UC3: Delete User" as UC3
    usecase "UC4: Manage Roles and Permissions" as UC4
    usecase "UC5: Monitor Platform Usage" as UC5

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
  }

  ' User Use Cases
  package "Account Management" {
    usecase "UC6: Register Account" as UC6
    usecase "UC7: Update Account" as UC7
    usecase "UC8: Delete Account" as UC8
    usecase "UC9: Join Energy Community" as UC9

    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
  }

  ' Prosumer Use Cases
  package "Energy Management for Prosumer" {
    usecase "UC10: Upload Energy Data" as UC10
    usecase "UC11: Update Energy Data" as UC11
    usecase "UC12: Analyse Energy Trends" as UC12
    usecase "UC13: View Consumption/Production History" as UC13
    usecase "UC14: Set Energy Usage Preferences" as UC14
    usecase "UC15: Trade Energy with Community" as UC15
    usecase "UC16: Optimize Energy Usage" as UC16
    usecase "UC17: View Cost/Revenue from Trading" as UC17

    Prosumer --> UC10
    Prosumer --> UC11
    Prosumer --> UC12
    Prosumer --> UC13
    Prosumer --> UC14
    Prosumer --> UC15
    Prosumer --> UC16
    Prosumer --> UC17
  }

  ' Community Manager Use Cases
  package "Community Management" {
    usecase "UC18: Create Energy Community" as UC18
    usecase "UC19: Add Community Data" as UC19
    usecase "UC20: Analyse Community Energy Balance" as UC20
    usecase "UC21: Delete Community Data" as UC21
    usecase "UC22: Manage Community Members" as UC22
    usecase "UC23: Generate Community Reports" as UC23
    usecase "UC24: Configure Energy Sharing Rules" as UC24
    usecase "UC25: Monitor Energy Sharing Efficiency" as UC25
    usecase "UC26: Set Community Energy Goals" as UC26

    CM --> UC18
    CM --> UC19
    CM --> UC20
    CM --> UC21
    CM --> UC22
    CM --> UC23
    CM --> UC24
    CM --> UC25
    CM --> UC26
  }

  ' Grid and Solver Use Cases
  package "External Interactions" {
    usecase "UC27: Buy/Sell Energy" as UC27

    Grid --> UC27
    Prosumer --> UC27
    CM --> UC27

    Solver --> UC16  
    'Optimize Energy Usage (Prosumer)
    Solver --> UC20  
    'Analyse Community Energy Balance (Community Manager)'
  }
}

@enduml
```

### Domain Model

**DDD based on currently functional system**

```plantuml
@startuml DDD

hide circle
hide fields
' ======= layout =========
skinparam backgroundColor #fcf9ea
skinparam titleBorderRoundCorner 15
skinparam titleFontSize 30
skinparam classAttributeIconSize 0
skinparam titleFontName Arial Black
skinparam titleFontColor #f8a978
skinparam roundcorner 20
skinparam stereotypeCBackgroundColor ffc5a1
left to right direction

skinparam class {

ArrowColor ffc5a1
BorderColor White
BackgroundColor badfdb
BackgroundColor<<Event>> skyblue
BackgroundColor<<Service>> Moccasin
}
left to right direction

package "<<agr Prosumer>>"{
    class Prosumer<<entity>><<root>>{}
    class ProsumerId<<vo>>{}


    Prosumer --> "1" ProsumerId

    
}

package "<<agr Profile>>"{
    class Profile<<entity>><<root>>{

    }
    class ProfileId<<vo>>{}
    class ProfileTimeStamp<<vo>>{}
    class ProfileLoad<<vo>>{} 
    class SoldEnergy<<vo>>{}
    class BoughtEnergy<<vo>>{}
    class PhotovoltaicEnergyLoad<<vo>>{}
    class StateOfCharge<<vo>>{}

    note right{
        Balance of the Prosumer in kw/h, positive values lead to buy energy from the grid
    }

    Prosumer --> "1" Profile
    Profile --> "1" ProfileTimeStamp
    Profile --> "1" ProfileId
    Profile --> "1" ProfileLoad

    Profile --> "1" SoldEnergy
    Profile --> "1" BoughtEnergy
    Profile --> "1" PhotovoltaicEnergyLoad
    Profile --> "1" StateOfCharge
    
    note right of ProfileLoad
    Energy required by the user in the interval
    end note 
    
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
    Prosumer --|> "1" User
}

package "<<agr Administrator>>"{
    class Administrator<<entity>><<root>>{

    }
    class AdminId<<vo>>{}

    Administrator --|> User
   Administrator--> "1" AdminId
}

package "<<agr CommunityManager>>"{
    class CommunityManager<<entity>><<root>>{}
    class CommunityManagerId <<vo>>
     CommunityManager --|> User
     CommunityManager --> "1" CommunityManagerId
}



package "<<agr Battery(ESS)>>"{
    class Battery<<entity>><<root>>{}
    class BatteryId<<vo>>{}
    class BatteryName<<vo>>{}
    class MaxCapacity<<vo>>{}
    class Efficiency<<vo>>{}
    class MaxChargeDischarge <<vo>>{}
    

    Prosumer --> "1" Battery
    Battery --> "1" BatteryId
    Battery --> "1" BatteryName
    Battery --> "1" MaxCapacity
    Battery --> "1" Efficiency
    Battery --> "1" MaxChargeDischarge
}


package "<<agr Community>>"{
    class Community<<entity>><<root>>{

    }
    class CommunityId<<vo>>{}
    class CommunityName<<vo>>{}
    class CommunityProsumerIds<<array>>{
    }
    Community --> "1" CommunityId
    Community -> "1" CommunityName
    Community --> "1" CommunityProsumerIds
    Community --> "1" CommunityManager
}

package "<<agr MembershipRequest>>" {
    class MembershipRequest<<entity>><<root>>{}
    class RequestId<<vo>>{}
    class ProsumerId<<vo>>{}
    class CommunityId<<vo>>{}
    class Status<<vo>>{}
    class TimeStamp<<vo>>{}

    MembershipRequest --> "1" RequestId
    MembershipRequest --> "1" ProsumerId
    MembershipRequest --> "1" CommunityId
    MembershipRequest --> "1" Status
    MembershipRequest --> "1" TimeStamp
    Prosumer --> "1..*" MembershipRequest
    CommunityManager --> "1..*" MembershipRequest
}

package "<<agr CommunityEnergyProfile>>" {
    class CommunityEnergyProfile<<entity>><<root>>{}
    class CommunityEnergyProfileId<<vo>>{}
    class TimeStamp<<vo>>{}
    class TotalProduction<<vo>>{}
    class TotalConsumption<<vo>>{}
    class SharedEnergy<<vo>>{}

    CommunityEnergyProfile --> "1" CommunityEnergyProfileId
    CommunityEnergyProfile --> "1" TimeStamp
    CommunityEnergyProfile --> "1" TotalProduction
    CommunityEnergyProfile --> "1" TotalConsumption
    CommunityEnergyProfile --> "1" SharedEnergy
    Community --> "1..*" CommunityEnergyProfile
}

@enduml

```


**Energy Community Platform DDD (without electric car and prosumers distances concepts)**

```plantuml
@startuml 

hide circle
hide fields
' ======= layout =========
skinparam backgroundColor #fcf9ea
skinparam titleBorderRoundCorner 15
skinparam titleFontSize 30
skinparam classAttributeIconSize 0
skinparam titleFontName Arial Black
skinparam titleFontColor #f8a978
skinparam roundcorner 20
skinparam stereotypeCBackgroundColor ffc5a1
left to right direction

skinparam class {

ArrowColor ffc5a1
BorderColor White
BackgroundColor badfdb
BackgroundColor<<Event>> skyblue
BackgroundColor<<Service>> Moccasin
}
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

package "<<agr CommunityManager>>"{
    class CommunityManager<<entity>><<root>>{}
     CommunityManager --|> User
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
    class MaxCapacity<<vo>>{}
    class Efficiency<<vo>>{}
    class MaxChargeDischarge <<vo>>{}
    class InitialCapacity <<vo>>{}
    class TimeStamp <<vo>>{}

    Prosumer --> "1" Battery
    Battery --> "1" BatteryId
    Battery --> "1" BatteryName
    Battery --> "1" MaxCapacity
    Battery --> "1" Efficiency
    Battery --> "1" MaxChargeDischarge
    Battery --> "1" InitialCapacity
    Battery --> "1" TimeStamp 

/'     note right of MaxCapacity 
    Represents the Cap values for each ESS.
    end note

    note right of EfficiencyCharge
    Represents the Eta values for charging efficiency.
    end note

    note right of EfficiencyDischarge
     Represents the Eta values for discharging efficiency (if modeled separately).
     end note

    note right of MinimalSOC
      Could represent a minimum state of charge (not explicitly provided in your data but could be relevant).
    end note
 '/


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


```

### Class Diagram

Level 1

```plantuml
@startuml

' Diagrama de Classes
class Prosumer {
    - PLoad: float[]
    - PPV_capacity: float[]
    - SOC: float
    - P_buy: float
    - P_sell: float
    + optimizeEnergy()
}

class Grid {
    - Cbuy: float[]
    - Csell: float[]
    + giveEnergy()
    + buyEnergy()
}

class Solver {
    + resolverProblema()
}

Prosumer --> Grid : Compra/Vende Energia
Prosumer --> Prosumer : Troca Energia P2P
Prosumer --> Solver : Envia Modelo
Solver --> Prosumer : Retorna Resultados

@enduml

```

Level 2

```plantuml
@startuml 
skinparam style strictuml

class Prosumer {
  - pvProduction: float
  - load: float
  - pLoad: float
  - pESSCharge: float
  - pESSDischarge: float
  - pPV_ESS: float
  + calculatePLoad(): float
  + decideExchange(): void
  + decideBatteryUsage(): void
}

class Battery {
  - capacity: float
  - stateOfCharge: float
  + charge(amount: float): void
  + discharge(amount: float): void
}

class Community {
  - peers: List<Prosumer>
  + hasEnergy(): bool
  + needsEnergy(): bool
  + receiveEnergy(from: Prosumer): void
  + provideEnergy(to: Prosumer): void
}

class Exchange {
  - pSell: float
  - pBuy: float
  + registerSell(from: Prosumer, amount: float): void
  + registerBuy(to: Prosumer, amount: float): void
}

Prosumer --> Battery
Prosumer --> Community
Prosumer --> Exchange
Community --> "0..*" Prosumer

@enduml

```

**Level 3 - Version 1**
```plantuml
@startuml 
skinparam style strictuml
hide methods

class Prosumer {
  - prosumerId: String
  - prosumerDescription: String
  - pLoad: float[][]
  - ppvCapacity: float[][]
  + calculateSoc(): void
  + decideExchange(): void
}

class Profile {
  - profileId: String
  - profileTimeStamp: TimeStamp
  - profileValue: float
}

class Grid {
  - gridId: String
  - gridName: String
}

class GridExchange {
  - gridExchangeId: String
  - gridExchangeTimeStamp: TimeStamp
  - gridExchangeBuy: float
  - gridExchangeSell: float
  - gridExchangePriceBuy: float
  - gridExchangePriceSell: float
  + registerBuy(amount: float): void
  + registerSell(amount: float): void
}

class Community {
  - communityId: String
  - communityName: String
  - prosumers: Prosumer[*]
  + hasEnergy(): bool
  + needsEnergy(): bool
}

class CommunityExchange {
  - communityExchangeId: String
  - communityExchangeTimeStamp: TimeStamp
  - peerIn: float
  - peerOut: float
}

class PhotovoltaicPanel {
  - photovoltaicId: String
  - photovoltaicName: String
}

class PhotovoltaicEnergy {
  - photovoltaicEnergyId: String
  - photovoltaicEnergyTimeStamp: TimeStamp
  - pvLoad: float
  - pvBattery: float
}

class Battery {
  - batteryId: String
  - batteryName: String
  - capacityMax: float
  - efficiencyCharge: float
  - efficiencyDischarge: float
  - socMin: float
}

class BatteryEnergy {
  - batteryEnergyId: String
  - batteryEnergyTimeStamp: TimeStamp
  - stateOfCharge: float
  - charge: float
  - discharge: float
  - chargeBinary: bool
  - dischargeBinary: bool
}

class TimeStamp {
  - intervalOfTime: String
  - numberOfIntervals: int
}

' Relacionamentos '
Prosumer --> "1" Profile
Prosumer --> "1" PhotovoltaicPanel
Prosumer --> "1" Battery
Prosumer --> "1..*" GridExchange
Prosumer --> "1..*" CommunityExchange
PhotovoltaicPanel --> "1..*" PhotovoltaicEnergy
Battery --> "1..*" BatteryEnergy
Grid --> "1..*" GridExchange
Community --> "1..*" CommunityExchange
Community --> "1..*" Prosumer
PhotovoltaicEnergy --> "1" BatteryEnergy
Profile --> "1" TimeStamp
GridExchange --> "1" TimeStamp
CommunityExchange --> "1" TimeStamp
PhotovoltaicEnergy --> "1" TimeStamp
BatteryEnergy --> "1" TimeStamp

note right of Profile: Balance of the Prosumer in kW/h, positive values lead to buy energy from the grid
note right of BatteryEnergy: Charge and discharge constrained by efficiency and capacity

@enduml
```

**Level 3 - Version 2**
```plantuml
@startuml
skinparam style strictuml
hide methods

' Classes from DDD aggregates
class Prosumer {
  - prosumerId: String
}

class Profile {
  - profileId: String
  - profileTimeStamp: TimeStamp
  - profileLoad: float
  - soldEnergy: float
  - boughtEnergy: float
  - photovoltaicEnergyLoad: float
  - stateOfCharge: float
}

class User {
  - userId: String
  - userName: String
  - userEmail: String
  - userPassword: String
  - userPhone: String
}

class Administrator {
  - adminId: String
}

class CommunityManager {
  - communityManagerId: String
}

class Battery {
  - batteryId: String
  - batteryName: String
  - maxCapacity: float
  - efficiency: float
  - maxChargeDischarge: float
}

class Community {
  - communityId: String
  - communityName: String
  - communityProsumerIds: String[*]
}

class MembershipRequest {
  - requestId: String
  - prosumerId: String
  - communityId: String
  - status: String
  - timeStamp: TimeStamp
}

class CommunityEnergyProfile {
  - communityEnergyProfileId: String
  - timeStamp: TimeStamp
  - totalProduction: float
  - totalConsumption: float
  - sharedEnergy: float
}

class TimeStamp {
  - intervalOfTime: String
  - numberOfIntervals: int
}

' Relationships
Prosumer --> "1" Profile
Prosumer --> "1" Battery
Prosumer --|> "1" User
Prosumer --> "1..*" MembershipRequest

Profile --> "1" TimeStamp

User <|-- Administrator
User <|-- CommunityManager

Community --> "1..*" Prosumer
Community --> "1" CommunityManager
Community --> "1..*" CommunityEnergyProfile
CommunityManager --> "1..*" MembershipRequest

CommunityEnergyProfile --> "1" TimeStamp

note right of Profile: Balance of the Prosumer in kW/h, positive values lead to buy energy from the grid

@enduml
```


### Logical View
#### Version 1


**Backend**

```plantuml
@startuml 

interface API_Optimization
interface API_Exterior


component "BackEnd" {
    component DB
    component Server
    port P1
    port P2
}

API_Optimization -- P1
API_Exterior -- P2
P1 - Server
P2 - Server
Server -(0- DB

@enduml
```
**Level 1**
```plantuml
@startuml    

interface API 
interface UI 
component System

API - System
UI - System

@enduml
```


**Level 2**

```plantuml
@startuml

interface API 
interface UI_Admin
interface UI_Prosumer
interface UI_EnergyCommunity

component "Level 2" {
    component FrontEnd
    component BackEnd
    component Optimization
    port P1
    port P2
    port P3
    port P4
}

API -- P1
UI_Admin -- P2
UI_Prosumer -- P3
UI_EnergyCommunity -- P4
P1 - BackEnd
P2 - FrontEnd
P3 - FrontEnd
P4 - FrontEnd
FrontEnd -(0- BackEnd
Optimization -(0- BackEnd

@enduml

```


**Server**
```plantuml
@startuml 

interface API_Optimization
interface API_Exterior
interface DB

component "Server" {
component Controllers
component Domain
component Services
component Repositories
component Authorizer
component Dto
component Logs 
component Mapper

Controllers -(0- Services
Services -(0- Domain
Services -(0- Authorizer
Services -(0- Logs
Services -(0- Mapper
Mapper -(0- Dto
Repositories -0)- Services



port P1
port P2
port P3

}


P2 -- Repositories
API_Exterior -- P1
P1 -- Controllers
DB -- P2
API_Optimization -- P3
P3 -- Services



@enduml
```
Version 2 

**Level 1** 
```plantuml
@startuml
    component SATCOMM <<Context C4>>{
        port p1 as " "
    }
    interface UI_User
    interface UI_Administrator
    UI_User --> p1
    UI_Administrator --> p1
@enduml
```

**Level 2** 
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
````

**Level 3**
```plantuml
@startuml
    skinparam linetype normal
    component EM as "Energy Management" <<Container (C4)>>{
        port p1 as " "
        port p2 as " "
        port p3 as " "
        folder FD as "Frameworks and Drivers Layer"{
            component Routing <<Container (C4)>>
            component Persistence <<Container (C4)>>
        }
        interface Controller_API as "Controller API"
        interface DMAPI as "Data Model API"
        interface PAPI as "Persistence API"
        Persistence -right- PAPI
        
        component Data_Model as "Data Model" <<Container (C4)>>
        Persistence -- DMAPI
        DMAPI -right- Data_Model
        folder IA as "Interface Adapters Layer"{
            component Controller <<Container (C4)>>
            component Repository <<Container (C4)>>
        }
        interface REPOAPI as "Repository API"

        folder AB as "Application Business Rules"{
            component AS as "Application Service" <<Container (C4)>>
        }
        Repository -- REPOAPI
        REPOAPI -- AS

        interface ASAPI as "App Service API"

        Controller --- ASAPI
        ASAPI -- AS

        interface DTOAPI as "DTO API"

        component DTO <<Container (C4)>>

        folder EB as "Enterprise Business Rules"{
            component DomainModel as "Domain Model" <<Container (C4)>>
        }

        interface ModelAPI as "Model API"

        Repository -- ModelAPI
        ModelAPI -- DomainModel
        Controller -- DTOAPI
        DTOAPI -- AS
        DTOAPI -left- DTO
        DMAPI -- Repository
        PAPI -- Repository
        Routing -right- Controller_API
        Controller_API -- Controller
    }
    interface AuthAPI as "Authentication API"
    interface OptimizationAPI as "Optimization API"
    interface EMAPI as "Energy Management API"
    p1 -up- EMAPI
    interface SGBDAPI as "SGBD API"
    p2 -up- SGBDAPI
    p1 -- Routing
    p3 -up- AuthAPI
    p3 -up- OptimizationAPI
@enduml
````


### Layers Diagram
#### Version 1

**View**

````plantuml
@startuml
'https://plantuml.com/component-diagram



package "Frameworks & Drivers" {
    component Database
    component Routing
}


package "Interface Adapters"{
    component Repositories
    component Controllers
}


Routing ..> Controllers
Database <.. Repositories

package "Application Business Rules"{
    component Services
}

Controllers ..> Services

package "Enterprise Business Rules"{
    component Domain
    component IRepositories
}

Services ..> Domain
Services ..> IRepositories
Repositories ..|> IRepositories

@enduml
````

**Layout**

```plantuml
@startuml
'https://plantuml.com/component-diagram



package "Frameworks & Drivers" {
    component Database
    component Routing
}

component DTO
component Data_Model

Database -- Data_Model_API
Database -- Database_Driver_API
Data_Model_API - Data_Model
Routing -- DTO_API
Routing -- Controller_API
DTO_API - DTO


package "Interface Adapters"{
    component Repositories
    component Controllers
}

Controller_API -- Controllers
DTO_API -- Controllers
Data_Model_API -- Repositories
Database_Driver_API -- Repositories
Controllers -- Service_API
Repositories -- Repo_API
Repositories -- Model_API
'Controllers -- VO_API
'Repositories -- VO_API

package "Application Business Rules"{
    component Services
}

'VO_API -- Services
Service_API -- Services
Repo_API -- Services
Services -- Model_API

package "Enterprise Business Rules"{
    component Domain
}

'VO_API -- Domain
Model_API -- Domain




@enduml
```

### Physical View 

**Level 2**
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

