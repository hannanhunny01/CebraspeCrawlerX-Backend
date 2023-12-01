const User = require('../../models/userModel');
const PasUnb = require('../../models/pasunb');
const asyncHandler = require("express-async-handler");
const axios = require('axios');
const { findLatestDate } = require('../../utils/latestDateChecker');

const { getUser } = require('./getUsersZap');

const sendMessagePas = asyncHandler(async function (req, res) {
  try {
    const getPasUnb = await PasUnb.find({});
    const data = [];

    for (const item of getPasUnb) {
      if (item.items_on_site_number < item.items_on_site.length) {
        const all_titles = item.items_on_site;
        let dates = all_titles.map(p => p.date);
        const datesToSend = [];

        for (let i = item.items_on_site_number; i < item.items_on_site.length; i++) {
          const latestDate = findLatestDate(dates);
          datesToSend.push(latestDate);
          dates = dates.filter(item => item !== latestDate);
        }

        const item_to_send = [];
        for (const date of datesToSend) {
          const item_on_site = all_titles.filter(item => item.date == date);
          item_to_send.push(...item_on_site);
        }

        const people = await getUser(item.users);

        if (people.length > 0) {
          data.push({ nameOfObject: item.stage_pas + " " + item.year_pas, updates: item_to_send, people: people });
        }
      }
    }

    if (data.length > 0) {
      const sendRequest = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({item:data})
      };

      const msgdata = await  fetch('http://localhost:4000/api/message/sendMessage', sendRequest);
      const answer = await msgdata.json();  
      return res.json(answer);
    } else {
      res.json({ message: "notSent" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { sendMessagePas };
