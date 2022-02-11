let currentPlayer = 0;
let map = {};
var firstPlayer
var secondPlayer

// if ($('player').on("click", function(e) {
//         e.preventDefault();
//         currentPlayer = firstPlayer;
//     }))

//     if ($('bot').on("click", function(e) {
//             e.preventDefault();
//             currentPlayer = secondPlayer;
//         }))



$(document).ready(function() {
    $('.butt').on('click', function(e) {
        e.preventDefault();
        if (currentPlayer === 0 && asBot) {
            return false;
        }

        setTimeout(() => console.log(this), 1);

        if ($(this).text() !== '') {
            return false;
        }

        let char = 'O';
        if (currentPlayer === 1) {
            char = 'X';
        }

        $(this).text(char);
        map[$(this).data('x')][$(this).data('y')] = currentPlayer;

        let winner = checkWinner();
        if (winner !== null) {
            $('#endGame').fadeIn();
            return false;
        }

        if (++currentPlayer > 1) {
            currentPlayer = 0;
        }

        if (currentPlayer === 1) {
            botAction();
        }

        return false;
    });

    $('#restart').on('click', function(e) {
        e.preventDefault();
        $(this).parent().fadeOut();
        resetMap();
        document.location.reload();
        return false;
    })

});


function resetMap() {
    map = {};
    for (let x = 0; x < 3; x++) {
        map[x] = {};
        for (let y = 0; y < 3; y++) {
            map[x][y] = null;
        }
    }
    $('.butt').text('');
    currentPlayer = 0;
    firstMove = true;

}

function checkWinner() {
    let isWin = false;
    for (let x = 0; x < 3; x++) {
        isWin = map[x][0] === map[x][1] && map[x][1] === map[x][2] && map[x][0] !== null;
        if (isWin) {
            return map[x][0];
        }
    }

    for (let y = 0; y < 3; y++) {
        isWin = map[0][y] === map[1][y] && map[1][y] === map[2][y] && map[0][y] !== null;
        if (isWin) {
            return map[0][y];
        }
    }

    isWin = map[0][0] === map[1][1] && map[1][1] === map[2][2] && map[0][0] !== null;
    if (isWin) {
        return map[0][0];
    }

    isWin = map[2][0] === map[1][1] && map[1][1] === map[0][2] && map[2][0] !== null;
    if (isWin) {
        return map[2][0];
    }


    let mapFull = true;
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (map[x][y] === null) {
                return null;
            }
        }
    }

    return -1;
}

function predict() {
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (map[x][y] !== null) {
                continue;
            }

            map[x][y] = 1;
            let winner = checkWinner();
            map[x][y] = null;

            if (winner === 1) {
                return { x: x, y: y };
            }

            map[x][y] = 0;
            winner = checkWinner();
            map[x][y] = null;

            if (winner === 0) {
                return { x: x, y: y };
            }
        }
    }

    return null;
}

function doClick(x, y) {
    $('.butt[data-x="' + x + '"][data-y="' + y + '"]').trigger('click');
}

let firstMove = true;
let asBot = false;

function botAction() {
    asBot = true;
    if (currentPlayer !== 1) {
        return;
    }

    let predictResult = predict();
    if (predictResult !== null) {
        doClick(predictResult.x, predictResult.y);
        asBot = false;
        return;
    }

    if (firstMove) {
        if (map[1][1] === null) {
            doClick(1, 1);
        }


        if (map[1][1] === 0) {
            doClick(0, 0);
        }

        firstMove = false;
    } else {
        if (map[1][0] === 0) {
            if (map[0][1] === 0 && map[0][0] === null) {
                doClick(0, 0);
            }
            if (map[2][1] === 0 && map[2][0] === null) {
                doClick(2, 0);
            }
        }

        if (map[1][2] === 0) {
            if (map[0][1] === 0 && map[0][0] === null) {
                doClick(0, 2);
            }
            if (map[2][1] === 0 && map[2][0] === null) {
                doClick(2, 2);
            }
        }

        if ((map[2][0] === 0 && map[0][2] === 0) || (map[0][0] === 0 && map[2][2] === 0)) {
            doClick(1, 2);
        }

        if (map[0][0] === null && map[2][2] === null /* && map[1][1] === 1*/ ) {
            doClick(0, 0);
        }

        if (map[2][0] === null && map[0][2] === null /* && map[1][1] === 1*/ ) {
            doClick(2, 0);
        }

        if (map[0][1] === null && map[2][1] === null) {
            doClick(0, 1);
        }

        if (map[1][0] === null && map[1][2] === null) {
            doClick(1, 0);
        }

        let emptyCount = 0,
            emptyPlaces = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (map[x][y] === null) {
                    emptyCount++;
                    emptyPlaces.push({ x: x, y: y });
                }
            }
        }
        if (emptyCount === 2) {
            let toClick = emptyPlaces[0];
            doClick(toClick.x, toClick.y);
        }

        // Jeśli zostaly 2 puste pola to losowo.
        // Zawsze postaw po wolnym skosie
    }

    asBot = false;
}


function hideBoard() {
    document.getElementById("game1").style.display = "block";
    document.getElementById("game2").style.display = "block";
    document.getElementById("game3").style.display = "block";
    document.getElementById("game4").style.display = "block";
    document.getElementById("game5").style.display = "block";
    document.getElementById("game6").style.display = "block";
    document.getElementById("game7").style.display = "block";
    document.getElementById("game8").style.display = "block";
    document.getElementById("game9").style.display = "block";
}

function botStart() {
    currentPlayer = 1;
    let randomX = Math.floor(Math.random() * 3);
    let randomY = Math.floor(Math.random() * 3);
    doClick(randomX, randomY);

    if (map[1][1] !== null) {
        if (firstMove) {
            if (map[1][1] === null) {
                doClick(1, 1);
            }


            if (map[1][1] === 0) {
                doClick(0, 0);
            }

            firstMove = false;
        }

    }


    hideBoard();
}




resetMap();

// function a() {
//     console.log(1);
// }

// setInterval(function() {
//     console.log(2);
// }, 1000);

// Sprawdzanie poziome
// for (let y = 0; y < 3; y++) {
//     let field = null,
//         isWin = false,
//         x = 0,
//         winner = null;
//     do {
//         if (field === null) {
//             field = map[x][y];
//             if (field === null) {
//                 break;
//             }

//             continue;
//         }

//         let currentField = map[x][y];
//         if (currentField !== field) {
//             isWin = false;
//             break;
//         }

//         isWin = true;
//         winner = currentField;
//         field = currentField;
//     } while (x++ < 3);

//     if (isWin) {
//         return winner;
//     }
// }

// // Sprawdzanie pionowe
// for (let x = 0; x < 3; x++) {
//     let field = null,
//         isWin = false,
//         y = 0,
//         winner = null;
//     do {
//         if (field === null) {
//             field = map[x][y];
//             if (field === null) {
//                 break;
//             }

//             continue;
//         }

//         let currentField = map[x][y];
//         if (currentField !== field) {
//             isWin = false;
//             break;
//         }

//         isWin = true;
//         winner = currentField;
//         field = currentField;
//     } while (y++ < 3);

//     if (isWin) {
//         return winner;
//     }
// }