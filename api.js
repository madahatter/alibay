const alibay = require('./alibay')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
app.use(bodyParser.raw({ type: '*/*' }))


app.use(express.static('images'))

app.get('/session', (req, res) => {
    let sessionID = req.headers.cookie
    if (!sessionInfo[sessionID]) {
        sessionID = Math.floor(Math.random() * 100000000)
        res.cookie('session', sessionID, { expires: new Date(Date.now() + (1000 * 60 * 60 * 24)) });
    }
    res.send(JSON.stringify({ success: true, sessionID }))
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
    //receiving object of title, price, blurb, sellerid, category, img
    res.send(JSON.stringify(alibay.createListing(title, price, sellerID, blurb, imageName, category)));
    // you are getting back {itemid: 12342142343}
    //you will redirect to /itemDetails
    //you should also store userID/email from your side
});

// app.get('/listAllItems', (req, res) => {
//     res.send(JSON.stringify([{itemid1234: {
//         sellerName: "bob", 
//         itemTitle: "Nice TV",
//         itemPrice: "100$",
//         image: 'img.jpg'
//     }}]));
// });

// app.get('/search', (req, res) => {
//     console.log(req.query)
//     let terms = req.query.terms;
//     console.log(terms.split(','))
//     // let searchField = parsed.searchField
//     //var listOfIds = F_getIds()
//     //var listOfObjs = F_GetTheWholeThing(listOfIds)
//     //res.send(JSON.stringify(listOfObjs))
//     //sending array of items that match criteria of search
//     res.send(JSON.stringify([{itemid1234: {
//         name: "bob", 
//         itemTitle: "Nice TV",
//         itemPrice: "100$",
//         image: 'img.jpg'
//     }}]));
// });

// app.get('/listAllItems', (req, res) => {
//     //alibay.allListingObjects()
//     console.log(alibay.allListingObjects())
//     res.send(JSON.stringify([{itemid1234: {
//         sellerName: "bob", 
//         itemTitle: "Nice TV",
//         itemPrice: "100$",
//         image: 'img.jpg'
//     }}]));
// });


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
    let sessionID = req.cookie.session
    let parsed = (JSON.parse(req.body))
    let ItemID = parsed.itemID
    // let UserID = parsed.email
    // console.log(parsed)
    res.send(alibay.addToCart(ItemID, sessionID));
});

app.get('/itemCart', (req, res) => {
    // let parsed = (JSON.parse(req.body))
    let sessionID = req.headers.cookie // so I can get the list of items in the cart for that particular user
    // will be sending back list of items in the cart

    res.send(JSON.stringify(alibay.getCartItems(sessionID)));
});

app.post('/removeFromCart', (req, res) => {
    let parsed = (JSON.parse(req.body))
    let parsedUserID = parsed.userID
    let parsedItemID = parsed.itemID
    //will be storing itemids in a cart for that particular userID less the removed item
    res.send('successfully removed from cart');
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
