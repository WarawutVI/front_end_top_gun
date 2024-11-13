import React, { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [ws, setWs] = useState(null);

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://technest.ddns.net:8001/ws");
    setWs(socket);

    socket.onopen = () => {
      socket.send(apiKey);
    };

    socket.onmessage = (event) => {
        
      const jsonData = JSON.parse(event.data); // สมมติว่า data เป็น JSON

      // เพิ่มข้อมูลใหม่เข้าใน data state โดยใช้ format เดียวกับ Recharts
      const newDataPoint = {
        time: new Date().toLocaleTimeString(), // เวลาที่ได้รับข้อมูล
        power: jsonData["Energy Consumption"].Power,
        voltageL1: jsonData["Voltage"]["L1-GND"],
        voltageL2: jsonData["Voltage"]["L2-GND"],
        voltageL3: jsonData["Voltage"]["L3-GND"],
        pressure: jsonData.Pressure,
        force: jsonData.Force,
        cycleCount: jsonData["Cycle Count"],
        punchPosition: jsonData["Position of the Punch"],
      };
      setData((prevData) => [...prevData, newDataPoint]);
    };

    socket.onclose = () => console.log("WebSocket disconnected");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ws) ws.close();
    connectWebSocket();
  };

  return (
    <div>
     

      <LineChart width={1000} height={600} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis domain={[0, 250]} allowDataOverflow={true} />
        <Tooltip />
        <Legend />

        {/* Lines for each data point */}
        <Line type="monotone" dataKey="power" stroke="#8884d8" name="Power" />

      </LineChart>
    </div>
  );
}

export default App;