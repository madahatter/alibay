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
    //you should redirect to login page
    // success false
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
    // let UserID = parsed.email
    // console.log(parsed)
    res.send({itemID, sessionID});
});

app.get('/itemCart', (req, res) => {
    //you are passing me the sessionID so I can get the itemIDs that I am storing in my cart
    //I will be returning an array of objects that are all the objects in your cart
    let sessionID = req.query.sessionID
    let cartItems = sessionInfo[sessionID]
    res.send(JSON.stringify(alibay.getCart(cartItems)))
});

app.post('/removeFromCart', (req, res) => {
    // let parsed = (JSON.parse(req.body))
    // let parsedUserID = parsed.userID
    // let parsedItemID = parsed.itemID
    //will be storing itemids in a cart for that particular userID less the removed item
    sessionInfo[sessionID] = sessionInfo[sessionID].filter(e => e !== itemID)
    res.send({});
});

app.post('/itemsbySeller', (req, res) => {
    let parsed = (JSON.parse(req.body))
    let parsedUserID = parsed.email //  will be retrieving items sold by the userdID in sellermap
    res.send(JSON.stringify(alibay.allItemsForSale(parsedUserID)));
});
app.post('/allItemBuyer', (req, res) => {
    let parsed = (JSON.parse(req.body))
    let parsedUserID = parsed.email //  will be retrieving items sold by the userdID in buyermap//********* */

});
app.post('/buyItems', (req, res) => {
    let parsed = JSON.parse(req.body)
    let parsedItems = parsed.itemid //array of itemids being purchased
    let parsedUsedID = parsed.userID// so I can associate the purchase with the buyer
    res.send('purchase successful');
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



app.listen(4000, () => console.log('Listening on port 4000!'))
