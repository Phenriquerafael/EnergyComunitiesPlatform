
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