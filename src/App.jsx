
import React, { useState, useEffect } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Cleanup WebSocket connection when the component unmounts
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const connectWebSocket = () => {
    if (!apiKey) {
      alert("Please enter an API key");
      return;
    }

    const socket = new WebSocket("ws://technest.ddns.net:8001/ws");
    setWs(socket);

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send(apiKey);
    };

    socket.onmessage = (event) => {
      try {
        const jsonData = JSON.parse(event.data); // Assuming data is JSON

        const newDataPoint = {
          time: new Date().toLocaleTimeString(),
          power: jsonData["Energy Consumption"].Power,
          voltageL1: jsonData["Voltage"]["L1-GND"],
          voltageL2: jsonData["Voltage"]["L2-GND"],
          voltageL3: jsonData["Voltage"]["L3-GND"],
          pressure: jsonData.Pressure,
          force: jsonData.Force,
          cycleCount: jsonData["Cycle Count"],
          punchPosition: jsonData["Position of the Punch"],
        };

        // Optionally, limit the number of data points or perform any other filtering
        setData((prevData) => [...prevData, newDataPoint].slice(-50)); // Keeping the last 50 data points
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ws) ws.close();
    connectWebSocket();
  };

  return (
    <div className="main">
      <h1
        style={{
          marginLeft: "10px",
          fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif", // Corrected font-family
        }}
      >
        WebSocket Recharts Dashboard
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "20px", marginLeft: "20px" }}
      >
        <label>API Key:</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          autoComplete="off"
          style={{
            color: "antiquewhite",
            padding: "8px",
            marginRight: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }} // Added more styling
        />
        <button
          type="submit"
          style={{
            color: "antiquewhite",
            backgroundColor: "#4CAF50",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Connect
        </button>
      </form>

      {/* Container for LineCharts */}
      
        <LineChart width={1000} height={500} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[180, 280]} allowDataOverflow={true} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="voltageL1"
            stroke="#82ca9d"
            name="Voltage L1-GND"
          />
          <Line
            type="monotone"
            dataKey="voltageL2"
            stroke="#ffc658"
            name="Voltage L2-GND"
          />
          <Line
            type="monotone"
            dataKey="voltageL3"
            stroke="#ff7300"
            name="Voltage L3-GND"
          />
        </LineChart>
     

      
        <LineChart width={1000} height={600} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 200]} allowDataOverflow={true} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="power" stroke="#8884d8" name="Power" />
        </LineChart>
      

      
        <LineChart width={1000} height={600} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} allowDataOverflow={true} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pressure"
            stroke="#d0ed57"
            name="Pressure"
          />
        </LineChart>
      


        <LineChart width={1000} height={600} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} allowDataOverflow={true} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="force" stroke="#a4de6c" name="Force" />
        </LineChart>


        <LineChart width={1000} height={600} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[9250, 10000]} allowDataOverflow={true} />
          <Tooltip />
          <Legend />
         <Line
          type="monotone"
          dataKey="cycleCount"
          stroke="#8884d8"
          name="Cycle Count"
        />  
        </LineChart>


        <LineChart width={1000} height={600} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 200]} allowDataOverflow={true} />
          <Tooltip />
          <Legend />
          <Line
          type="monotone"
          dataKey="punchPosition"
          stroke="#82ca9d"
          name="Position of the Punch"
        />
        </LineChart>
      
    </div>
  );
}

export default App;
