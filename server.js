const express = require("express"); // npm i express | yarn add express
const session = require('express-session');
const path = require('path');
const cors = require("cors");    // npm i cors | yarn add cors
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const db = require('./config/db');
const sessionOption = require('./config/sessionOption');
const app = express();
const PORT = 8080; // 포트번호 설정

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// post 요청 시 값을 객체로 바꿔줌
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'front/build')));

var MySQLStore = require('express-mysql-session')(session);

var sessionStore = new MySQLStore(sessionOption);


app.use(session({
    key: 'session_cookie_name',
    secret: 'your_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(cors({
    origin: "*",                // 출처 허용 옵션
    credentials: true,          // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200,  // 응답 상태 200으로 설정
}))
app.use((req, res, next) => {
    console.log(req.session);  // 세션 확인
    next();
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/front/build/index.html'));
});


app.get('/inquiry', function (req, res) {
    try {
        const sqlQuery = 'select * from room;';
        db.query(sqlQuery, (err, results) => {
            res.send(results); // 수정된 부분
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.post('/pay', function (req, res) {
    try {
        const id = parseInt(req.body.id, 10);
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const bedType = req.body.bedType;
        const totalCost = req.body.totalCost;
        const userId = parseInt(req.body.userId,10);

        console.log('Received from client:', id);

        // Validation: Check if 'id' is a valid integer
        if (isNaN(id)) throw new Error('Invalid id or roomId');

        // Begin a database transaction
        db.beginTransaction(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            // Step 0: 'reservedInfo'에 예약되어있는 날짜가 포함된지 안된지 검사해야함
            const checkQuery = `
            SELECT COUNT(*) AS count
            FROM reserveInfo
            WHERE id = ? 
              AND bedType = ?
              AND (
                (startDate <= ? AND endDate >= ?) OR
                (startDate <= ? AND endDate >= ?) OR
                (startDate >= ? AND endDate <= ?)
              );
        `;
            db.query(checkQuery, [id, bedType, startDate, endDate, startDate, endDate, startDate, endDate], function (err, checkResults) {
                if (err) {
                    // Rollback the transaction in case of an error
                    return db.rollback(function () {
                        console.error(err);
                        res.status(500).send('error');
                    });
                }
                const overlappingReservations = checkResults[0].count;

                if (overlappingReservations > 0) {
                    // There are overlapping reservations, handle accordingly (e.g., send an error response)
                    res.json({ tf: false });
                } else {

                    // Step 2: Insert into 'reserveInfo' table
                    const insertQuery = 'INSERT INTO reserveInfo(id,startDate,endDate,totalCost, bedType, userId) VALUES (?,?,?, ?, ?, ?)';
                    db.query(insertQuery, [id, startDate, endDate,totalCost, bedType, userId], function (err, insertResults) {
                        if (err) {
                            // Rollback the transaction in case of an error
                            return db.rollback(function () {
                                console.error(err);
                                res.status(500).send('Internal Server Error');
                            });
                        }
                        // Commit the transaction if both queries were successful
                        db.commit(function (err) {
                            if (err) {
                                // Rollback the transaction in case of an error
                                return db.rollback(function () {
                                    console.error(err);
                                    res.status(500).send('Internal Server Error');
                                });
                            }

                            // Success: Send a success response
                            res.status(200).json({ message: 'Reservation and payment successful' });
                        });
                    });
                }
            });

        });
    } catch (error) {
        // Exception handling: Log the error and send an error response
        console.error(error);
        res.status(400).send('Bad Request');
    }
});

app.post('/cancel', function (req, res) {
    try {
        const id = parseInt(req.body.id, 10);

        // Validation: Check if 'id' is a valid integer
        if (isNaN(id)) throw new Error('Invalid id');

        //  Delete data from 'reserveInfo' table
        const deleteQuery = 'DELETE FROM reserveInfo WHERE id = ?';
        db.query(deleteQuery, [id], function (err, deleteResults) {
            if (err) {
                // Rollback the transaction in case of an error
                return db.rollback(function () {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                });
            }
            console.log('Delete results:', deleteResults);
        });
    } catch (error) {
        // Exception handling: Log the error and send an error response
        console.error(error);
        res.status(400).send('Bad Request');
    }
});
//회원가입
app.post('/signup', function (req, res) {
    try {
        const userName = req.body.userName;
        const userPhone = req.body.userPhone;
        const userBirth = req.body.userBirth;
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;

        const sqlQuery = `INSERT INTO user(userName,userPhone,userBirth,userEmail,userPassword) VALUES(?,?,?,?,?);`;

        db.query(sqlQuery, [userName, userPhone, userBirth, userEmail, userPassword], (err, results) => {
            if (err) {
                // Error handling: Log the error and send an error response
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Success: Send a success response
                res.status(200).json({ message: 'Cancellation successful' });
            }
        });
    } catch (error) {
        // Exception handling: Log the error and send an error response
        console.error(error);
        res.status(400).send('Bad Request');
    }
});

//이메일 중복체크
app.post('/checkEmail', function (req, res) {
    try {
        const userEmail = req.body.userEmail;

        const sqlQuery = 'SELECT COUNT(*) AS count FROM user WHERE userEmail = ?';
        db.query(sqlQuery, [userEmail], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            const count = results[0].count;

            if (count > 0) res.json({ tf: false });
            else res.json({ tf: true });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// app.get('/authcheck', (req, res) => {
//     const sendData = { isLogin: "" };
//     if (req.session.is_logined) {
//         sendData.isLogin = "True"
//         sendData.nickname =req.session.nickname;
//     } else {
//         sendData.isLogin = "False"
//     }
//     res.send(sendData);
// })
//로그인
app.post('/signin', function (req, res) {
    console.log("/signin", req.body)
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;
    const sendData = { isLogin: "" };
    const sqlQuery = 'SELECT * FROM user WHERE userEmail = ?';

    // id와 pw가 입력되었는지 확인
    db.query(sqlQuery, [userEmail], function (error, results, fields) {

        if (error) throw error;
        if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.      

            bcrypt.compare(userPassword, results[0].userPassword, (err, result) => {    // 입력된 비밀번호가 해시된 저장값과 같은 값인지 비교
                //console.log(result)
                //console.log(userPassword==results[0].userPassword)
                if (userPassword == results[0].userPassword) {                  // 비밀번호가 일치하면
                    console.log("로그인 정보 일치")
                    req.session.is_logined = true;
                    req.session.nickname = results[0].id;
                    console.log(req.session);
                    req.session.save(function (err) {
                        if (err) {
                            console.error('Error saving session:', err);
                        } else {
                            console.log('Session saved successfully.');
                        }
                        sendData.isLogin = "True" //로그인 성공시
                        sendData.userId = results[0].id;
                        res.send(sendData);
                    });

                    const sqlQuery2 = `INSERT INTO logtable (created, userId, action, command, actiondetail) VALUES (NOW(), ?, 'login' , '-', 'React 로그인 테스트');`;
                    db.query(sqlQuery2, [req.session.nickname]);
                }
                else {                                   // 비밀번호가 다른 경우
                    sendData.isLogin = "로그인 정보가 일치하지 않습니다."
                    res.send(sendData);
                }
            })
        } else {    // db에 해당 아이디가 없는 경우
            sendData.isLogin = "아이디 정보가 일치하지 않습니다."
            res.send(sendData);
        }
    });

});
app.get('/mypage/:userId', function (req, res) {
    try {
        const userId = req.params.userId;

        const sqlQuery = 'SELECT * FROM user WHERE id = ?';
        db.query(sqlQuery, [userId], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.send(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/reservedlist/:userId', function (req, res) {
    try {
        const userId = req.params.userId;  // 여기에 필터링할 userId 값을 지정합니다.
        console.log(req.session)
        const sqlQuery = 'SELECT * FROM reserveInfo JOIN room ON reserveInfo.id = room.id WHERE reserveInfo.userId = ?';
        db.query(sqlQuery, [userId], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.send(results); // 수정된 부분
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/mypage/:userId', function (req, res) {
    try {
        const id = req.params.userId;
        const newPassword = req.body.newPassword
        // Validation: Check if 'id' is a valid integer
        if (isNaN(id)) throw new Error('Invalid id');

        // Begin a database transaction
        db.beginTransaction(function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }


            // Step 2: Update 'room' table
            const updateQuery = 'UPDATE user SET userPassword = ? WHERE id = ?';
            db.query(updateQuery, [newPassword, id], function (err, updateResults) {
                if (err) {
                    // Rollback the transaction in case of an error
                    return db.rollback(function () {
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                    });
                }

                console.log('Update results:', updateResults);

                // Commit the transaction if both queries were successful
                db.commit(function (err) {
                    if (err) {
                        // Rollback the transaction in case of an error
                        return db.rollback(function () {
                            console.error(err);
                            res.status(500).send('Internal Server Error');
                        });
                    }

                    // Success: Send a success response
                    res.status(200).json({ message: 'Cancellation successful' });
                });
            });

        });
    } catch (error) {
        // Exception handling: Log the error and send an error response
        console.error(error);
        res.status(400).send('Bad Request');
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        console.log('로그아웃됨')
        res.redirect('/');
    });
});

// 서버 연결 시 발생
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});