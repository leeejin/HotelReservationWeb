

const mysql = require('mysql');  // mysql 모듈 로드

const db = mysql.createConnection({  // mysql 접속 설정
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'hotelreservation',
    insecureAuth: true,
  });

module.exports =db;