
import './App.css';
import axios from "axios";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { LineChart, Line } from 'recharts';



import { useEffect, useState } from 'react';


function App() {
  // task 1
  const [data, setdata] = useState([]);
  const [summary, setsummary] = useState()


  useEffect(() => {
    const getdata = async ()=>{
  
  
      try{
        const res = await axios.get("http://127.0.0.1:5000/62d816b45b18513178b683c8");
        // console.log(res.data.transactionsPerMonth);
        setdata(res.data.transactionsPerMonth);
        setsummary(res.data.summary);
        // console.log(summary);
        
      }catch(err){
        // console.log(err);
      }
    }
    
    getdata();
  
    
  }, [])

  // task 2
  // const symbols = ['LTCUSDT', 'ETHUSDT'];

  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'LTCUSDT', 'EOSUSDT', 'BCHUSDT', 'BSVUSDT', 'ADAUSDT', 'DOTUSDT'];
  const interval = '1h';
  const limit = 40;


  const [priceData, setPriceData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      for (const symbol of symbols) {
        const url =`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        try{
          const response = await axios.get(url);
          const data = response.data.map(item => ({
            time: item[0],
            open: item[1],
            high: item[2],
            low: item[3],
            close: item[4],
            volume: item[5],
          }));
          var newprice = priceData;
          // newprice[symbol]=data;
          newprice.push(data);
          setPriceData(newprice);
          console.log(newprice);

        }catch(err){
          console.log(err);
        }
      
      }
    };

    fetchData();
    // console.log(priceData);
  }, []);
  

  
  return (
    <div className="App">
    <h1>Task 1</h1>
    <h2>number of transfer per month</h2>
    <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="numTransactions" fill="#8884d8" />
         

      </BarChart>
      <h2>Amount of transfer per month</h2>
      <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_recieved_amount" fill="#8884d8" />
          <Bar dataKey="total_sent_amount" fill="#82ca9d" />
        </BarChart>
        <h1>Task 2</h1>
        {priceData.map((item,index)=>(
          <div key={index}>
          <h2>{symbols[index]}</h2>
          <LineChart
          width={500}
          height={300}
          data={item}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="close" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="open" stroke="#82ca9d" />
        </LineChart>
        </div>
        
        ))}

        
    </div>
  );
}

export default App;
