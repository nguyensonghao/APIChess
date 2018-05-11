var ChessHelper = require('./chess');

const getListRoom = (db) => {
    return new Promise((resolve, reject) => {
        db.collection('rooms').find({}).toArray((err, list) => {
            resolve(err ? [] : list);
        })
    })
}

const getRoomById = (db, roomId) => {
    return new Promise((resolve, reject) => {
        db.collection('rooms').findOne({ roomId: roomId}, (err, room) => {
            resolve(err ? null : room);
        })
    })
}

const roomDefault = (name) => {
    return {
        roomId: new Date().getTime(),
        name: `Room ${name}`,
        listUser: [],
        status: false,
        game: {
            chessboard: ChessHelper.createChessboard(),
            statusGame: 'start',
            status: 'o'
        }
    }
}

const creatNewRoom = (db, name) => {
    let game = roomDefault(name);
    return new Promise((resolve, reject) => {
        db.collection('rooms').insert(game, (err, result) => {
            if (err) {
                resolve(false);
            } else {
                getListRoom(db).then((listRoom) => {
                    resolve({
                        room: room,
                        listRoom: listRoom
                    })
                })
            }
        })
    })
}

module.exports = {
    getListRoom: getListRoom(db),
    getRoomById: getRoomById(db, roomId),
    creatNewRoom: creatNewRoom(db, name)
}