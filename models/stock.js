const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  stock: { type: String, required: true },
  likes: { type: Number, default: 0 },
  ips: [{ type: String }]
});

module.exports = mongoose.model("stock", StockSchema);