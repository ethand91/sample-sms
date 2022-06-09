import config from './../config/config';
import mongoose from 'mongoose';
import app from './express';

console.log(config.mongoUri);
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  //useCreateIndex: true,
});

mongoose.connection.once('error', (error) => {
  console.error(error);
  throw new Error(`Unable to connect to mongo database on at uri ${config.mongoUri}`);
});

app.listen(config.port, (error) => {
  if (error) {
    console.error(error);
  }

  console.info(`Server started on port ${config.port}`);
});
