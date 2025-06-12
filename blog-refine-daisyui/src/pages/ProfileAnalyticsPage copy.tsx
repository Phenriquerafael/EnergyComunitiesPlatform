import React, { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions, Select, DatePicker } from "antd";
import { Line } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { IProsumerDataDTO, ProfileDTO } from "../interfaces";
import { format, startOfHour, startOfDay, parse, isValid, isWithinInterval, } from "date-fns";
import type { RangePickerProps } from "antd/es/date-picker";
import { simulations } from "../components/dashboard/mockEnergyData";
import { Pie } from "@ant-design/plots";
import { Checkbox } from "antd";
const { RangePicker } = DatePicker;

export const ProfileAnalyticsPage = () => {
  const [selectedProsumer, setSelectedProsumer] = useState<IProsumerDataDTO | undefined>(undefined);
  const [profiles, setProfiles] = useState<ProfileDTO[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileDTO[]>([]);
  const [timeResolution, setTimeResolution] = useState<"15min" | "1h" | "1d">("15min");
  const [dateRange, setDateRange] = useState<RangePickerProps['value']>([null, null]);
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);




  const [selectedSimulation, setSelectedSimulation] = useState(simulations[0]);
  
  const simulationOptions = simulations.map((sim, index) => ({
    label: sim.description,
    value: index,
  }));
  

  const { data: prosumerData, isLoading: isProsumersLoading } = useList<IProsumerDataDTO>({
    resource: "prosumers/all2",
  });

  const prosumers = prosumerData?.data ?? [];

  const { data: profileData, isLoading: isProfilesLoading } = useList<ProfileDTO>({
    resource: selectedProsumer?.id ? `profiles/prosumer/${selectedProsumer.id}` : "",
    queryOptions: {
      enabled: !!selectedProsumer?.id,
    },
  });

  useEffect(() => {
    if (Array.isArray(profileData?.data)) {
      // console.log("Dados de profileData recebidos:", profileData.data);
      setProfiles(profileData.data);

      // Determina as datas mínima e máxima
      const dates = profileData.data
        .map((p) => parseDate(p.date))
        .filter((d) => isValid(d));
      if (dates.length > 0) {
        setMinDate(new Date(Math.min(...dates.map((d) => d.getTime()))));
        setMaxDate(new Date(Math.max(...dates.map((d) => d.getTime()))));
      } else {
        setMinDate(null);
        setMaxDate(null);
      }
    } else {
      // console.log("profileData.data não é um array ou está vazio:", profileData?.data);
      setProfiles([]);
      setMinDate(null);
      setMaxDate(null);
    }
  }, [profileData]);

  // Filtra os profiles com base no intervalo de datas selecionado
  useEffect(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      setFilteredProfiles(profiles);
      return;
    }

    const start = startOfDay(dateRange[0] ? dateRange[0].toDate() : undefined as any);
    const end = new Date(startOfDay(dateRange[1]?.toDate() as any));
    end.setHours(23, 59, 59, 999);
    console.log("Filtrando profiles entre:", start, "e", end);


    const filtered = profiles.filter((profile) => {
      if (!profile.date) return false;
      try {
        const parsedDate = parseDate(profile.date);
        if (!isValid(parsedDate)) return false;
        return isWithinInterval(parsedDate, { start, end });
      } catch (error) {
        // console.warn("Erro ao parsear data para filtro:", profile.date, error);
        return false;
      }
    });

    // console.log("Profiles filtrados por intervalo de datas:", filtered);
    setFilteredProfiles(filtered);
  }, [profiles, dateRange]);

  const parseDate = (date: string): Date => {
    let parsedDate: Date;
    try {
      parsedDate = new Date(date);
      if (!isValid(parsedDate)) {
        parsedDate = parse(date, "yyyy-MM-dd HH:mm:ss", new Date());
      }
      if (!isValid(parsedDate)) {
        parsedDate = parse(date, "yyyy-MM-dd HH:mm", new Date());
      }
    } catch (error) {
      throw new Error("Erro ao parsear data");
    }
    if (!isValid(parsedDate)) {
      throw new Error("Data inválida");
    }
    return parsedDate;
  };



const formatDateByResolution = (date: string, includeDate:boolean=false) => {
  let parsedDate: Date;
  try {
    parsedDate = parseDate(date);
  } catch {
    return "Invalid Date";
  }

  if (timeResolution === "1d") {
    return format(startOfDay(parsedDate), "yyyy-MM-dd"); // Agrupa por dia
  } else if (timeResolution === "1h") {
    return format(startOfHour(parsedDate), "yyyy-MM-dd HH:00"); // Agrupa por hora
  }

  const time = format(parsedDate, "HH:mm");
  const day = format(parsedDate, "yyyy-MM-dd");
  return includeDate ? `${day} ${time}` : time;
};




