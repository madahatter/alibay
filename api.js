const alibay = require('./alibay')
const express = require('express')
const fs = require('fs');
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
app.use(bodyParser.raw({ type: '*/*' }))
app.use(cookieParser())

let sessionInfo = {}

app.use(express.static('images'))

app.get('/session', (req, res) => { 
    let sessionID = req.cookies.session
    if (!sessionInfo[sessionID]) {
        sessionID = Math.floor(Math.random() * 100000000)
        sessionInfo[sessionID] = [];
        res.cookie('session', sessionID, { expires: new Date(Date.now() + (1000 * 60 * 60 * 24)) });
    }
    res.send(JSON.stringify({ success: true, sessionID, cartItems: sessionInfo[sessionID] }))
})

app.post('/login', (req, res) => {
    let parsed = JSON.parse(req.body.toString())
    let userID = parsed.email //username is email address
    let password = parsed.password
    res.send(JSON.stringify(alibay.login(userID, password)))
});
app.post('/registerUser', (req, res) => {
    let parsed = JSON.parse(req.body.toString())
    let newUserID = parsed.email //username is the email address
    let newPassword = parsed.password
    let newName = parsed.name // persons name
    alibay.registerNewUser(newUserID, newPassword, newName)
    res.send(JSON.stringify({ success: true }))
});
app.post('/createListing', (req, res) => {
    let parsed = JSON.parse(req.body.toString())
    let title = parsed.title
    let price = parsed.itemPrice
    let sellerID = parsed.email
    let blurb = parsed.description
    let imageName = parsed.img
    let category = parsed.category
    console.log(parsed)
    res.send(JSON.stringify(alibay.createListing(title, price, sellerID, blurb, imageName, category)));
});
app.get('/itemDetails', (req, res) => {
    let itemID = req.query.itemID
    // returning item title, description, price, category, sellerid, sellername
    res.send(JSON.stringify(alibay.getItemDetails(itemID)));
})
app.get('/search', (req, res) => {
    let searchTerm = req.query.terms;
    let category = req.query.category; //boolean, is it a category?
    if (category === "true") return res.send(JSON.stringify(alibay.categories(searchTerm)));
    res.send(JSON.stringify(alibay.search(searchTerm.split(','))));
});
app.post('/addToCart', (req, res) => {
    let sessionID = req.cookies.session
    let parsed = (JSON.parse(req.body))
    let itemID = parsed.itemID
    sessionInfo[sessionID] = sessionInfo[sessionID].concat(itemID);
    res.send({itemID, sessionID});
});
app.get('/itemCart', (req, res) => {
    let sessionID = req.cookies.session
    let cartItems = sessionInfo[sessionID]
    res.send(JSON.stringify(alibay.getCart(cartItems)))
});
app.post('/removeFromCart', (req, res) => {
    sessionInfo[sessionID] = sessionInfo[sessionID].filter(e => e !== itemID)
    res.send({});
});
app.get('/itemsbySeller', (req, res) => {
    let sellerID = req.query.sellerID
    console.log(sellerID)
    res.send(JSON.stringify(alibay.allItemsForSale(sellerID)));
});
app.post('/allItemBuyer', (req, res) => {
    let parsed = (JSON.parse(req.body))
    let parsedUserID = parsed.email //  will be retrieving items sold by the userdID in buyermap//********* */

});
app.post('/save-stripe-token', (req, res) => {
    let sessionID = req.cookies.session
    sessionInfo[sessionID] = []
    let parsed = JSON.parse(req.body)
    let boughtItems = parsed.itemID //array of itemids being purchased
    let buyerID = parsed.email// so I can associate the purchase with the buyer
    res.send(JSON.stringify(alibay.buy()));
    //thanks to client for purchase
});
app.post('/uploadImg', (req, res) => {
    let extension = req.query.extension;
    let randomFileName = Math.random().toString(36).substring(7);
    console.log(`items/${randomFileName}.${extension}`);
    fs.writeFileSync(`images/${randomFileName}.${extension}`, req.body);
    // returning item title, description, price, category, sellerid, sellername
    res.send(JSON.stringify({ success: true, imageName: `${randomFileName}.${extension}` }));
})
app.get('/randomListings', (req, res) => {
    res.send(JSON.stringify(alibay.getRandomListings()))
})

app.listen(4000, () => console.log('Listening on port 4000!'))
