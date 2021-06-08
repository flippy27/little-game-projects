const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const con = require('./connection')
var bodyParser = require('body-parser')


app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.get('/getAllCards', (req, res) => {
    con.query('SELECT * FROM card', (err, rows, fields) => {
        res.send(JSON.stringify(rows))
    })
})
app.get('/getCardByID/:id', (req, res) => {
    con.query('SELECT * FROM card WHERE card_id = ' + req.params.id, (err, rows, fields) => {
        res.send(JSON.stringify(rows))
    })
})
app.post('/addCard', (req, res) => {
    con.query('INSERT INTO card SET ?', [req.body], (err, resp) => {
        let info = ''
        if (err) {
            info = {
                status: 500
            }
        } else {
            info = {
                insertedID: resp.insertId,
                status: 200
            }
        }
        res.send(info)
    })
})
app.post('/deleteCard', (req, res) => {
    console.log(req.body);
    con.query('DELETE FROM card WHERE card_id = ' + req.body.id, (err, resp) => {
        let info = ''
        if (err) {
            info = {
                status: 500
            }
        } else {
            info = {
                status: 200
            }
        }
        res.send(info)
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})