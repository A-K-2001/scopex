const express = require("express");
const app = express();
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const Plotly = require('plotly');
const moment = require('moment');
const { CandleStickChart, mkAccCandleStick } = require('candlestick-chart');

const server = require('http').createServer(app);

const cors = require("cors");
const Transfer = require("./models/Transfer");
const User = require("./models/User");

dotenv.config();
app.use(cors())


mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URL ,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    .then(() => console.log("DBconnection successful"))
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());

app.get("/api/test",()=>{
    console.log("test yes");
});    



app.get('/:id',async (req, res) => {
      try {
        const transfers = await Transfer.find({ user_id: req.params.id })
        const filteredTransfers =  transfers.filter(t => !t.is_deleted);
        
        const total_transfers= transfers.length;
        const success_rate=transfers.filter(transfer => transfer.is_completed && transfer.money_recieved).length / transfers.length * 100;
   
        const totalSent =  filteredTransfers.reduce((acc, t) => acc + t.sent_amount, 0);
        const totalReceived = filteredTransfers.reduce((acc, t) => acc + t.recieved_amount, 0);

       
        const completedTransfers =  filteredTransfers.filter(t => t.is_completed).length;
        const incompletedTransfers =  filteredTransfers.length - completedTransfers;

 
        const groupedByMonth =  filteredTransfers.reduce((acc, t) => {
            const month = moment(t.date_of_transfer).format('MMMM YYYY');
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(t);
            return acc;
        }, {});

        const transactionsPerMonth =  Object.entries(groupedByMonth).map(([month, transfers]) => ({
            month,
            numTransactions: transfers.length,
            total_sent_amount: transfers.reduce((total, transfer) => total + transfer.sent_amount, 0),
            total_recieved_amount: transfers.reduce((total, transfer) => total + transfer.recieved_amount, 0),
            completed_transfers: transfers.filter(transfer => transfer.is_completed).length,
            success_rate: transfers.filter(transfer => transfer.is_completed && transfer.money_recieved).length / transfers.length * 100

        }));
       const summary={
          total_transfers,
          totalSent,
          totalReceived,
          completedTransfers,
          incompletedTransfers,
          // groupedByMonth,
          success_rate
       }
        return res.json({
            success: true,
            summary,
            transactionsPerMonth
        })
      }catch (error) {
        console.log(error);
        res.json({ error, success: false })
      }
    }
  );




server.listen(process.env.PORT || 5000, () => {
    console.log("backend server at 5000");
})