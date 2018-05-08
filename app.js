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

const getRomById = (id) => {
    return listRoom.find(room => {
        return room.id == id;
    })
}

const createRoom = () => {
    let room = {
        id: new Date(),
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