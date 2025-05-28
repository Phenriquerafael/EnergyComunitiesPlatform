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

# Load data
file_path = r"D:\My Projects\Satcomm project\sampledata3.xlsx"
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
start_date_str = '01.01.2024 00:00:00'
end_date_str = '10.02.2024 23:45:00'



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
update_interval = 28800 # Update SOC every 288 time steps

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

        chunk_row = {
            "DateTime": dt,
            #"Date": dt.date(),  
            "Time_Step": chunk_start_time + t_index + 1,
        }
    
        for pl in model.PL:
            chunk_row[f"model.P_buy_grid[{pl}]"] = value(instance.P_buy_grid[pl, t])
            chunk_row[f"model.P_sell_grid[{pl}]"] = value(instance.P_sell_grid[pl, t])
            chunk_row[f"SOC[{pl}]"] = value(instance.P_ESS_s[pl, t])
            chunk_row[f"P_ESS_ch[{pl}]"] = value(instance.P_ESS_ch[pl, t])
            chunk_row[f"P_ESS_dch[{pl}]"] = value(instance.P_ESS_dch[pl, t])
            chunk_row[f"P_PV[{pl}]"] = value(instance.PPV_capacitys[t, pl])
            chunk_row[f"P_Peer_out[{pl}]"] = sum(value(instance.P_peer[pl, pl2, t]) for pl2 in model.PL if pl2 != pl)
            chunk_row[f"P_Peer_in[{pl}]"] = sum(value(instance.P_peer[pl2, pl, t]) for pl2 in model.PL if pl2 != pl)
            chunk_row[f"P_Load[{pl}]"] = value(instance.PLs[t, pl])
    
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

# Convert results to a DataFrame and save to Excel
detailed_results_path = r"detailed_results.xlsx"
detailed_results_df.to_excel(detailed_results_path, index=False)

print(f"Detailed results for the period saved to: {detailed_results_path}")
print(f"Overall objective function value for the period: {total_objective_value:.2f}")




 
"""
P_buy_values = {(PL, T): value(instance.P_buy[PL, T]) for PL in instance.PL for T in instance.T}
P_sell_values = {(PL, T): value(instance.P_sell[PL, T]) for PL in instance.PL for T in instance.T}
P_peer_values = {(PL, PL1, T): value(instance.P_peer[PL, PL1, T]) for PL in instance.PL for PL1 in instance.PL for T in instance.T}
P_dch_values = {(PL, T): value(instance.P_ESS_dch[PL, T]) for PL in instance.PL for T in instance.T}
# Print values   model.P_ESS_dch[PL, T]
print("P_buy values:")
for (PL, T), val in P_buy_values.items():
    print(f"Prosumer {PL}, Hour {T}: {val}")

print("\nP_sell values:")
for (PL, T), val in P_sell_values.items():
    print(f"Prosumer {PL}, Hour {T}: {val}")




import matplotlib.pyplot as plt

# Convert extracted values to a DataFrame for easier visualization
df_buy = pd.DataFrame(P_buy_values.values(), index=P_buy_values.keys(), columns=["P_buy"])
df_sell = pd.DataFrame(P_sell_values.values(), index=P_sell_values.keys(), columns=["P_sell"])
df_dch = pd.DataFrame(P_dch_values.values(), index=P_dch_values.keys(), columns=["P_ESS_dch"])

# Plot Power Buying and Selling Trends for a Specific Prosumer
prosumer_id = 1  # Change this to analyze different prosumers

plt.figure(figsize=(12, 6))
plt.plot(df_buy.xs(prosumer_id, level=0), label="Power Bought", marker="o")
plt.plot(df_sell.xs(prosumer_id, level=0), label="Power Sold", marker="s")
plt.plot(df_dch.xs(prosumer_id, level=0), label="Battery Discharge", marker="^")

plt.xlabel("Time (hours)")
plt.ylabel("Power (kW)")
plt.title(f"Power Transactions for Prosumer {prosumer_id}")
plt.legend()
plt.grid()
plt.show()


P_ESS_s_values = {(PL, T): value(instance.P_ESS_s[PL, T]) for PL in instance.PL for T in instance.T}
df_soc = pd.DataFrame(P_ESS_s_values.values(), index=P_ESS_s_values.keys(), columns=["SOC"])

plt.figure(figsize=(12, 6))
plt.plot(df_soc.xs(prosumer_id, level=0), label="Battery SOC", color="purple", marker="d")

plt.xlabel("Time (hours)")
plt.ylabel("State of Charge (kWh)")
plt.title(f"Battery State of Charge for Prosumer {prosumer_id}")
plt.legend()
plt.grid()
plt.show()


import seaborn as sns

# Convert P_peer_values into a DataFrame
df_peer = pd.DataFrame(P_peer_values.values(), index=P_peer_values.keys(), columns=["P_peer"])
df_peer = df_peer.unstack(level=1).fillna(0)  # Reshape for heatmap

plt.figure(figsize=(10, 8))
sns.heatmap(df_peer["P_peer"].T, cmap="coolwarm", annot=True, fmt=".2f")
plt.xlabel("Receiving Prosumer")
plt.ylabel("Sending Prosumer")
plt.title("Peer-to-Peer Energy Exchange Heatmap")
plt.show()




# Compute costs and revenues
costs = {t: instance.Cbuys[t] * sum(value(instance.P_buy[PL, t]) for PL in instance.PL) for t in instance.T}
revenues = {t: instance.Csells[t] * sum(value(instance.P_sell[PL, t]) for PL in instance.PL) for t in instance.T}

# Convert to DataFrame
df_cost = pd.DataFrame({"Cost": costs, "Revenue": revenues})

plt.figure(figsize=(12, 6))
plt.plot(df_cost["Cost"], label="Energy Cost", color="red", linestyle="--", marker="o")
plt.plot(df_cost["Revenue"], label="Energy Revenue", color="green", linestyle=":", marker="s")

plt.xlabel("Time (hours)")
plt.ylabel("Cost / Revenue ($)")
plt.title("Energy Cost vs Revenue Over Time")
plt.legend()
plt.grid()
plt.show()
"""