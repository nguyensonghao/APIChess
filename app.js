const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const ChessHelper = require('./helpers/chess');
const port = 3001;
const app = express();
const server = http.createServer(app);

const io = socketIO(server);

let listRoom = [];

let chessboard = ChessHelper.createChessboard();
let status = 'o';
let statusGame = 'playing';

const getListRoom = () => {
    return listRoom;
}

const getRoomById = (id) => {
    return listRoom.find(room => {
        return room.id == id;
    })
}

const addUserToRoom = (roomId, user) => {
    listRoom.map(room => {
        if (room.id == roomId) {
            room.listUser.push(user);
        }
    })
}

const createRoom = () => {
    let room = {
        id: new Date().getTime(),
        name: `Room ${listRoom.length}`,
        listUser: [],
        status: false,
        game: {
            chessboard: ChessHelper.createChessboard(),
            statusGame: 'start',
            status: 'o'
        }
    }

    listRoom.push(room);
}

const joinRoom = () => {

}

const leaveRoom = () => {

}


io.on('connection', socket => {
    socket.emit('getListRoom', getListRoom());

    socket.on('createRoom', (id) => {
        createRoom();
        io.sockets.emit('getListRoom', getListRoom());
    })

    socket.on('joinRoom', (newUser) => {
        let id = newUser.roomId;
        let user = newUser.user;
        let room = getRoomById(id);
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

server.listen(port, () => console.log(`Listening on port ${port}`))