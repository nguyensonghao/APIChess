const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const ChessHelper = require('./helpers/chess');
const DataHelper = require('./helpers/data');

MongoClient.connect(process.env.MONGODB_URI, function (err, client) {
    if (err) {
        console.log("Connect database error!");
        console.log(err);
    } else {
        io.on('connection', socket => {
            const db = client.db(process.env.DBNAME);

            DataHelper.getListRoom(db).then(listRoom => {
                socket.emit('getListRoom', getListRoom());
            })

            socket.on('createRoom', (id) => {
                DataHelper.createRoom(db, new Date().getTime()).then(result => {
                    io.sockets.emit('getListRoom', result.listRoom);
                })
            })

            socket.on('joinRoom', (newUser) => {
                let id = newUser.roomId;
                let user = newUser.user;
                DataHelper.getRoomById(db, roomId).then(room => {
                    if (room) {
                        // Join socket room
                        if (room.listUser.length < 2) {
                            // Join socket to socket room
                            socket.join(room.id);

                            // Join user to room
                            addUserToRoom(id, user);

                            // Change information room
                            io.sockets.emit('getListRoom', getListRoom());

                            // Put event add new user to other user in room
                            io.to(room.id).emit('createGame', room.game);
                        } else {
                            console.log("Room fulled user!");
                        }
                    } else {
                        console.log("Room not exist!");
                    }
                })
            })

            io.sockets.on('disconnect', () => {
                console.log("End connect!!!");
            })

            // socket.on('pressButton', (id) => {
            // 	// Check end game
            //      status = status == 'x' ? 'o' : 'x';
            //      chessboard.map(items => {
            //          items.map(item => {
            //              if (item.key == id) {
            //                  item.value = status;
            //              }
            //          })
            //      })

            //      let check = ChessHelper.checkWin(id, chessboard);
            //      if (check.result) {
            //          let listRow = check.listRow;
            //          listRow.map(row => {
            //              chessboard.map(items => {
            //                  items.map(item => {
            //                      if (item.key == row.key) {
            //                          item.isWin = true;
            //                      }
            //                  })
            //              })
            //          })

            //          statusGame = 'end';
            //          console.log("Win");
            //      } else {
            //          console.log("Not win");
            //      }

            // 	io.sockets.emit('pressButton', {
            //          chessboard: chessboard,
            //          statusGame: statusGame
            //      });
        })

        server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))     
    }
});