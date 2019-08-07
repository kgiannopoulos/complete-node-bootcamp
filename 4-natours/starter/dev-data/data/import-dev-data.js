const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourmodels');

dotenv.config({path: './config.env'});


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB,  {
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify: false
}).then(() => console.log('Db connection successful'));


//read json filke

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// Import Data into database

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully loaded');

  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete all data from database
const deleteData = async  () => {
  try {
    await Tour.deleteMany();
    console.log('data successfully deleted');

  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] ==='--delete') {
  deleteData();
}

console.log(process.argv);