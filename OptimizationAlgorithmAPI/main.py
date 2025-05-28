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

import requests

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4000"],  
    allow_credentials=True,
    allow_methods=["*"],  # permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # permite todos os headers
)



# Defina uma variável para armazenar o progresso da otimização
optimization_status = {
    "status": "waiting",  # Estado inicial
    "progress": 0         # Progresso inicial
}


def run_optimization(file_path: BytesIO) -> BytesIO:
    global optimization_status  # Acesse a variável global para atualização

    # Comece o processo de otimização
    optimization_status["status"] = "processing"
    optimization_status["progress"] = 0
    print(optimization_status)
# Ler o Excel recebido (sem salvar no disco)
    #df = pd.read_excel(file_path, sheet_name=None)

    df = pd.read_excel(file_path,'PPV_capacity',usecols='B:F')
    PPV_capacity=df.to_numpy()      #  maximum PV production of each PV unit in each hour


    df = pd.read_excel(file_path,'PL',usecols='B:F')
    PLoad=df.to_numpy()      #  hourly load profile of prosumers

    df = pd.read_excel(file_path,'buysell',usecols='B:C')
    Cbuysell=df.to_numpy()     
    Cbuy=Cbuysell[:,0]         # The price of electricity bought from the grid
    Csell=Cbuysell[:,1]         # The price of electricity sold to the grid


    df = pd.read_excel(file_path,'ESS-Param',usecols='B:F')
    ESSparam=df.to_numpy()      # Energy Storage System parameters
        



    ΔT = 0.25  # Time interval (e.g., 15-minute periods)

    # Model Definition

    nPlayers=len(PLoad[1,:])
    Thorizon = 96  # Periods per day
    #Thorizon=len(PLoad.loc[:,1])-1
    days =int(len(PLoad) / Thorizon)  # Number of days

    # Initialize a dictionary to store results
    SOC_end_of_day = {}   #{(1, 1): 0.2, (2, 1): 0.2,(3, 1): 0.2,(4, 1): 0.2, (5, 1): 0.2}

    detailed_results = []


    total_objective_value =0

    ################## Indexes ####################################################################################

    for day in range(1, days + 1):
        print(f"Solving for Day {day}...")

        # Extract daily data
        start_idx = (day - 1) * Thorizon 
        end_idx = start_idx + Thorizon 
        PLoad_day = PLoad[start_idx:end_idx]
        PPV_capacity_day = PPV_capacity[start_idx:end_idx]
        Cbuy_day = Cbuy[start_idx:end_idx]
        Csell_day = Csell[start_idx:end_idx]  
        PLoad[0:96]=PLoad_day
        PPV_capacity[0:96]= PPV_capacity_day
        Cbuy[0:96]=Cbuy_day
        Csell[0:96]=Csell_day

        model=AbstractModel()    
    # Define sets
        model.PL = RangeSet(nPlayers)                      # Prosumers
        model.T = RangeSet(Thorizon)                       # Time Horizon
        model.ESS1 =  RangeSet(len(ESSparam))              # Energy Storage Systems

        model.PLs=Param(model.T,model.PL,initialize=lambda model,r,c:PLoad[r-1,c-1], within=Reals)
        model.PPV_capacitys=Param(model.T,model.PL,initialize=lambda model,r,c:PPV_capacity[r-1,c-1], within=Reals)
        model.Cbuys=Param(model.T,initialize=lambda model,r:Cbuy[r-1], within=Reals)
        model.Csells=Param(model.T,initialize=lambda model,r:Csell[r-1], within=Reals)
        model.ESSparams=Param(model.ESS1,model.PL,initialize=lambda model,r,c:ESSparam[r-1,c-1], within=Reals)



    # Variables
        model.P_ESS_s = Var(model.PL, model.T, within=NonNegativeReals)  # ESS state of charge
        model.P_ESS_ch = Var(model.PL, model.T, within=NonNegativeReals)  # ESS charging
        model.P_ESS_dch = Var(model.PL, model.T, within=NonNegativeReals)  # ESS discharging
        model.I_ESS_ch = Var(model.PL, model.T, within=Binary)  # ESS charging binary
        model.I_ESS_dch = Var(model.PL, model.T, within=Binary)  # ESS discharging binary
        model.P_buy = Var(model.PL, model.T, within=NonNegativeReals)  # Power bought from the grid
        model.P_sell = Var(model.PL, model.T, within=NonNegativeReals)  # Power sold to the grid
        model.P_peer = Var(model.PL, model.PL, model.T, within=NonNegativeReals)
        

    #    model.P_PV = Var(model.PL, model.T, within=NonNegativeReals)  # PV used for charging battery
    #    model.P_PV_load = Var(model.PL, model.T, within=NonNegativeReals)  # PV used for direct load consumption

    # Constraints
        def SocESS(model, PL, T):
            if T == 1:
                # Initial SOC set to the previous day's final SOC
                prev_SOC = SOC_end_of_day.get((PL, day-1), model.ESSparams[4, PL])
                return model.P_ESS_s[PL, T] == prev_SOC + ΔT * (model.ESSparams[1, PL] * model.P_ESS_ch[PL, T] - model.P_ESS_dch[PL, T] / model.ESSparams[1, PL])
            else:
                return model.P_ESS_s[PL, T] == (model.P_ESS_s[PL, T - 1]
                                                + ΔT * (model.ESSparams[1, PL] * model.P_ESS_ch[PL, T]
                                                        - model.P_ESS_dch[PL, T] / model.ESSparams[1, PL]))

        model.c_SOC = Constraint(model.PL, model.T, rule=SocESS)
        
        def CapacitylimitESS1(model,PL,T):
        
                return  model.P_ESS_s[PL, T]<=model.ESSparams[3,PL]
        
        model.c92=Constraint(model.PL,model.T,rule=CapacitylimitESS1) #  ESS constraints

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
        
                return sum( model.I_ESS_ch[PL,T]+model.I_ESS_dch[PL,T] for T in model.T) <=8
        
        model.c45=Constraint(model.PL,rule=chargedischargelimit) #  ESS constraints



        def load_balance(model, PL, T):
            return model.PLs[T,PL]+model.P_ESS_ch[PL, T] == model.PPV_capacitys[T,PL] + model.P_buy[PL, T] - model.P_sell[PL, T] + model.P_ESS_dch[PL, T]  + sum(model.P_peer[PL2, PL, T] - model.P_peer[PL, PL2, T] for PL2 in model.PL if PL2 != PL)

        model.c_balance = Constraint(model.PL, model.T, rule=load_balance)

        def peer_transfer_limit(model, PL,  T):
                return sum(model.P_peer[PL, PL2, T] for PL2 in model.PL if PL2 != PL)<= max(0, model.PPV_capacitys[T, PL] - model.PLs[T, PL])
        model.c_peer = Constraint(model.PL,  model.T, rule=peer_transfer_limit)

    #    def PV_utilization(model, PL, T):
    #        return model.P_PV_ESS[PL, T] + model.P_PV_load[PL, T] == model.PPV_capacitys[T, PL]

    #    model.c_PV_utilization = Constraint(model.PL, model.T, rule=PV_utilization)
    #    def chargeESS2(model, PL, T):
    #        return model.P_ESS_ch[PL, T] == model.P_PV_ESS[PL, T]  # Battery charges only from PV

    #    model.c_ESS_PV_only = Constraint(model.PL, model.T, rule=chargeESS2)



        def enforce_battery_soc_limit(model, PL, T):
            """
            Prevents battery from discharging below SOC_min.
            """
            return model.P_ESS_s[PL, T] - ΔT * model.P_ESS_dch[PL, T] >= model.ESSparams[4,PL]
        model.c21=Constraint(model.PL,model.T,rule=enforce_battery_soc_limit) 



        def Pbuy11(model,PL,T):
        
            return model.P_buy[PL,T]<=200       #(sum(model.Pro_C[PL,NEC]*model.PV_connections[PL,PV]*model.PPV_capacitys[12,PV] for PV in model.PV  for PL in model.PL ))/1  
    
        model.c22=Constraint(model.PL,model.T,rule=Pbuy11) 


        def Psell11(model,PL,T):
        
            return model.P_sell[PL,T]<=200      #(sum(model.Pro_C[PL,NEC]*model.PV_connections[PL,PV]*model.PPV_capacitys[12,PV] for PV in model.PV  for PL in model.PL ))/1  
    
        model.c23=Constraint(model.PL,model.T,rule=Psell11) 




    # Objective Function

        def rule_OF(model):
            return sum(
                (model.Cbuys[t] * model.P_buy[PL, t]  # 
                - model.Csells[t] * model.P_sell[PL, t])
                for t in model.T
                for PL in model.PL  # 
                )

        model.Objective = Objective(rule=rule_OF, sense=minimize)


    #    model.c_ESS_PV_only.deactivate()



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
        
        # Atualizar o progresso a cada dia
        progress = int((day / days) * 100)  # Calcula o progresso em percentagem
        optimization_status["progress"] = progress


        for PL in model.PL:
            for t in model.T:
                detailed_results.append({
                    "Day": str(day),
                    "Time_Step": int(t),
                    "Prosumer": str(PL),
                    "P_buy": str(value(instance.P_buy[PL, t])),
                    "P_sell": str(value(instance.P_sell[PL, t])),
                    "SOC": str(value(instance.P_ESS_s[PL, t])),
                    "P_ESS_ch": str(value(instance.P_ESS_ch[PL, t])),
                    "P_ESS_dch": str(value(instance.P_ESS_dch[PL, t])),
                    "P_PV_load": str(value(instance.PPV_capacitys[t, PL])),   # Corrigido nome
                    #"P_PV_ESS": str(value(instance.P_PV_ESS[PL, t])),          # Descomenta e corrige
                    "P_Peer_out": str(sum(value(instance.P_peer[PL, PL2, t]) for PL2 in model.PL if PL2 != PL)),
                    "P_Peer_in": str(sum(value(instance.P_peer[PL2, PL, t]) for PL2 in model.PL if PL2 != PL)),
                    "P_Load": str(value(instance.PLs[t, PL]))
                })

        
                    
    #End of optimization algorithm
    optimization_status["status"] = "completed"
    optimization_status["progress"] = 100
    print(optimization_status)

    #send data do backen using lib requests
    # Dados a enviar
    data = {
        "total_objective_value":  str(total_objective_value),
        "detailed_results": detailed_results
    }

    url = "http://localhost:4000/api/profiles/optimize-results"  # corrige o URL conforme já falámos

    try:
        response = requests.post(url, json=data)
        print(response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print('Erro ao enviar o pedido:', e)

    return {
        "total_objective_value": total_objective_value,
        "detailed_results": detailed_results
    }

@app.post("/loadData")
async def optimize_excel(file: UploadFile = File(...)):
    contents = await file.read()
    input_io = BytesIO(contents)

    result = run_optimization(input_io)
    return JSONResponse(content=result)


@app.post("/run-optimization")
async def start_optimization(file: UploadFile = File(...)):
    # Aqui você pode chamar a função de otimização
    file_content = await file.read()
    file_path = BytesIO(file_content)

    # Execute a otimização de forma assíncrona, por exemplo, em outro thread ou processo
    run_optimization(file_path)

    return {"message": "Optimization started"}

@app.get("/optimization-status")
async def get_optimization_status():
    # Retorna o status e o progresso atual da otimização
    return {"status": optimization_status["status"], "progress": optimization_status["progress"]}

@app.post("/batteryList")
async def createBatteries(file: UploadFile = File(...)):
    contents = await file.read()
    input_io = BytesIO(contents)

    # Lê e transpõe o DataFrame
    df = pd.read_excel(input_io, header=0, index_col=0).T


    battery_list = []
    for ess_name, row in df.iterrows():
        battery = {
            "name": ess_name,
            "efficiency": str(row["Eta"]).replace(',', '.'),
            "maxCapacity": str(row["Cap"]).replace(',', '.'),
            "initialCapacity": str(row["Capinitial"]).replace(',', '.'),
            "maxChargeDischarge": str(row["Dprate"]).replace(',', '.')
        }

        # Não incluir "description" se estiver vazia
        battery_list.append(battery)


    payload = {
        "batteryList": battery_list
    }

    # Envia para a API externa
    url = "http://localhost:4000/api/batteries/batteryList"
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers)
        return JSONResponse(status_code=response.status_code, content=response.json())
    except requests.exceptions.RequestException as e:
        return JSONResponse(status_code=500, content={"error": str(e)})