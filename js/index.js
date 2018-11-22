var instance = M.Tabs.init(document.querySelectorAll(".tabs"), {});


let aLive = document.getElementById("aLive");
let aLegacy = document.getElementById("aLegacy");
let bLive = document.getElementById("bLive");
let bLegacy = document.getElementById("bLegacy");
let cLive = document.getElementById("cLive");
let cLegacy = document.getElementById("cLegacy");
let open = document.getElementById("open");

let db = firebase.firestore();
const settings = {timestampsInSnapshots: true}
db.settings(settings)

// let aRef = db.collection("a");
// let bRef = db.collection("b");
// let cRef = db.collection("c");
// let openRef = db.collection("open");
let players = db.collection("players");


(players.where("level", "==", "a")).orderBy("aCorrect", "desc").limit(20).get().then(function(data){
    let aLive = document.getElementById("aLiveTableData");
    let rank = 1;
    for(doc of data.docs){
        let d = doc.data();
        aLive.innerHTML += `<tr>
        <td>${rank}</td>
        <td>${d.firstName} ${d.lastName}</td>
        <td>${d.aCorrect}</td>
        <td>${d.aWrong}</td>
        <td>${d.aCorrect + d.aWrong}</td>
        <td>${(d.aCorrect / (d.aCorrect + d.aWrong)).toFixed(2) * 100}%</td>
        </tr>`
        rank++;
    }
})


players.where("level", "==", "b").orderBy("bCorrect", "desc").limit(20).get().then(function(data){
    let aLive = document.getElementById("bLiveTableData");
    let rank = 1;
    for(doc of data.docs){
        let d = doc.data();
        aLive.innerHTML += `<tr>
        <td>${rank}</td>
        <td>${d.firstName} ${d.lastName}</td>
        <td>${d.bCorrect}</td>
        <td>${d.bWrong}</td>
        <td>${d.bCorrect + d.bWrong}</td>
        <td>${(d.bCorrect / (d.bCorrect + d.bWrong)).toFixed(2) * 100}%</td>
        </tr>`
        rank++;
    }
})

players.where("level", "==", "c").orderBy("cCorrect", "desc").limit(20).get().then(function(data){
    let aLive = document.getElementById("cLiveTableData");
    let rank = 1;
    for(doc of data.docs){
        let d = doc.data();
        aLive.innerHTML += `<tr>
        <td>${rank}</td>
        <td>${d.firstName} ${d.lastName}</td>
        <td>${d.cCorrect}</td>
        <td>${d.cWrong}</td>
        <td>${d.cCorrect + d.cWrong}</td>
        <td>${(d.cCorrect / (d.cCorrect + d.cWrong)).toFixed(2) * 100}%</td>
        </tr>`
        rank++;
    }
})



players.orderBy("aCorrect", "desc").limit(20).get().then(function(data){
    let aLive = document.getElementById("aLegacyTableData");
    let rank = 1;
    for(doc of data.docs){
        let d = doc.data();
        aLive.innerHTML += `<tr>
        <td>${rank}</td>
        <td>${d.firstName} ${d.lastName}</td>
        <td>${d.aCorrect}</td>
        <td>${d.aWrong}</td>
        <td>${d.aCorrect + d.aWrong}</td>
        <td>${(d.aCorrect / (d.aCorrect + d.aWrong)).toFixed(2) * 100}%</td>
        </tr>`
        rank++;
    }
})


players.orderBy("bCorrect", "desc").limit(20).get().then(function(data){
    let aLive = document.getElementById("bLegacyTableData");
    let rank = 1;
    for(doc of data.docs){
        let d = doc.data();
        aLive.innerHTML += `<tr>
        <td>${rank}</td>
        <td>${d.firstName} ${d.lastName}</td>
        <td>${d.bCorrect}</td>
        <td>${d.bWrong}</td>
        <td>${d.bCorrect + d.bWrong}</td>
        <td>${(d.bCorrect / (d.bCorrect + d.bWrong)).toFixed(2) * 100}%</td>
        </tr>`
        rank++;
    }
})

players.orderBy("cCorrect", "desc").limit(20).get().then(function(data){
    let aLive = document.getElementById("cLegacyTableData");
    let rank = 1;
    for(doc of data.docs){
        let d = doc.data();
        aLive.innerHTML += `<tr>
        <td>${rank}</td>
        <td>${d.firstName} ${d.lastName}</td>
        <td>${d.cCorrect}</td>
        <td>${d.cWrong}</td>
        <td>${d.cCorrect + d.cWrong}</td>
        <td>${(d.cCorrect / (d.cCorrect + d.cWrong)).toFixed(2) * 100}%</td>
        </tr>`
        rank++;
    }
})

