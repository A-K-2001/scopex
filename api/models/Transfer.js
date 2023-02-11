
const mongoose = require("mongoose");

const transferSchema = mongoose.Schema({
  is_deleted: Boolean,
  money_recieved: Boolean,
  is_completed: Boolean,
  date_of_transfer: Date,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sent_amount: Number,
  recieved_amount: Number,
  src_currency: String,
  dest_currency: String,
  rate: Number,
  fee: Number,
  comments: String,
  deposit_code: String,
  user_deposit_confirmed: Boolean,
  transfer_type: String,
  recipient_name: String,
  recipient_nick_name: String,
})

module.exports  = mongoose.model('Transfer', transferSchema);
