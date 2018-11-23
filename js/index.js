Array.prototype.pushScoreSort = function (e, level, type) {
    if (e[level + "Correct"] === 0 && e[level + "Wrong"] === 0) {
        return; //no need to add players who have never attempted a leaderboard.
    }
    if (this.length === 0) {
        this.push(e)
        return;
    }
    for (let i = 0; i < this.length; i++) {
        if (e[level + "Correct"] > this[i][level + "Correct"]) {
            this.splice(i, 0, e);
            return;
        }
    }
    this.push(e); //if the length isnt zero, and its gone through the length comparison, this is the smallest element in the array, so just push it
}

function getScore(player) {
    return player.aCorrect + (player.bCorrect * 2) + (player.cCorrect * 3);
}

Array.prototype.pushScoreSortOpen = function (e) {

    if (this.length === 0) {
        this.push(e)
        return;
    }
    let score = getScore(e);
    for (let i = 0; i < this.length; i++) {
        if (score > getScore(this[i])) {
            this.splice(i, 0, e);
            return;
        }
    }
    this.push(e)
}

String.prototype.firstLetterUpperCase = function () {
    let split = this.split("");
    split[0] = split[0].toUpperCase();
    return split.join("")
}

var instance = M.Tabs.init(document.querySelectorAll(".tabs"), {});


let aLive = document.getElementById("aLive");
let aLegacy = document.getElementById("aLegacy");
let bLive = document.getElementById("bLive");
let bLegacy = document.getElementById("bLegacy");
let cLive = document.getElementById("cLive");
let cLegacy = document.getElementById("cLegacy");
let open = document.getElementById("open");

let db = firebase.firestore();
const settings = {
    timestampsInSnapshots: true
}
db.settings(settings)

// let aRef = db.collection("a");
// let bRef = db.collection("b");
// let cRef = db.collection("c");
// let openRef = db.collection("open");
let players = db.collection("players");


let leaderboard = {
    a: {
        live: [],
        legacy: []
    },
    b: {
        live: [],
        legacy: []
    },
    c: {
        live: [],
        legacy: []
    },
    open: {
        legacy: []
    }
}

players.get().then(function (data) {
    for (doc of data.docs) {
        let level = doc.data().level;
        leaderboard[level].live.pushScoreSort(doc.data(), level)
        leaderboard.a.legacy.pushScoreSort(doc.data(), 'a');
        leaderboard.b.legacy.pushScoreSort(doc.data(), 'b');
        leaderboard.c.legacy.pushScoreSort(doc.data(), 'c');
        leaderboard.open.legacy.pushScoreSortOpen(doc.data())
    }

    for (board in leaderboard) {
        for (bracket in leaderboard[board]) {
            let rank = 1;
            for (player of leaderboard[board][bracket]) {
                if (board !== "open") {
                    // console.log(player);
                    console.log(board + bracket.firstLetterUpperCase() + "TableData")
                    document.getElementById(board + bracket.firstLetterUpperCase() + "TableData").innerHTML += `<tr>
                        <td>${rank}</td>
                        <td>${player.firstName} ${player.lastName}</td>
                        <td>${player[board + "Correct"]}</td>
                        <td>${player[board + "Wrong"]}</td>
                        <td>${player[board + "Correct"] + player[board + "Wrong"]}</td>
                        <td>${(player[board + "Correct"] / (player[board + "Correct"] + player[board + "Wrong"])).toFixed(2) * 100 || 100}%</td>
                    </tr>`
                } else if (board === "open") {
                    document.getElementById(board + bracket.firstLetterUpperCase() + "TableData").innerHTML += `<tr>
                    <td>${rank}</td>
                    <td>${player.firstName} ${player.lastName}</td>
                    <td>${getScore(player)}</td>
                    <td>${player.aCorrect + player.bCorrect + player.cCorrect}</td>
                    <td>${player.aCorrect + player.aWrong + player.bCorrect + player.bWrong + player.cCorrect + player.cWrong }</td>
                    <td>${((player.aCorrect + player.bCorrect + player.cCorrect) / (player.aCorrect + player.aWrong + player.bCorrect + player.bWrong + player.cCorrect + player.cWrong )).toFixed(2) * 100}%</td>
                    <td>${player.aCorrect}</td>
                    <td>${player.aWrong}</td>
                    <td>${(player.aCorrect / (player.aCorrect + player.aWrong)).toFixed(2) * 100 || 100}%</td>
                    <td>${player.bCorrect}</td>
                    <td>${player.bWrong}</td>
                    <td>${(player.bCorrect / (player.bCorrect + player.bWrong)).toFixed(2) * 100 || 100}%</td>
                    <td>${player.cCorrect}</td>
                    <td>${player.cWrong}</td>
                    <td>${(player.cCorrect / (player.cCorrect + player.cWrong)).toFixed(2) * 100 || 100}%</td>
                    </tr>`
                }
                rank++;
            }
        }
    }

})




/*        */