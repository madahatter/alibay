const alibay = require('./alibay')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.raw({ type: '*/*' }))

app.post('/login', (req, res) => {
    res.send('hi')
    let parsed = JSON.stringify(req.body)
    let username = parsed.username
    let password = parsed.password
    let sessionID = Math.floor(Math.random() * 100000000)
    if(username === 'john' && password === 'pwd123'){
        alibay.sessionInfo[sessionID] = {username : username}
        res.send(JSON.stringify({sessionID: sessionID, success: true}))
    }
});

app.get('/test', (res, req) => {
    return
res.send('hello')
})
// app.post('/registerUser', (req, res) => {
//     let uid = rcd eq.query.uid;
//     res.send(JSON.stringify(alibay.getItemsBought(uid)));
// });

// app.get('/allListings', (req, res) => {
//     let uid = req.query.uid;
//     res.send(JSON.stringify(alibay.getItemsBought(uid)));
// });

// app.post('/search', (req, res) => {
//     let uid = req.query.uid;
//     res.send(JSON.stringify(alibay.getItemsBought(uid)));
// });

// app.post('/viewItemDetails', (req, res) => {
//     let uid = req.query.uid;
//     res.send(JSON.stringify(alibay.getItemsBought(uid)));
// });

// app.post('/postAd', (req, res) => {
//     let uid = req.query.uid;
//     res.send(JSON.stringify(alibay.getItemsBought(uid)));
// });

// app.post('/addToCart', (req, res) => {
//     let uid = req.query.uid;
//     res.send(JSON.stringify(alibay.getItemsBought(uid)));
// });

// app.post('/itemCart', (req, res) => {
//     let uid = req.query.uid;
//     res.send(JSON.stringify(alibay.getItemsBought(uid)));
// });

// app.post('/itemSeller', (req, res) => {
//     let uid = req.query.uid;
//     res.send(JSON.stringify(alibay.getItemsBought(uid)));
// });
// app.post('/allItemBuyer', (req, res) => {
//     let uid = req.query.uid;
//     res.send(JSON.stringify(alibay.getItemsBought(uid)));
// });
// app.post('/buyItems', (req, res) => {
//     let uid = req.query.uid;
//     res.send(JSON.stringify(alibay.getItemsBought(uid)));
// });
app.listen(3000, () => console.log('Listening on port 3000!'))
