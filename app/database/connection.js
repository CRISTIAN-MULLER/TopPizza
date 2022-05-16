require('dotenv').config();
const mongoose = require('mongoose');
const { log } = require('mercedlogger');
const MONGO_URL = process.env.MONGO_URL;

///////////////////////////////////
// Mongoose Configuration Object to Avoid Warnings
///////////////////////////////////
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};
///////////////////////////////////
// Making the Database Connection
///////////////////////////////////
mongoose.connect(MONGO_URL, config);

///////////////////////////////////
// Handling Connection Events
///////////////////////////////////
mongoose.connection
  // Event for When Connection Opens
  .on('open', () => log.green('STATUS', 'Connected to Mongo'))
  // Event for When Connection Closes
  .on('close', () => log.red('STATUS', 'Disconnected from Mongo'))
  // Event for Connection Errors
  .on('error', (error) => log.red('ERROR', error));

///////////////////////////////////
// Exporting Our Connection
///////////////////////////////////
module.exports = mongoose;
// const mongoose = require('mongoose');
// const connectDB = async () => {
//   try {
//     const con = await mongoose.connect(
//       'mongodb+srv://admin:greenfood@cluster0.vzrkn.mongodb.net/greenfood?retryWrites=true&w=majority',
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//         useCreateIndex: true,
//       }
//     );
//     console.log(`Conectado em: ${con.connection.host}`);
//   } catch (err) {
//     console.log(err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
