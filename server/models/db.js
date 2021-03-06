const mongoose = require('mongoose');
const mysql = require('mysql');

// Private
const env = process.env;

mongoose.connect(env.MONGODB_CONNECTION, { config: { autoIndex: true } });

const connection_pool = mysql.createPool({
  connectionLimit: 10,
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

// Public
module.exports = {
  getUser(email) {
    return new Promise((resolve, reject) => {
      connection_pool.getConnection((err, conn) => {
        if (err) {
          return reject(err);
        }
        const queryStr = 'SELECT * FROM user WHERE email = ?';
        const queryVar = [email];
        const query = conn.query(queryStr, queryVar, (errQuery, rows, fields) => {
          if (errQuery) {
            return reject(errQuery);
          }
          resolve(rows);
        });
      });
    });
  },

  setScheduleDate(date, canWork) {
    return new Promise((resolve, reject) => {
      connection_pool.getConnection((err, conn) => {
        if (err) {
          return reject(err);
        }
        const queryStr = 'INSERT INTO chefscheduleexception (chefId, exceptionStartDate, exceptionEndDate, canWorkBit) VALUES ?';

        // hardcoded for now since im lazzy today :)
        const values = [
          [6, `${date} 15:00:00`, `${date} 16:00:00`, `${canWork}`],
          [7, `${date} 15:00:00`, `${date} 16:00:00`, `${canWork}`],
          [8, `${date} 15:00:00`, `${date} 16:00:00`, `${canWork}`],
          [9, `${date} 15:00:00`, `${date} 16:00:00`, `${canWork}`],
        ];
        const query = conn.query(queryStr, [values], (errQuery, rows, fields) => {
          if (errQuery) {
            return reject(errQuery);
          }
          console.log(rows);
          resolve(rows);
        });
        console.log(query.sql);
      });
    });
  },
};
