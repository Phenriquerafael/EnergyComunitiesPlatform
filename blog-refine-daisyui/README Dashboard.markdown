# Energy Community Dashboard README

This README provides a comprehensive overview of the Energy Community Dashboard, a web application built with React Refine and TypeScript to visualize energy metrics for prosumers and communities in an energy trading network. The dashboard displays key performance indicators (KPIs) and a variety of graphs and plots, organized into two sections: **Specific Community** (insights for individual prosumers) and **All Communities** (aggregated metrics across communities). Each visualization uses mock data, primarily based on the `ProfileDTO` interface for prosumer-specific metrics, and is styled with Tailwind CSS for a responsive, modern interface.

## Dashboard Overview
The Energy Community Dashboard is designed to help users monitor and analyze energy production, consumption, storage, and trading activities within a community of prosumers (entities that both produce and consume energy, e.g., households with solar panels). It provides:
- **KPI Cards**: High-level metrics summarizing total energy load, generation, and trading activity.
- **Tabbed Visualizations**: Detailed graphs and plots for specific prosumer metrics and community-wide trends.
- **Data Source**: Mock data in `src/data/mockData.ts`, with the `ProfileDTO` interface defining prosumer metrics:
  ```typescript
  interface ProfileDTO {
    id?: string;
    prosumerId: string;
    date: string;
    intervalOfTime: string;
    numberOfIntervals: number;
    stateOfCharge: string;
    energyCharge: string;
    energyDischarge: string;
    photovoltaicEnergyLoad: string;
    boughtEnergyAmount: string;
    boughtEnergyPrice?: string;
    soldEnergyAmount: string;
    soldEnergyPrice?: string;
    peerOutputEnergyLoad: string;
    peerOutPrice?: string;
    peerInputEnergyLoad: string;
    peerInPrice?: string;
    profileLoad: string;
  }
  ```
  Additional interfaces (e.g., `ICommunityEnergy`, `IConsumptionDistribution`) support community-level visualizations.

The dashboard is accessible at the `/dashboard` route and uses `recharts` for plotting, `@heroicons/react` for icons, and `dayjs` for date handling.

## Visualizations

### KPI Cards
Displayed at the top of the dashboard, these cards provide a quick overview of key metrics across all prosumers for the current period (e.g., 2025-06-01 to 2025-06-02), with trends compared to a previous period (e.g., 2025-05-30 to 2025-05-31).

1. **Total Profile Load**
   - **Data**: Sum of `ProfileDTO.profileLoad` (kWh) across all prosumers and dates.
   - **Meaning**: Represents the total energy consumed by prosumers, indicating overall demand. Higher values suggest increased energy usage (e.g., 750 kWh total load across three prosumers over two days).
   - **Trend**: Compares current load to the previous period, showing percentage change (e.g., +10% if load increased from 675 kWh).

2. **Photovoltaic Generation**
   - **Data**: Sum of `ProfileDTO.photovoltaicEnergyLoad` (kWh) across all prosumers and dates.
   - **Meaning**: Shows total solar energy generated, reflecting renewable energy production capacity. For example, 325 kWh indicates significant solar output.
   - **Trend**: Indicates whether generation is increasing or decreasing (e.g., -5% if previous period was 342 kWh).

3. **Bought Energy**
   - **Data**: Sum of `ProfileDTO.boughtEnergyAmount` (kWh) across all prosumers and dates.
   - **Meaning**: Measures energy purchased from external sources (e.g., the grid), highlighting reliance on non-renewable sources. A value of 225 kWh suggests moderate grid dependency.
   - **Trend**: Shows changes in grid purchases (e.g., +10% if previous period was 205 kWh).

4. **Sold Energy**
   - **Data**: Sum of `ProfileDTO.soldEnergyAmount` (kWh) across all prosumers and dates.
   - **Meaning**: Quantifies energy sold to external buyers (e.g., the grid), indicating excess production. For example, 90 kWh sold reflects profitable energy export.
   - **Trend**: Reflects changes in sales (e.g., -15% if previous period was 106 kWh).

### Specific Community Visualizations
These graphs, displayed in tabs under the “Specific Community” section, focus on metrics for individual prosumers within a community, using `ProfileDTO` data unless noted.

1. **Battery State of Charge (SoC)**
   - **Graph Type**: Area Chart
   - **Data**: `ProfileDTO.stateOfCharge` (%), aggregated by date across prosumers.
   - **Meaning**: Tracks the average battery charge level over time, indicating storage utilization. Higher SoC (e.g., 80% on 2025-06-01) suggests batteries are well-charged, while lower values indicate discharge. Useful for assessing energy storage health.
   - **Example**: SoC rises from 80% to 85% over two days, showing charging activity.

2. **Charge/Discharge**
   - **Graph Type**: Grouped Bar Chart
   - **Data**: `ProfileDTO.energyCharge` and `ProfileDTO.energyDischarge` (kWh), grouped by date and prosumer.
   - **Meaning**: Compares energy charged into and discharged from batteries for each prosumer, revealing battery cycling patterns. High charge (e.g., 20 kWh for Prosumer 1) vs. low discharge (10 kWh) indicates net energy storage.
   - **Example**: Prosumer 1 charges 20 kWh and discharges 10 kWh on 2025-06-01, while Prosumer 2 charges 15 kWh and discharges 8 kWh.

