const createChessboard = () => {
	let index = 0;
	let listGrid = [];
    for (let i = 0; i < 600; i += 20) {
        let list = [];
        for (let j = 0; j < 600; j += 20) {
            list.push({
                key: index,
                value: '',
                isWin: false
            });

            ++index;
        }
        
        listGrid.push(list);
    }   

    return listGrid;
}

const getIndexOfItem = (id, list) => {
	for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].length; j++) {
            if (id == list[i][j].key) {
                return {i: i, j: j};
            }
        }
    }

    return { i: 0, j: 0};
}

const checkWinRow = (id, list, position) => {
        let data = list[position.i];
        return checkWinList(data);
}

const checkWinCol = (id, list, position) => {
    let x = position.i;
    let y = position.j;
    let data = [];
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].length; j++) {
            if (j == y) {
                data.push(list[i][j]);
            }
        }
    }

    return checkWinList(data);
}

const checkWinCrossLeft = (id, list, position) => {
    let x = position.i;
    let y = position.j;
    let data = [];
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].length; j++) {
            if (j - i == y - x) {
                try {
                    data.push(list[i][j]);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    return checkWinList(data);
}

const checkWinCrossRight = (id, list, position) => {
    let x = position.i;
    let y = position.j;
    let data = [];
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].length; j++) {
            if (j + i == x + y) {
                try {
                    data.push(list[i][j]);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    return checkWinList(data);
}

const checkWinList = (list) => {
    if (list.length > 5) {
        for (let i = 0; i < list.length - 5; i++) {
            let listRow = [];
            let value = list[i].value;
            for (let j = i; j < i + 5; j++) {
                if (list[j].value && list[j].value == value) {
                    listRow.push(list[j]);
                }
            }

            if (listRow.length == 5) {
                return {
                    result: true,
                    listRow: listRow
                }
            }
        }

        return { result: false };
    } else {
        return {result: false};
    }
}

const checkWin = (id, list) => {
    let position = getIndexOfItem(id, list);
    let checkRow = checkWinRow(id, list, position);
    let checkCol = checkWinCol(id, list, position);
    let checkLeft = checkWinCrossLeft(id, list, position);
    let checkRight = checkWinCrossRight(id, list, position);
    if (checkRow.result) {
        return checkRow;
    } else if (checkCol.result) {
        return checkCol;
    } else if (checkLeft.result) {
        return checkLeft;
    } else if (checkRight.result) {
        return checkRight;
    } else {
        return {result: false};
    }
}

module.exports = {
	createChessboard: () => {
		return createChessboard();
	},

	getIndexOfItem: (id, list) => {
        return getIndexOfItem(id, list);
    },

    checkWinRow: (id, list, position) => {
        return checkWinRow(id, list, position);
    },

    checkWinCol: (id, list, position) => {
        return checkWinCol(id, list, position);
    },

    checkWinCrossLeft: (id, list, position) => {
        return checkWinCrossLeft(id, list, position);
    },

    checkWinCrossRight: (id, list, position) => {
        return checkWinCrossRight(id, list, position);
    },

    checkWinList: (list) => {
        return checkWinList(list);
    },

    checkWin: (id, list) => {
        return checkWin(id, list);
    }
}