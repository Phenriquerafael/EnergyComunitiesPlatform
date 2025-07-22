#libs do optimization algorithm
import json
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
from fastapi import FastAPI, Form, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
import pandas as pd
from io import BytesIO
from typing import List, Optional
from pydantic import BaseModel

import requests

from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:4000",
    "http://localhost",
    "http://localhost:8000",
]

# CORS configuration
""" app.add_middleware(
    CORSMiddleware,
    allow_origins=[],  
    allow_credentials=True,
    allow_methods=["*"],  # permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # permite todos os headers
)
 """
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Defina uma variável para armazenar o progresso da otimização
optimization_status = {
    "status": "waiting",  # Estado inicial
    "progress": 0         # Progresso inicial
}


def run_optimization(file_path: BytesIO, start_date_str, end_date_str, communityId, active_attributes, description) -> BytesIO:
#print("\n\n\ndates: "+start_date_str, end_date_str)
    
    all_data = pd.read_excel(file_path, sheet_name=None)

    # Extract data using Pandas
    df_pv = all_data['PPV_capacity']
    df_pl = all_data['PL']
    df_buysell = all_data['buysell']
    df_ess = all_data['ESS-Param']

    # Extract date and time columns
    date_pv = df_pv.iloc[:, 0].to_numpy().astype(str)
    time_pv = df_pv.iloc[:, 1].to_numpy().astype(str)
    datetime_pv = pd.to_datetime(
        pd.Series(date_pv).str.cat(pd.Series(time_pv), sep=' '),
        dayfirst=True
    ).to_numpy()


    date_pl = df_pl.iloc[:, 0].to_numpy().astype(str)
    time_pl = df_pl.iloc[:, 1].to_numpy().astype(str)
    datetime_pl = pd.to_datetime(
        pd.Series(date_pl).str.cat(pd.Series(time_pl), sep=' '),
        dayfirst=True
    ).to_numpy()



    date_buysell = df_buysell.iloc[:, 0].to_numpy().astype(str)
    time_buysell = df_buysell.iloc[:, 1].to_numpy().astype(str)
    datetime_buysell = pd.to_datetime(
        pd.Series(date_buysell).str.cat(pd.Series(time_buysell), sep=' '),
        dayfirst=True
    ).to_numpy()

    # Extract data as numpy arrays
    PPV_capacity_full = df_pv.iloc[:, 2:].to_numpy()
    PLoad_full = df_pl.iloc[:, 2:].to_numpy()
    Cbuysell_full = df_buysell.iloc[:, 2:].to_numpy()
    Cbuy_full = Cbuysell_full[:, 0]
    Csell_full = Cbuysell_full[:, 1]
    ESSparam = df_ess.iloc[:, 1:].to_numpy()

        
    #%%

    # Define the date range for the simulation
    if(start_date_str is None):start_date_str = '01.01.2024 00:00:00'
    if(end_date_str is None):end_date_str = '10.02.2024 23:45:00'
    
    #start_date_str = '01.01.2024 00:00:00'
    #end_date_str = '10.02.2024 23:45:00'




    # print(f"Default Start Date: {start_date_str}")
    # print(f"Default End Date: {end_date_str}")

    # # Ask user if they want to keep the default or input new dates
    # response = input("Do you want to continue with these dates? (yes/no): ").strip().lower()

    # if response == 'no':
    #     start_date_str = input("Enter new start date (format DD.MM.YYYY HH:MM:SS): ").strip()
    #     end_date_str = input("Enter new end date (format DD.MM.YYYY HH:MM:SS): ").strip()

    # print(f"Using Start Date: {start_date_str}")
    # print(f"Using End Date: {end_date_str}")

    start_date = pd.to_datetime(start_date_str, dayfirst=True).to_numpy()
    end_date = pd.to_datetime(end_date_str, dayfirst=True).to_numpy()


    # Filter data based on the date range using numpy
    mask_pv = (datetime_pv >= start_date) & (datetime_pv <= end_date)
    mask_pl = (datetime_pl >= start_date) & (datetime_pl <= end_date)
    mask_buysell = (datetime_buysell >= start_date) & (datetime_buysell <= end_date)


    PPV_capacity = PPV_capacity_full[mask_pl]
    PLoad = PLoad_full[mask_pl]
    Cbuy = Cbuy_full[mask_buysell]
    Csell = Csell_full[mask_buysell]
    datetime_sim = datetime_pl[mask_pl]

    # Ensure all data has the same number of time steps
    num_time_steps = len(PLoad)
    if PPV_capacity.shape[0] != num_time_steps or Cbuy.shape[0] != num_time_steps or Csell.shape[0] != num_time_steps:
        raise ValueError(
            "The number of time steps in PLoad, PPV_capacity, Cbuy, and Csell must be the same for the selected date range.")

    # Calculate ΔT using numpy
    time_diff_seconds = np.diff(datetime_sim).astype('timedelta64[s]').astype(np.float64)
    time_diff_minutes = time_diff_seconds / 60
    #indices = np.where(time_diff_minutes == 75)[0]
    unique_dt_minutes = np.unique(time_diff_minutes)
    #%%
    # if unique_dt_minutes.size > 1:
    #     raise ValueError("ΔT is not constant. The time step between data points must be constant.")
    # elif unique_dt_minutes.size == 0:
    #     raise ValueError("No time differences calculated. Check input data.")
    # else:
    #     dt_minutes_value = unique_dt_minutes[0]
    ΔT = 0.25  #dt_minutes_value / 60

    #%%

    # Calculate the number of days
    days = ((datetime_sim[-1] - datetime_sim[0]) / np.timedelta64(1, 'D')) + 1
    days = int(days)  # optional: convert to integer
    # Model Definition
    nPlayers = PLoad.shape[1]
    Thorizon = num_time_steps

    # Initialize SOC
    SOC_end_of_previous_period = {pl: ESSparam[3, pl - 1] for pl in range(1, nPlayers + 1)}
    detailed_results = []
    total_objective_value = 0
    update_interval = 288 # Update SOC every 288 time steps

    #print(f"Solving for the period from {datetime_sim[0]} to {datetime_sim[-1]}...")

    #%%
    ################## Indexes ####################################################################################

    #for day in range(days):  # Loop over days 0,1,2,..., days-1
        
    for chunk_start_time in range(0, Thorizon+1, update_interval):
        
        chunk_end_time = min(chunk_start_time + update_interval, Thorizon)
        
        print(f"Solving for time steps: {chunk_start_time} to {chunk_end_time}")
        
        
    
        
        model = ConcreteModel()  # Use ConcreteModel

        # Define sets
        model.PL = RangeSet(nPlayers)
        model.T = RangeSet(chunk_end_time - chunk_start_time)
        model.ESS1 = RangeSet(ESSparam.shape[0])

        # Define parameters using numpy arrays
        PLoad_chunk = PLoad[chunk_start_time:chunk_end_time]
        PPV_capacity_chunk = PPV_capacity[chunk_start_time:chunk_end_time]
        Cbuy_chunk = Cbuy[chunk_start_time:chunk_end_time]
        Csell_chunk = Csell[chunk_start_time:chunk_end_time]
        datetime_chunk = datetime_sim[chunk_start_time:chunk_end_time]
        
        
        model.PLs=Param(model.T,model.PL,initialize=lambda model,r,c:PLoad_chunk[r-1,c-1], within=Reals)
        model.PPV_capacitys=Param(model.T,model.PL,initialize=lambda model,r,c:PPV_capacity_chunk[r-1,c-1], within=Reals)
        model.Cbuys=Param(model.T,initialize=lambda model,r:Cbuy_chunk[r-1], within=Reals)
        model.Csells=Param(model.T,initialize=lambda model,r:Csell_chunk[r-1], within=Reals)
        model.ESSparams=Param(model.ESS1,model.PL,initialize=lambda model,r,c:ESSparam[r-1,c-1], within=Reals)
        

        # Variables
        model.P_ESS_s = Var(model.PL, model.T, within=NonNegativeReals)
        model.P_ESS_ch = Var(model.PL, model.T, within=NonNegativeReals)
        model.P_ESS_dch = Var(model.PL, model.T, within=NonNegativeReals)
        model.I_ESS_ch = Var(model.PL, model.T, within=Binary)
        model.I_ESS_dch = Var(model.PL, model.T, within=Binary)
        model.P_buy = Var(model.PL, model.T, within=NonNegativeReals)
        model.P_sell = Var(model.PL, model.T, within=NonNegativeReals)
        model.P_sell_grid = Var(model.PL, model.T, within=NonNegativeReals)
        model.P_buy_grid = Var(model.PL, model.T, within=NonNegativeReals)
        model.P_peer = Var(model.PL, model.PL, model.T, within=NonNegativeReals)
        model.I_buy= Var(model.PL, model.T, within=Binary)
        model.I_sell = Var(model.PL, model.T, within=Binary)
        
        
        
        
        #    model.P_PV = Var(model.PL, model.T, within=NonNegativeReals)  # PV used for charging battery
        #    model.P_PV_load = Var(model.PL, model.T, within=NonNegativeReals)  # PV used for direct load consumption



        # Constraints
        def SocESS_rule(model, PL, T):
            if T == 1:
                prev_SOC = SOC_end_of_previous_period[PL]
                return model.P_ESS_s[PL, T] == prev_SOC + ΔT * (
                    model.ESSparams[model.ESS1.ord(1), PL] * model.P_ESS_ch[PL, T] - model.P_ESS_dch[PL, T] /
                    model.ESSparams[model.ESS1.ord(1), PL])
            else:
                return model.P_ESS_s[PL, T] == (model.P_ESS_s[PL, T - 1]
                                                + ΔT * (model.ESSparams[model.ESS1.ord(1), PL] * model.P_ESS_ch[PL, T]
                                                        - model.P_ESS_dch[PL, T] / model.ESSparams[model.ESS1.ord(1), PL]))

        model.c_SOC = Constraint(model.PL, model.T, rule=SocESS_rule)



        def CapacitylimitESS1_rule(model, PL, T):
            return model.P_ESS_s[PL, T] <= model.ESSparams[model.ESS1.ord(3), PL]

        model.c92 = Constraint(model.PL, model.T, rule=CapacitylimitESS1_rule)



        def chargeESS1_rule(model, PL, T):
            return model.P_ESS_ch[PL, T] <= model.ESSparams[model.ESS1.ord(2), PL] * model.ESSparams[
                model.ESS1.ord(3), PL] * model.I_ESS_ch[PL, T]

        model.c42 = Constraint(model.PL, model.T, rule=chargeESS1_rule)
        
            
        
        def dischargeESS1_rule(model, PL, T):
            return model.P_ESS_dch[PL, T] <= model.ESSparams[model.ESS1.ord(2), PL] * model.ESSparams[
                model.ESS1.ord(3), PL] * model.I_ESS_dch[PL, T]

        model.c43 = Constraint(model.PL, model.T, rule=dischargeESS1_rule)



        def chargedischargeESS_rule(model, PL, T):
            return model.I_ESS_ch[PL, T] + model.I_ESS_dch[PL, T] <= 1

        model.c44 = Constraint(model.PL, model.T, rule=chargedischargeESS_rule)
        
        # def chargedischargelimit(model,PL):
        
        #         return sum( model.I_ESS_ch[PL,T]+model.I_ESS_dch[PL,T] for T in model.T) <=8
        
        # model.c45=Constraint(model.PL,rule=chargedischargelimit) #  ESS constraints



        def load_balance_rule(model, PL, T):
            return model.PLs[T, PL] + model.P_ESS_ch[PL, T] == model.PPV_capacitys[T, PL] + model.P_buy_grid[PL, T] - \
            model.P_sell_grid[PL, T] + model.P_ESS_dch[PL, T] + sum(
                model.P_peer[PL2, PL, T] - model.P_peer[PL, PL2, T] for PL2 in model.PL if PL2 != PL)

        model.c_balance = Constraint(model.PL, model.T, rule=load_balance_rule)
        
        def peer_flow_origin_rule(model, t):
            total_peer_in = sum(model.P_peer[pl2, pl, t] for pl in model.PL for pl2 in model.PL if pl2 != pl)
            total_peer_out = sum(model.P_peer[pl, pl2, t] for pl in model.PL for pl2 in model.PL if pl2 != pl)
            return total_peer_in == total_peer_out
        model.peer_origin = Constraint(model.T, rule=peer_flow_origin_rule)

        
        
        
        
        
        def peer_transfer_limit_rule(model, PL, T):
            return sum(model.P_peer[PL, PL2, T] for PL2 in model.PL if PL2 != PL) <= np.maximum(0,
                                                                                    model.PPV_capacitys[T, PL] -
                                                                                    model.PLs[T, PL])

        model.c_peer = Constraint(model.PL, model.T, rule=peer_transfer_limit_rule)
        
    #    def PV_utilization(model, PL, T):
    #        return model.P_PV_ESS[PL, T] + model.P_PV_load[PL, T] == model.PPV_capacitys[T, PL]

    #    model.c_PV_utilization = Constraint(model.PL, model.T, rule=PV_utilization)
    #    def chargeESS2(model, PL, T):
    #        return model.P_ESS_ch[PL, T] == model.P_PV_ESS[PL, T]  # Battery charges only from PV

    #    model.c_ESS_PV_only = Constraint(model.PL, model.T, rule=chargeESS2)



        def enforce_battery_soc_limit_rule(model, PL, T):
            return model.P_ESS_s[PL, T]  >= model.ESSparams[model.ESS1.ord(4), PL]

        model.c21 = Constraint(model.PL, model.T, rule=enforce_battery_soc_limit_rule)



        def Pbuy11_rule(model, PL, T):
            return model.P_buy[PL, T] <= 200* model.I_buy[PL, T]

        model.c22 = Constraint(model.PL, model.T, rule=Pbuy11_rule)



        def Psell_balance(model, PL, T):
            return model.P_sell[PL, T] == model.P_sell_grid[PL, T]+sum(model.P_peer[PL, PL2, T] for PL2 in model.PL if PL2 != PL)

        model.psellbalance = Constraint(model.PL, model.T, rule=Psell_balance)


        def Pbuy_balance(model, PL, T):
            return model.P_buy[PL, T] == model.P_buy_grid[PL, T]+sum(model.P_peer[PL2, PL, T] for PL2 in model.PL if PL2 != PL)

        model.pbuybalance = Constraint(model.PL, model.T, rule=Pbuy_balance)



        def Psell11_rule(model, PL, T):
            return model.P_sell[PL, T] <= 100* model.I_sell[PL, T]

        model.c23 = Constraint(model.PL, model.T, rule=Psell11_rule)
        
        
        def Psellbuy(model, PL, T):
            return model.I_sell[PL, T]+model.I_buy[PL, T] <= 1

        model.csellbuy = Constraint(model.PL, model.T, rule=Psellbuy)
        
        
        



        # Objective Function
        def rule_OF(model):
            return sum(
                (model.Cbuys[t] * model.P_buy_grid[PL, t]
                - model.Csells[t] * model.P_sell_grid[PL, t])
                for t in model.T
                for PL in model.PL
            )

        model.Objective = Objective(rule=rule_OF, sense=minimize)
        
    #      model.c_ESS_PV_only.deactivate()
        
        
        

        opt = SolverFactory('gurobi')
        #opt.options['TimeLimit'] = 100000  # Set a time limit of 300 seconds
        #opt.options['MIPGap'] = 0.01    # Set a MIP gap tolerance of 1%
        instance=model.create_instance() 
        # Solve the model

        opt.options['Threads'] = 28       
        opt.options['TimeLimit'] = 60000   # Set a time limit of 600 seconds (10 minutes)
        #    opt.options['MIPGap'] = 0.00005     # Allow 1% optimality gap
        #    opt.options['Heuristics'] = 0.3
        # Solve and measure time
        
        
        

        results = opt.solve(instance)
        results.write()

        total_objective_value += value(instance.Objective)
        
        # Prepare results for DataFrame 
        chunk_results_list = []
        # for t_index, t in enumerate(model.T):
        #     for pl_index, pl in enumerate(model.PL):
        #         chunk_results_list.append({
        #             "DateTime": datetime_chunk[t_index],
        #             "Time_Step": chunk_start_time + t_index + 1,  # Corrected time step
        #             "Prosumer": pl,
        #             "P_buy": value(instance.P_buy[pl, t]),
        #             "P_sell": value(instance.P_sell[pl, t]),
        #             "SOC": value(instance.P_ESS_s[pl, t]),
        #             "P_ESS_ch": value(instance.P_ESS_ch[pl, t]),
        #             "P_ESS_dch": value(instance.P_ESS_dch[pl, t]),
        #             "P_PV": value(instance.PPV_capacitys[t, pl]),
        #             "P_Peer_out": sum(value(instance.P_peer[pl, pl2, t]) for pl2 in model.PL if pl2 != pl),
        #             "P_Peer_in": sum(value(instance.P_peer[pl2, pl, t]) for pl2 in model.PL if pl2 != pl),
        #             "P_Load": value(instance.PLs[t, pl])
        #         })


        for t_index, t in enumerate(model.T): 
            dt = pd.to_datetime(datetime_chunk[t_index])  # Convert to pandas Timestamp

            for pl in model.PL:
                chunk_row = {
                    "DateTime": dt.isoformat(),
                    "Time_Step": str(chunk_start_time + t_index + 1),
                    "Prosumer": str(active_attributes[pl].prosumerId),
                    "P_buy": str(value(instance.P_buy[pl, t])),
                    "P_sell": str(value(instance.P_sell[pl, t])),
                    "SOC": str(value(instance.P_ESS_s[pl, t])),
                    "P_ESS_ch": str(value(instance.P_ESS_ch[pl, t])),
                    "P_ESS_dch": str(value(instance.P_ESS_dch[pl, t])),
                    "P_PV_load": str(value(instance.PPV_capacitys[t, pl])),
                    "P_Peer_out": str(sum(value(instance.P_peer[pl, pl2, t]) for pl2 in model.PL if pl2 != pl)),
                    "P_Peer_in": str(sum(value(instance.P_peer[pl2, pl, t]) for pl2 in model.PL if pl2 != pl)),
                    "P_Load": str(value(instance.PLs[t, pl]))
                }
                chunk_results_list.append(chunk_row)
        
        # Convert chunk results to DataFrame and append
        chunk_results_df = pd.DataFrame(chunk_results_list)
        detailed_results.append(chunk_results_df)
    #%%
        # Update SOC_end_of_previous_period 
        #SOC_end_of_day.update({(PL, day): value(instance.P_ESS_s[PL, Thorizon]) for PL in model.PL})
        SOC_end_of_previous_period.update( {pl: value(instance.P_ESS_s[pl, model.T.last()]) for pl in model.PL})
        print(f"SOC updated at time step: {chunk_end_time}")
        print(SOC_end_of_previous_period)

        
    # Concatenate all chunk results
    detailed_results_df = pd.concat(detailed_results, ignore_index=True)
    detailed_results = detailed_results_df.to_dict(orient="records")


    # Convert results to a DataFrame and save to Excel
    detailed_results_path = r"detailed_results.xlsx"
    detailed_results_df.to_excel(detailed_results_path, index=False)

    #send data do backen using lib requests
    # Dados a enviar
    data = {
        "total_objective_value":  str(total_objective_value),
        "start_date": start_date_str,
        "end_date": end_date_str,
        "communityId": communityId,
        "description": description if description else "No description provided",
        "active_attributes": [attr.dict() for attr in active_attributes],
        "detailed_results": detailed_results
    }

    url = "http://localhost:4000/api/profiles/optimize-results"  

    try:
        response = requests.post(url, json=data)
        print(response.status_code, response.text)
        if response.status_code != 201:
            raise Exception(f"POST request failed with status {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        raise Exception(f"POST request failed with status {response.status_code}: {response.text}")
        
    return {
        "total_objective_value": total_objective_value,
        "detailed_results": detailed_results,
        response: response.status_code,
    }

@app.post("/loadData")
async def optimize_excel(file: UploadFile = File(...)):
    contents = await file.read()
    input_io = BytesIO(contents)

    result = run_optimization(input_io)
    return JSONResponse(content=result)


# Modelo Pydantic para validação
class ActiveAttribute(BaseModel):
    prosumerId: str
    profileLoad: bool
    stateOfCharge: bool
    photovoltaicEnergyLoad: bool

@app.post("/run-optimization")
async def start_optimization(
    file: UploadFile = File(...),
    active_attributes: str = Form(...),
    start_date_str: str = Form(...),
    end_date_str: str = Form(...),
    communityId: Optional[str] = Form(None),
    description: Optional[str] = Form(None)
):
    # Leitura do conteúdo do ficheiro
    file_content = await file.read()
    file_path = BytesIO(file_content)  # pode ser passado para uma função

    # Parse do JSON enviado
    try:
        attributes_raw = json.loads(active_attributes)
        active_attributes_list = [ActiveAttribute(**item) for item in attributes_raw]
    except (json.JSONDecodeError, TypeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Invalid active_attributes JSON: {str(e)}")

    # Debug
    print("🟢 active_attributes:")
    for attr in active_attributes_list:
        print(attr.dict())
    print("📅 start:", start_date_str)
    print("📅 end:", end_date_str)
    print("🏘️ communityId:", communityId)
    print("📝 description:", description)

    try:
        # Pass description as an extra argument to run_optimization
        result = run_optimization(file_path, start_date_str, end_date_str, communityId, active_attributes_list, description)
        # Add description to the result dictionary before returning
        # result["description"] = description if description else "No description provided"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Optimization failed: {str(e)}")

    return {
        "message": "Optimization completed!",
        "result": result
    }

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