3. **Storage Efficiency**
   - **Graph Type**: Radar Chart
   - **Data**: `IStorageEfficiency` (e.g., `{ prosumer: "Prosumer 1", efficiency: 85 }`).
   - **Meaning**: Shows battery storage efficiency (%) for each prosumer, with higher values (e.g., 85% for Prosumer 1) indicating better energy retention. Useful for comparing battery performance across prosumers.
   - **Example**: Prosumer 1 (85%) outperforms Prosumer 2 (78%), suggesting better storage technology.

4. **Generation vs Consumption**
   - **Graph Type**: Stacked Area Chart
   - **Data**: `ProfileDTO.photovoltaicEnergyLoad` (generation) and `ProfileDTO.profileLoad` (consumption, kWh), summed by date across prosumers.
   - **Meaning**: Illustrates the balance between solar energy produced and energy consumed, highlighting self-sufficiency. A larger generation area vs. consumption (e.g., 325 kWh generated vs. 750 kWh consumed) indicates reliance on external energy.
   - **Example**: On 2025-06-01, generation is 150 kWh, and consumption is 330 kWh, showing a consumption-heavy day.

5. **Profile Load**
   - **Graph Type**: Area Chart
   - **Data**: `ProfileDTO.profileLoad` (kWh), aggregated by date across prosumers.
   - **Meaning**: Displays total energy consumption over time, reflecting demand trends. Rising loads (e.g., from 330 kWh to 420 kWh) may indicate increased activity or seasonal changes.
   - **Example**: Total load increases from 330 kWh on 2025-06-01 to 420 kWh on 2025-06-02.

6. **P2P Energy Flows**
   - **Graph Type**: Sankey Diagram (Simplified)
   - **Data**: `ProfileDTO.peerOutputEnergyLoad` (kWh), with flows from each prosumer to a generic “Other Prosumer” target.
   - **Meaning**: Visualizes peer-to-peer energy trading within the community, with line thickness proportional to energy transferred. For example, 10 kWh from Prosumer 1 indicates active P2P sharing. Helps understand internal energy exchange dynamics.
   - **Example**: Prosumer 1 outputs 10 kWh, and Prosumer 2 outputs 5 kWh on 2025-06-01 to other prosumers.
   - **Note**: Simplified due to lack of explicit target prosumer IDs in `ProfileDTO`. A full Sankey requires source-target data.

7. **P2P Price**
   - **Graph Type**: Area Chart
   - **Data**: `ProfileDTO.peerOutPrice` ($/kWh), aggregated by date across prosumers.
   - **Meaning**: Tracks the price of energy sold in P2P transactions, reflecting market dynamics. Rising prices (e.g., from $0.13 to $0.14/kWh) suggest increasing demand or reduced supply.
   - **Example**: P2P price increases from $0.13/kWh on 2025-06-01 to $0.14/kWh on 2025-06-02.

8. **Bought vs Sold**
   - **Graph Type**: Bar Chart
   - **Data**: `ProfileDTO.boughtEnergyAmount` (kWh), aggregated by date across prosumers.
   - **Meaning**: Shows energy purchased from external sources (e.g., grid), indicating reliance on non-community energy. High values (e.g., 90 kWh bought) suggest insufficient local generation. Note: Only bought energy is shown; sold energy (`soldEnergyAmount`) could be added for comparison.
   - **Example**: 90 kWh bought on 2025-06-01, increasing to 135 kWh on 2025-06-02.

### All Communities Visualizations
These graphs, displayed in tabs under the “All Communities” section, provide aggregated insights across multiple energy communities, using custom mock data.

1. **Total Energy Generated**
   - **Graph Type**: Horizontal Bar Chart
   - **Data**: `ICommunityEnergy.generated` (kWh, e.g., `{ community: "Community A", generated: 500 }`).
   - **Meaning**: Compares total energy produced across communities, highlighting generation capacity. Higher values (e.g., 500 kWh for Community A) indicate stronger renewable energy infrastructure.
   - **Example**: Community A generates 500 kWh, while Community B generates 400 kWh.

2. **Total Energy Traded**
   - **Graph Type**: Horizontal Bar Chart
   - **Data**: `ICommunityEnergy.traded` (kWh).
   - **Meaning**: Measures energy traded (bought/sold) across communities, reflecting market activity. High traded volumes (e.g., 250 kWh for Community C) suggest active energy exchange.
   - **Example**: Community C trades 250 kWh, while Community B trades 150 kWh.

3. **Consumption Distribution**
   - **Graph Type**: Histogram
   - **Data**: `IConsumptionDistribution` (e.g., `{ intervals: "0-5", count: 10 }`).
   - **Meaning**: Shows the distribution of consumption intervals (e.g., number of intervals with 0-5 kWh usage), revealing consumption patterns. A peak at 10-15 kWh (20 intervals) indicates common usage levels.
   - **Example**: 15 intervals in the 5-10 kWh range, 20 in the 10-15 kWh range.

4. **Profile Clustering**
   - **Graph Type**: Scatter Plot
   - **Data**: `IProfileCluster` (e.g., `{ prosumer: "Prosumer 1", x: 1.2, y: 2.5 }`).
   - **Meaning**: Visualizes prosumer energy profiles in a 2D space (e.g., PCA/t-SNE results), grouping similar consumption/generation behaviors. Close points (e.g., Prosumer 1 at (1.2, 2.5) and Prosumer 2 at (1.8, 1.9)) indicate similar profiles.
   - **Example**: Prosumer 1 and Prosumer 2 cluster closely, suggesting similar energy usage patterns.

