require('dotenv').config();
const path = require('path');
const express = require('express');
// const mongoose = require('mongoose');
// const helmet = require('helmet');
// const bodyParser = require('body-parser');
// const morgan = require('morgan');
// const bluebird = require('bluebird');
// const cors = require('cors');
const enforce = require('express-sslify');
// const config = require('./config');
// const routes = require('./routes');

// const corsOptions = {
//   origin: JSON.parse(process.env.AllowUrl).urls,
//   credentials: true,
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
const app = express();

/* istanbul ignore if */
if (process.env.NODE_ENV === 'production') app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.use(express.static(path.normalize(path.join(__dirname, 'dist'))));

// Handle rejected promises globally
// app.use((req, res, next) => {
//   /* istanbul ignore next */
//   process.on('unhandledRejection', (reason, promise) => {
//     console.log(promise); // eslint-disable-line no-console
//     next(new Error(reason));
//   });
//   next();
// });
//
// app.use(cors(corsOptions));
// mongoose.Promise = bluebird;
// let mongoDbUri = process.env.MONGO_DB_URI;
/* istanbul ignore else */
// if (process.env.NODE_ENV === 'test') mongoDbUri = 'mongodb://testerOfTheYear:wj-te5ter!@ds115283.mlab.com:15283/web-jam-test';
// mongoose.connect(mongoDbUri, { useNewUrlParser: true });
// mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);
// app.use(helmet());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(morgan('tiny'));
// routes(app);

app.get('*', (request, response) => {
  response.sendFile(path.normalize(path.join(__dirname, 'dist/index.html')));
});

// this if statement is only for mocha test that may spin up twice
/* istanbul ignore if */
// if (!module.parent) {
app.listen(process.env.PORT, () => {
  console.log(`Magic happens on port ${process.env.PORT}`); // eslint-disable-line no-console
});
// }

module.exports = app;
