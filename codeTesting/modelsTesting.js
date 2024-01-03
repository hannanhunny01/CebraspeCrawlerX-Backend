
const mongoose = require('mongoose')

const User = require('../models/userModel')
const PasUnb = require('../models/pasunb');
const VestUnb = require('../models/vestibular');
const dbConnect = require('../config/dbConnect');
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 4000;
// Connect to MongoDB
dbConnect().then(() => {
    
    testModels();
  })

// Function to test the models
async function testModels() {
  try {
    // Create a user
    const user = new User({
      username: 'johgdfngfdgfd_doe',
      email: 'john@gdfgfdg.com',
      password: 'secufgfdgrepassword',
      phone: '123-45fgfdgfd6-7890',
      isPremium: true
    });
    await user.save();

    // Create a PasUnb course
    const pasUnb = new PasUnb({
      subprograma: 'Progfsdfsdram X',
      stage_pas: 14,
      year_pas: 2023,
      link_to_site: 'httpsgfdgfsdfsd://pasunb.example.com',
      items_on_site: [
        {
          dates: '2023-fsf08-01',
          name: 'Evefsdfnt 1',
          link: 'httpfsdfs://event1.example.com'
        },
        {
          dates: '2023-0sfdf8-10',
          name: 'Evefsfnt 2',
          link: 'fsdf://event2.example.com'
        }
      ],
      items_on_site_number: 52
    });
    await pasUnb.save();

    // Create a VestUnb course
    const vestUnb = new VestUnb({
      nome: 'Vestfsdfibular Y',
      vagas: 'dfsdsf',
      remuneracao: '2sdfsd000',
      type: 'vestibdsfdsfular',
      link_to_site: 'https://fdsf.example.com',
      items_on_site: [
        {
          dates: '2023-09-01',
          name: 'Evefdffnt A',
          link: 'httpsff://eventA.example.com'
        }
      ],
      items_on_site_number: 14
    });
    await vestUnb.save();
   // console.log('VestUnb course created:', vestUnb);

    // Update the user's subscribed courses
    user.pasUnb.push(pasUnb._id);
    user.VestUnb.push(vestUnb._id);
    await user.save();
   // console.log('User updated with subscribed courses:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}
