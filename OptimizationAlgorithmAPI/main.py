#libs do optimization algorithm
from scipy.optimize import newton_krylov
from pyomo.environ import SolverFactory, SolverManagerFactory
from pyomo.environ import*
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from pulp import LpVariable, LpMinimize, LpProblem, lpSum, value, GUROBI, GLPK_CMD
import envs as en
import pyomo.contrib.solver.ipopt
import os
from pyomo.environ import value

#libs do FastAPI
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import pandas as pd
from io import BytesIO

app = FastAPI()

def run_optimization(input_file: BytesIO) -> BytesIO:
# Ler o Excel recebido (sem salvar no disco)
    data = pd.read_excel(input_file, header=None, sheet_name=None)

    #Optimization algorithm
    PPV_capacity = data['PPV_capacity']   #  maximum PV production of each PV unit in each hour
    
    PLoad=data['PL']              # hourly load profile of prosumers

    Cbuy=(data['buysell'])[1]         # The price of electricity bought from the grid

    Csell=(data['buysell'])[2]         # The price of electricity sold to the grid

    ESSparam=(data['ESS-Param'])      # Energy Storage System parameters

    ΔT = 0.25  # Time interval (e.g., 15-minute periods)

    # Model Definition

    nPlayers=len(PLoad.loc[1,:])-1
    Thorizon = 96  # Periods per day
    #Thorizon=len(PLoad.loc[:,1])-1
    days = int(len(PLoad) / Thorizon)  # Number of days

    # Initialize a dictionary to store results
    SOC_end_of_day = {}

    detailed_results = []


    total_objective_value =0

    ################## Indexes ####################################################################################

    for day in range(1, days + 1):
        print(f"Solving for Day {day}...")
        
        # Extract daily data
        start_idx = (day - 1) * Thorizon + 1
        end_idx = start_idx + Thorizon - 1
        PLoad_day = PLoad.loc[start_idx:end_idx, :]
        PPV_capacity_day = PPV_capacity.loc[start_idx:end_idx, :]
        Cbuy_day = Cbuy.loc[start_idx:end_idx]
        Csell_day = Csell.loc[start_idx:end_idx]   

        model=AbstractModel()    
    # Define sets
        model.PL = RangeSet(nPlayers)                      # Prosumers
        model.T = RangeSet(Thorizon)                       # Time Horizon
        model.ESS1 =  RangeSet(len(ESSparam.loc[:,1])-1)              # Energy Storage Systems



        model.PLs=Param(model.T,model.PL,initialize=lambda model,r,c:PLoad.at[r,c], within=Reals)
        model.PPV_capacitys=Param(model.T,model.PL,initialize=lambda model,r,c:PPV_capacity.at[r,c], within=Reals)
        model.Cbuys=Param(model.T,initialize=lambda model,r:Cbuy.at[r], within=Reals)
        model.Csells=Param(model.T,initialize=lambda model,r:Csell.at[r], within=Reals)
        model.ESSparams=Param(model.ESS1,model.PL,initialize=lambda model,r,c:ESSparam.at[r,c], within=Reals)



    # Variables
        model.P_ESS_s = Var(model.PL, model.T, within=NonNegativeReals)  # ESS state of charge
        model.P_ESS_ch = Var(model.PL, model.T, within=NonNegativeReals)  # ESS charging
        model.P_ESS_dch = Var(model.PL, model.T, within=NonNegativeReals)  # ESS discharging
        model.I_ESS_ch = Var(model.PL, model.T, within=Binary)  # ESS charging binary
        model.I_ESS_dch = Var(model.PL, model.T, within=Binary)  # ESS discharging binary
        model.P_buy = Var(model.PL, model.T, within=NonNegativeReals)  # Power bought from the grid
        model.P_sell = Var(model.PL, model.T, within=NonNegativeReals)  # Power sold to the grid
        model.P_peer = Var(model.PL, model.PL, model.T, within=NonNegativeReals)
        

        model.P_PV_ESS = Var(model.PL, model.T, within=NonNegativeReals)  # PV used for charging battery
        model.P_PV_load = Var(model.PL, model.T, within=NonNegativeReals)  # PV used for direct load consumption






    # Constraints
        def SocESS(model, PL, T):
            if T == 1:
                # Initial SOC set to the previous day's final SOC
                return model.P_ESS_s[PL, T] == (SOC_end_of_day.get((PL, day - 1), model.ESSparams[4, PL])
                                                + ΔT * (model.ESSparams[1, PL] * model.P_ESS_ch[PL, T]
                                                        - model.P_ESS_dch[PL, T] / model.ESSparams[1, PL]))
            else:
                return model.P_ESS_s[PL, T] == (model.P_ESS_s[PL, T - 1]
                                                + ΔT * (model.ESSparams[1, PL] * model.P_ESS_ch[PL, T]
                                                        - model.P_ESS_dch[PL, T] / model.ESSparams[1, PL]))

        model.c_SOC = Constraint(model.PL, model.T, rule=SocESS)

        def chargeESS1(model,PL,T):
        
                return model.P_ESS_ch[PL,T]<=model.ESSparams[2,PL]*model.ESSparams[3,PL]*model.I_ESS_ch[PL,T]
        
        model.c42=Constraint(model.PL,model.T,rule=chargeESS1) #  ESS constraints


        def dischargeESS1(model,PL,T):
        
                return model.P_ESS_dch[PL,T]<=model.ESSparams[2,PL]*model.ESSparams[3,PL]*model.I_ESS_dch[PL,T]
        
        model.c43=Constraint(model.PL,model.T,rule=dischargeESS1) #  ESS constraints


        def chargedischargeESS(model,PL,T):
        
                return model.I_ESS_ch[PL,T]+model.I_ESS_dch[PL,T]<=1
        
        model.c44=Constraint(model.PL,model.T,rule=chargedischargeESS) #  ESS constraints

        def chargedischargelimit(model,PL):
        
                return sum( model.I_ESS_ch[PL,T]+model.I_ESS_dch[PL,T] for T in model.T) <=5
        
        model.c44=Constraint(model.PL,rule=chargedischargelimit) #  ESS constraints



        def load_balance(model, PL, T):
            return model.PLs[T, PL] == model.P_PV_load[PL, T] + model.P_buy[PL, T] - model.P_sell[PL, T] + model.P_ESS_dch[PL, T]  + sum(model.P_peer[PL2, PL, T] - model.P_peer[PL, PL2, T] for PL2 in model.PL if PL2 != PL)

        model.c_balance = Constraint(model.PL, model.T, rule=load_balance)

        def peer_transfer_limit(model, PL,  T):
                return sum(model.P_peer[PL, PL2, T] for PL2 in model.PL if PL2 != PL)<= max(0, model.PPV_capacitys[T, PL] - model.PLs[T, PL])
        model.c_peer = Constraint(model.PL,  model.T, rule=peer_transfer_limit)

        def PV_utilization(model, PL, T):
            return model.P_PV_ESS[PL, T] + model.P_PV_load[PL, T] == model.PPV_capacitys[T, PL]

        model.c_PV_utilization = Constraint(model.PL, model.T, rule=PV_utilization)
        def chargeESS2(model, PL, T):
            return model.P_ESS_ch[PL, T] == model.P_PV_ESS[PL, T]  # Battery charges only from PV

        model.c_ESS_PV_only = Constraint(model.PL, model.T, rule=chargeESS2)





        def enforce_battery_soc_limit(model, PL, T):
            """
            Prevents battery from discharging below SOC_min.
            """
            return model.P_ESS_s[PL, T] - ΔT * model.P_ESS_dch[PL, T] >= model.ESSparams[4,PL]
        model.c21=Constraint(model.PL,model.T,rule=enforce_battery_soc_limit) 



        def Pbuy11(model,PL,T):
        
            return model.P_buy[PL,T]<=12.5        #(sum(model.Pro_C[PL,NEC]*model.PV_connections[PL,PV]*model.PPV_capacitys[12,PV] for PV in model.PV  for PL in model.PL ))/1  
    
        model.c22=Constraint(model.PL,model.T,rule=Pbuy11) 


        def Psell11(model,PL,T):
        
            return model.P_sell[PL,T]<=10.5      #(sum(model.Pro_C[PL,NEC]*model.PV_connections[PL,PV]*model.PPV_capacitys[12,PV] for PV in model.PV  for PL in model.PL ))/1  
    
        model.c23=Constraint(model.PL,model.T,rule=Psell11) 




    # Objective Function

        def rule_OF(model):
            return sum(
                (model.Cbuys[t] * model.P_buy[PL, t]  # ✅ Corrected indexing
                - model.Csells[t] * model.P_sell[PL, t])
                for t in model.T
                for PL in model.PL  # ✅ Correct iteration
                )

        model.Objective = Objective(rule=rule_OF, sense=minimize)


    #model.c_SOC.deactivate()



        opt = SolverFactory('gurobi')



    #opt.options['TimeLimit'] = 100000  # Set a time limit of 300 seconds
    #opt.options['MIPGap'] = 0.01    # Set a MIP gap tolerance of 1%
        instance=model.create_instance() 
    # Solve the model

        opt.options['Threads'] = 28       # Use 4 threads (adjust based on your hardware)
        opt.options['TimeLimit'] = 60000   # Set a time limit of 600 seconds (10 minutes)
    #    opt.options['MIPGap'] = 0.00005     # Allow 1% optimality gap
    #    opt.options['Heuristics'] = 0.3
    # Solve and measure time

        results = opt.solve(instance)


        results.write()
        SOC_end_of_day.update({(PL, day): value(instance.P_ESS_s[PL, Thorizon]) for PL in model.PL})
        
        day_objective_value = value(instance.Objective)
        total_objective_value += day_objective_value
        
        

        for PL in model.PL:
            for t in model.T:
                detailed_results.append({
                    "Day": day,
                    "Time_Step": t,
                    "Prosumer": PL,
                    "P_buy": value(instance.P_buy[PL, t]),
                    "P_sell": value(instance.P_sell[PL, t]),
                    "SOC": value(instance.P_ESS_s[PL, t]),
                    "P_ESS_ch": value(instance.P_ESS_ch[PL, t]),
                    "P_ESS_dch": value(instance.P_ESS_dch[PL, t]),
                    "P_PV_load": value(instance.P_PV_load[PL, t]),
                    "P_PV_ESS": value(instance.P_PV_ESS[PL, t]),
                    "P_Peer_out": sum(value(instance.P_peer[PL, PL2, t]) for PL2 in model.PL if PL2 != PL),
                    "P_Peer_in": sum(value(instance.P_peer[PL2, PL, t]) for PL2 in model.PL if PL2 != PL),
                    "P_Load": value(instance.PLs[t, PL])
                    })
                
    #End of optimization algorithm 

    return {
        "total_objective_value": total_objective_value,
        "detailed_results": detailed_results
    }

@app.post("/optimize")
async def optimize_excel(file: UploadFile = File(...)):
    contents = await file.read()
    input_io = BytesIO(contents)

    result = run_optimization(input_io)
    return JSONResponse(content=result)
