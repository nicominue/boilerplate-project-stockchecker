"use strict";

const Stock = require("../models/stock");
const fetch = require("node-fetch");
const crypto = require("crypto");

module.exports = function (app) {


  function anonymizeIP(ip) {
    return crypto.createHash("sha256").update(ip).digest("hex");
  }


  async function getStockPrice(symbol) {
    const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;

    const res = await fetch(url);
    const data = await res.json();

    return data.latestPrice;
  }

  app.get("/api/stock-prices", async (req, res) => {
    try {
      let { stock, like } = req.query;
      if (!stock) return res.json({ error: "stock required" });

      const likeFlag = like === "true" || like === "1";

      const stocks = Array.isArray(stock) ? stock : [stock];

      const results = [];

      for (let symbol of stocks) {
        symbol = symbol.toUpperCase();

        let record = await Stock.findOne({ stock: symbol });

        if (!record) {
          record = new Stock({ stock: symbol, likes: 0, ips: [] });
        }

        if (likeFlag) {
          const userIP = anonymizeIP(req.ip);

          if (!record.ips.includes(userIP)) {
            record.likes++;
            record.ips.push(userIP);
          }
        }

        await record.save();

        const price = await getStockPrice(symbol);

        results.push({
          stock: symbol,
          price,
          likes: record.likes
        });
      }

      if (results.length === 2) {
        const diff = results[0].likes - results[1].likes;

        return res.json({
          stockData: [
            { stock: results[0].stock, price: results[0].price, rel_likes: diff },
            { stock: results[1].stock, price: results[1].price, rel_likes: -diff }
          ]
        });
      }

      return res.json({ stockData: results[0] });

    } catch (err) {
      console.error(err);
      res.json({ error: "server error" });
    }
  });
};