const groupProfilesByTime = (profiles: ProfileDTO[]) => {
  const grouped: Record<string, ProfileDTO[]> = {};
  let lastDay = "";

  for (const profile of profiles) {
    if (!profile.date) continue;

    const parsedDate = parseDate(profile.date);
    const currentDay = format(parsedDate, "yyyy-MM-dd");

    const includeDate = currentDay !== lastDay;
    const key = formatDateByResolution(profile.date, includeDate);
    lastDay = currentDay;

    if (key === "Invalid Date") continue;

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(profile);
  }

  return grouped;
};


  const generateChartData = () => {
    const grouped = groupProfilesByTime(filteredProfiles);

    const result: {
      time: string;
      type: string;
      value: number;
    }[] = [];

    Object.entries(grouped).forEach(([time, group]) => {
      const average = (key: keyof ProfileDTO) => {
        const values = group
          .map((p) => {
            const value = p[key];
            return value != null ? parseFloat(String(value)) : 0;
          })
          .filter((v) => !isNaN(v));
        return values.length > 0 ? values.reduce((acc, val) => acc + val, 0) / values.length : 0;
      };

      result.push(
        { time, type: "State of Charge", value: average("stateOfCharge") },
        { time, type: "Energy Charge", value: average("energyCharge") },
        { time, type: "Energy Discharge", value: average("energyDischarge") },
        { time, type: "Photovoltaic Energy Load", value: average("photovoltaicEnergyLoad") },
        { time, type: "Bought Energy", value: average("boughtEnergyAmount") },
        { time, type: "Sold Energy", value: average("soldEnergyAmount") },
        { time, type: "Peer Output Energy Load", value: average("peerOutputEnergyLoad") },
        { time, type: "Peer Input Energy Load", value: average("peerInputEnergyLoad") },
        { time, type: "Profile Load", value: average("profileLoad") },
      );
    });

    // console.log("Dados do gráfico (chartData):", result);
    return result;
  };

  const calculateAverage = (key: keyof ProfileDTO): string => {
    const numericValues = filteredProfiles
      .map((p) => {
        const value = p[key];
        return value != null ? parseFloat(String(value)) : 0;
      })
      .filter((v) => !isNaN(v));
    const avg = numericValues.length > 0
      ? numericValues.reduce((acc, val) => acc + val, 0) / numericValues.length
      : 0;
    return avg.toFixed(2);
  };

  const averageFields = [
    { label: "State of Charge", key: "stateOfCharge" },
    { label: "Energy Charged", key: "energyCharge" },
    { label: "Energy Discharged", key: "energyDischarge" },
    { label: "PV Energy Load", key: "photovoltaicEnergyLoad" },
    { label: "Energy Bought", key: "boughtEnergyAmount" },
    { label: "Energy Sold", key: "soldEnergyAmount" },
    { label: "Peer Output Load", key: "peerOutputEnergyLoad" },
    { label: "Peer Input Load", key: "peerInputEnergyLoad" },
    { label: "Profile Load", key: "profileLoad" },
  ];

  const chartData = generateChartData();

  const chartConfig = {
    data: chartData,
    xField: "time",
    yField: "value",
    seriesField: "type",
    renderer: "svg" as const,
    xAxis: {
      title: { text: `Time (${timeResolution})` },
      label: { rotate: 45 },
    },
    yAxis: { 
      title: { text: "Value (kWh)" },
    },
    tooltip: {
      fields: ["time", "type", "value"],
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${datum.value.toFixed(2)} kWh`,
      }),
    },
  };

  const prosumerProfile = filteredProfiles.length > 0 ? filteredProfiles[0] : null;

  const formatDateAndTimeSeparately = (date: string) => {
    try {
      const parsedDate = parseDate(date);
      return {
        day: format(parsedDate, "yyyy-MM-dd"),
        time: format(parsedDate, "HH:mm"),
      };
    } catch (error) {
      // console.warn("Erro ao formatar data/hora:", date, error);
      return { day: "Invalid Date", time: "Invalid Time" };
    }
  };

  // Restringe as datas selecionáveis no RangePicker
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    if (!minDate || !maxDate) return true; // Desabilita tudo se não houver dados
    return (
      current &&
      (current.toDate() < startOfDay(minDate) || current.toDate() > startOfDay(maxDate))
    );
  };

    const [selectedPieFields, setSelectedPieFields] = useState<string[]>(
    averageFields.map((f) => f.key) // default: todos selecionados
  );

  const generatePieChartData = () => {
    return averageFields
      .filter((f) => selectedPieFields.includes(f.key))
      .map((f) => {
        const total = filteredProfiles.reduce((sum, profile) => {
          const value = profile[f.key as keyof ProfileDTO];
          return sum + (value ? Number(value) : 0);
        }, 0);
        return { type: f.label, value: Number(total.toFixed(2)) };
      });
  };

  const pieConfig = {
    data: generatePieChartData(),
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.4,
    label: {
      type: "spider",
      labelHeight: 28,
      content: "{name}\n{value} kWh",
    },
    interactions: [{ type: "element-active" }],
  };

  const handlePieFieldChange = (checkedValues: any) => {
  setSelectedPieFields(checkedValues);
};


  return (
    
    <Card title="Profile Analytics">
        <div className="mb-6">
            <div>
              <label className="block text-md font-medium mb-2">Select Simulation</label>
              <Select
              className="w-full md:w-1/2"
              placeholder="Choose a simulation"
              options={simulationOptions.map((option, idx) => ({
                ...option,
                label:
                selectedSimulation === simulations[idx]
                  ? simulations[idx].description
                  : (
                  <div>
                    <div>{simulations[idx].description}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                    {simulations[idx].startDate} - {simulations[idx].endDate}
                    </div>
                  </div>
                  ),
              }))}
              value={simulations.indexOf(selectedSimulation)}
              onChange={(value) => setSelectedSimulation(simulations[value])}
              />
            </div>

          <p className="text-sm text-gray-500 mt-2">
            Selected period: {selectedSimulation.startDate} to {selectedSimulation.endDate}
          </p>
        </div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Select
            placeholder="Select a prosumer"
            style={{ width: "100%" }}
            loading={isProsumersLoading}
            onChange={(id) => setSelectedProsumer(prosumers.find((p) => p.id === id))}
            optionLabelProp="label"
            options={prosumers.map((p) => ({
              value: p.id,
              label: `${p.userName ?? `Prosumer ${p.id}`}${p.email ? ` - Email: ${p.email}` : ''}${p.batteryName ? ` - Battery: ${p.batteryName}` : ''}${p.communityName ? ` - Community: ${p.communityName}` : ''}`,
              render: () => (
                <div style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
                  <strong>{p.userName ?? `Prosumer ${p.id}`}</strong>
                  <div style={{ color: "#666", fontSize: 12 }}>
                    {p.email && <span>Email: {p.email}</span>}
                    {p.batteryName && <span> | Battery: {p.batteryName}</span>}
                    {p.communityName && <span> | Community: {p.communityName}</span>}
                  </div>
                </div>
              ),
            }))}
          />
        </Col>

        <Col span={8}>
          <Select
            value={timeResolution}
            onChange={(value) => setTimeResolution(value)}
            options={[
              { label: "15 Minutes", value: "15min" },
              { label: "1 Hour", value: "1h" },
              { label: "1 Day", value: "1d" },
            ]}
            style={{ width: "100%" }}
          />
        </Col>

        <Col span={8}>
          <RangePicker
            style={{ width: "100%" }}
            onChange={(dates) => setDateRange(dates)}
            format="YYYY-MM-DD"
            disabledDate={disabledDate}
            placeholder={["Start Date", "End Date"]}
            value={dateRange}
          />
        </Col>
      </Row>

      {isProfilesLoading ? (
        <p>Loading profiles...</p>
      ) : filteredProfiles.length === 0 ? (
        <p>No profiles available for this prosumer or date range.</p>
      ) : (
        <>
          <Row gutter={16}>
            <Col span={24}>
              <Card title={`Time Series (${timeResolution})`}>
                {chartData.length === 0 ? (
                  <p>No data available for the selected time resolution.</p>
                ) : (
                  <Line {...chartConfig} height={400} />
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 20 }}>
            
          <Col span={24}>
            <Card title="Energy Distribution (Total kWh)">
              <Checkbox.Group
                options={averageFields.map((f) => ({
                  label: f.label,
                  value: f.key,
                }))}
                value={selectedPieFields}
                onChange={handlePieFieldChange}
                style={{ marginBottom: 16 }}
              />
              {generatePieChartData().length === 0 ? (
                <p>No data available for the selected fields.</p>
              ) : (
                <Pie {...pieConfig} height={400} />
              )}
            </Card>
          </Col>
        </Row>


          {prosumerProfile && (
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col span={24}>
                <Card title={`Prosumer ${selectedProsumer?.userName ?? selectedProsumer?.id} – Profile Average Details`}>
                  <Descriptions column={2}>
                    <Descriptions.Item label="Prosumer ID">{prosumerProfile.prosumerId}</Descriptions.Item>
                    {averageFields.map((field) => (
                      <Descriptions.Item key={field.key} label={field.label}>
                        {calculateAverage(field.key as keyof ProfileDTO)} kWh
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </Card>
  );
};