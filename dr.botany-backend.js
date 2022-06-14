const express = require('express');
const cors = require('cors');
const app = express()
const mongoose = require("mongoose");
const port = process.env.PORT || 5000
const treatment = require('./treatment.js')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    cors({
        origin: ["http://localhost:3000", "https://dr-botany3.web.app"],
        credentials: true,
    })
);

mongoose.connect('mongodb+srv://admin-Shakthi:shakthi007@cluster0.uxzue.mongodb.net/dr_botany?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch(error => handleError(error));


const historySchema = new mongoose.Schema({
    email: String,
    querypic: String,
    plant: String,
    result: String,
    cure: String,
    detection: String,
    impact: String,
    date: String
})

const history = new mongoose.model("History", historySchema);





app.post('/addhistory', (req, res, next) => {
    var email = req.body.email;
    var query = req.body.query;
    console.log("log")
    history.create({
        email: email,
        querypic: query.querypic,
        result: query.result,
        cure: query.cure,
        plant: query.plant,
        detection: query.detection,
        impact: query.impact,
        date: query.date

    }, (err, created) => {
        if (!err) {
            return res.send(created)
        }
        else {
            return res.status(400).send({
                message: 'This is an error!'
            });
        }
    })
})

app.get('/gethistory', (req, res, next) => {
    var email = req.query.email;
    history.find({ email: email }, (err, found) => {
        if (!err)
            res.send(found)
        else
            res.status(400).send({
                message: "Error"
            })
    })
})

app.get('/getcure', (req, res, next) => {
    var disease = req.query.disease
    var found = treatment.getCure(disease)
    if (!found)
        res.status(400).send({
            message: "Error in getting cure"
        })
    else
        res.send(found)


})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
