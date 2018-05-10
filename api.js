const alibay = require('./alibay')
const express = require('express')
const fs = require('fs');
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.raw({ type: '*/*' }))


app.use(express.static('images'))

app.post('/login', (req, res) => {
    let parsed = JSON.parse(req.body.toString())
    let userID = parsed.email //username is email address
    let password = parsed.password
    
    res.send(JSON.stringify(alibay.login(userID, password)))
    //email, name, sessionid, 
    
});

app.post('/registerUser', (req, res) => {
    let parsed = JSON.parse(req.body.toString())
    let newUserID = parsed.email //username is the email address
    let newPassword = parsed.password
    let newName = parsed.name // persons name
    alibay.registerNewUser(newUserID, newPassword, newName)
    res.send(JSON.stringify({success: true}))
    //you should redirect to login page
    // success false
});
app.post('/createListings', (req, res) => {
    let parsed = JSON.parse(req.body.toString())
    let title = parsed.itemTitle
    let price = parsed.itemPrice
    let sellerID = parsed.email
    let blurb = parsed.blurb
    let imageName = parsed.imageName
    let category = parsed.category
    //receiving object of title, price, blurb, sellerid, category, img
    res.send(JSON.stringify(alibay.createListing(title, price, sellerID, blurb, imageName, category)));
    // you are getting back {itemid: 12342142343}
    //you will redirect to /itemDetails
    //you should also store userID/email from your side
});
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

app.post('/uploadImg', (req, res) => {
    let extension = req.query.extension;
    let randomFileName = Math.random().toString(36).substring(7);
    let filePath = `images/${randomFileName}.${extension}`;
    console.log(`items/${randomFileName}.${extension}`);
    fs.writeFileSync(filePath, req.body);
    // alibay.addItemImage()
    // returning item title, description, price, category, sellerid, sellername
    res.send(JSON.stringify({success: true, img: filePath}));
})


app.post('/itemDetails', (req, res) => {
    let parsed = JSON.parse(req.body)
    let itemID = parsed.itemID
    // returning item title, description, price, category, sellerid, sellername
    res.send(JSON.stringify(alibay.getItemDetails(itemID)));
})

app.get('/search', (req, res) => {
    let keyWords = req.query.terms
    res.send(JSON.stringify(alibay.search(keyWords)));
});

app.get('/categories', (req, res) => {
    let keyWords = JSON.parse(req.query.terms)
    res.send(JSON.stringify(alibay.search(keyWords)));
});

app.post('/addToCart', (req, res) => {
    let parsed = (JSON.parse(req.body))
    let parsedItemID = parsed.itemID
    let parsedUserID = parsed.userID
    //will be storing itemids and userids in a cart for that particular userID
    res.send('successfully added to cart');
    //user will continue to /listallitems
});

app.post('/itemCart', (req, res) => {
    let parsed = (JSON.parse(req.body))
    let parsedUserID = parsed.userID // so I can get the list of items in the cart for that particular user
    // will be sending back list of items in the cart
    res.send(JSON.stringify([{itemID1234: {
        username:"bob", 
        itemTitle:"Nice TV",
        itemBlurb: "",
        itemPrice: "100$",
        image: "img.jpg"
    }}]));
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
    let parsedUserID = parsed.userID //  will be retrieving items sold by the userdID in sellermap
    res.send(JSON.stringify([{userID1234:{
        username:"bob", 
        itemTitle:"Nice TV",
        itemBlurb: "",
        itemPrice: "100$",
    }}]));
});
app.post('/allItemBuyer', (req, res) => {
    let parsed = (JSON.parse(req.body))
    let parsedUserID = parsed.userID //  will be retrieving items sold by the userdID in buyermap
    res.send(JSON.stringify([{userID1234:{
        username:"sue", 
        itemTitle:"Nice TV",
        itemBlurb: "",
        itemPrice: "100$",
    }}]));
});
app.post('/buyItems', (req, res) => {
    let parsed = JSON.parse(req.body)
    let parsedItems = parsed.itemid //array of itemids being purchased
    let parsedUsedID = parsed.userID// so I can associate the purchase with the buyer
    res.send('purchase successful');
    //thanks to client for purchase
});
app.listen(4000, () => console.log('Listening on port 4000!'))
