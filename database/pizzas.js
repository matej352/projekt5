
pizzas = [
    {
        "id": 1,
        "homeTeam": "Dinamo",
        "guestTeam": "Lokomotiva",
        "played": true,
        "result": "3:2"
    },
    {
        "id": 2,
        "homeTeam": "Osijek",
        "guestTeam": "Gorica",
        "played": true,
        "result": "2:1"
    },
    {
        "id": 3,
        "homeTeam": "Šibenik",
        "guestTeam": "Rijeka",
        "played": true,
        "result": "0:1"
    },
    {
        "id": 4,
        "homeTeam": "Istra",
        "guestTeam": "Hajduk",
        "played": true,
        "result": "1:1"
    },
    {
        "id": 5,
        "homeTeam": "Varaždin",
        "guestTeam": "Slaven",
        "played": true,
        "result": "1:0"
    },
    {
        "id": 6,
        "homeTeam": "Istra",
        "guestTeam": "Varaždin",
        "played": true,
        "result": "1:2"
    },
    {
        "id": 7,
        "homeTeam": "Gorica",
        "guestTeam": "Šibenik",
        "played": true,
        "result": "0:0"
    },
    {
        "id": 8,
        "homeTeam": "Lokomotiva",
        "guestTeam": "Osijek",
        "played": false,
        "result": null
    },
]




function getMatchById(id) {
    return matches.filter(el => el.id == id)[0];
}




module.exports = { pizzas, getMatchById };