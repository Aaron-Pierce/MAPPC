class MySet { //the class Set is used by firebase, so if you define a class called set it breaks it. Way to go google?
    constructor(values = []) {
        this.values = values;
        this.push = (value) => {
            let unique = true;
            for (let v of this.values) {
                console.log(Object.values(v));
                console.log(Object.values(value))
                if (JSON.stringify(Object.values(v)) == JSON.stringify(Object.values(value))) {
                    unique = false;
                }
            }
            if (unique) {
                this.values.push(value);
            }
        }
        this.remove = (value) => {
            this.values.splice(this.values.indexOf(value), 1)
        }
    }
}
//object.keys polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function () {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({
                toString: null
            }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [],
                prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {});
});

let db = firebase.firestore();
const settings = {
    timestampsInSnapshots: true
}
db.settings(settings);

let players = db.collection('players');

let wtf = []

function searchPlayer(key = 13) {
    if (key === 13) { //this is why I don't code at night
        let queries = document.getElementById("searchPlayer").value.split(" ");
        console.log(queries)
        let matchDocs = new MySet();

        let promises = [
            players.where('firstName', '==', queries[0] || "").get().then(e => {
                for (doc of e.docs) {
                    let d = doc.data();
                    d.id = doc.id;
                    matchDocs.push(d)
                }
            }),
            players.where('lastName', '==', queries[1] || "").get().then(e => {
                for (doc of e.docs) {
                    let d = doc.data();
                    d.id = doc.id;
                    matchDocs.push(d)
                }
            }),
            players.where('grade', '==', queries[2] || "").get().then(e => {
                for (doc of e.docs) {
                    let d = doc.data();
                    d.id = doc.id;
                    matchDocs.push(d)
                }
            }),
        ]
        document.getElementById('searchResults').innerHTML = ''

        Promise.all(promises).then(() => {
            for (match of matchDocs.values) {
                console.log(match)
                document.getElementById("searchResults").innerHTML += `
            <div class="row">
            <a href="" onclick="editPlayer(this)" class="${match.id}"><h4>${match.firstName} ${match.lastName} ${match.grade}</h4></a>
            </div>
            `
            }
        });
    }
}


function addPlayer() {
    let name = document.getElementById("first_name").value;
    let lastname = document.getElementById("last_name").value;
    let grade = document.getElementById("grade").value;
    console.log(name, lastname, grade);
    players.add({
        firstName: name,
        lastName: lastname,
        grade: grade,
        level: "a",
        aCorrect: 0,
        aWrong: 0,
        bCorrect: 0,
        bWrong: 0,
        cCorrect: 0,
        cWrong: 0,

    })

    document.getElementById("first_name").value = '';
    document.getElementById("last_name").value = '';
    document.getElementById("grade").value = '';
    M.updateTextFields();
}

let editIds = [];

function editPlayer(info) {
    event.preventDefault();
    let targetPlayer = players.doc(info.classList[0]).get().then((doc) => {
        let data = doc.data();
        let modal = document.getElementById("editModal");
        let formWrapper = document.getElementById("modalEditForm")
        console.log(data)
        for (prop of Object.keys(data)) {
            let thisIsABadHack = (Math.random() * 50).toString(32);
            editIds.push(thisIsABadHack);
            formWrapper.innerHTML += `
                <div class="input-field col s6" style="display: inline-block">
                    <input placeholder="${data[prop]}" id="${thisIsABadHack}" type="text" class="${prop} ${doc.id} validate">
                    <label for="${thisIsABadHack}">${prop}</label>
                </div>
            `
        }

        M.updateTextFields();
        M.Modal.init(modal).open();
    })
}

function submitEdits() {
    let edits = {}
    for (id of editIds) {
        let prop = document.getElementById(id).classList[0];
        let docId = document.getElementById(id).classList[1];
        let data = document.getElementById(id).value;
        console.log(prop, data.replace(/\s/g, ''))
        if (data.replace(/\s/g, '') !== "") {
            console.log(prop, "has been edited")
            if (!isNaN(data)) {
                console.log("writing number")
                edits[prop] = parseInt(data);
            } else {
                console.log('writing string')
                edits[prop] = data;
            }
            players.doc(docId).update(edits).then(function () {
                console.log("data written")
            })
        } else {
            console.log(prop, "should be unchanged")
        }
    }
    editIds = [];
    document.getElementById("modalEditForm").innerHTML = "";
}