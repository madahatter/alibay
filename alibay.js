const assert = require('assert')
const fs = require('fs')

let itemsBought = JSON.parse(fs.readFileSync('db/itemsBought.json')) // map that keeps track of all the items a user has bought
let itemsForSale = JSON.parse(fs.readFileSync('db/itemsForSale.json'))
let listings = JSON.parse(fs.readFileSync('db/listings.json'))
let userMap = JSON.parse(fs.readFileSync('db/userMap.json'))
/*
Before implementing the login functionality, use this function to generate a new UID every time.
*/


function genUID() {
    return Math.floor(Math.random() * 100000000)
}

function putItemsBought(userID, value) {
    itemsBought[userID] = value;
    fs.writeFileSync('db/itemsBougth.json', JSON.stringify(itemsBought))
}
let registerNewUser = (newUserID, newPassword, newName) => {
    userMap[newUserID] = {
        password: newPassword,
        name: newName
    }
    fs.writeFileSync('db/userMap.json', JSON.stringify(userMap))
}

function addItemImage(itemID, img) {
    if (!listings[itemID]) {
        listings[itemID].imgs = []
    }
    listings[itemID].imgs.push(img);
}

let login = (userID, password) => {
    if (userMap[userID].password === password) {
        // sessionInfo[sessionID] = { userID: userID }//session id created each time they login
        return userMap[userID].name
    } else {
        return null
    }
    fs.writeFileSync('db/sessionInfo.json', JSON.stringify(sessionInfo))
}

let createListing = (title, price, sellerID, blurb, imageName, category) => {
    let itemID = Math.floor(Math.random() * 1000000)
    listings[itemID] = {
        itemID,
        title,
        price,
        sellerID,
        blurb,
        imageName,
        category
    }
    if (!itemsForSale[sellerID]) {
        itemsForSale[sellerID] = [itemID]
    } else {
        itemsForSale[sellerID] = itemsForSale[sellerID].concat(itemID)
    }
    fs.writeFileSync('db/listings.json', JSON.stringify(listings))
    fs.writeFileSync('db/itemsForSale.json', JSON.stringify(itemsForSale))
    return { itemID, success: true }

}

let addToCart = (itemID, sessionID) => {
    if (!sessionInfo[sessionID]) {
        sessionInfo[sessionID] = []
    }
    sessionInfo[sessionID].concat(itemID)
    return itemID;
}

let getItemDetails = (itemID) => {
    return listings[itemID]

}

let search = (keyWords) => {
    // return an array of objects that includes all of the keywords
    return Object.values(listings).filter(listing =>
        keyWords.every(keyword =>
            Object.values(listing).some(listingValue => listingValue.toString().toLowerCase().includes(keyword.toLowerCase())))
    )
}

let categories = (category) => {
    return Object.values(listings).filter(listing => listing.category.toLowerCase() === category.toLowerCase());
}

function getItemsBought(userID) {
    var ret = itemsBought[userID];
    if (ret == undefined) {
        return null;
    }
    return ret;
}

/*
allItemsBought returns the IDs of all the items bought by a buyer
    parameter: [buyerID] The ID of the buyer
    returns: an array of listing IDs
*/
function allItemsBought(buyerID) {
    return itemsBought[buyerID];
}

function addItemImage(itemID, img) {
    if (!listings[itemID]) {
        listings[itemID].imgs = []
    }
    listings[itemID].imgs.push(img);
}

let getRandomListings = () => {
    let listingItems = Object.values(listings)
    if(listingItems.length <= 4) {
        return Object.values(listings)
    }
    let randMap = {}
    let randArray = []
    let rand
    for (var i = 0; i < 4; i++) {
        do {
            rand = Math.floor(Math.random() * listingItems.length)
        } while (randMap[rand])
        randMap[rand] = true
        randArray.push(listingItems[rand])
    }
return randArray
}

/* 
buy changes the global state.
Another buyer will not be able to purchase that listing
The listing will no longer appear in search results
The buyer will see the listing in his history of purchases
The seller will see the listing in his history of items sold
    parameters: 
     [buyerID] The ID of buyer
     [sellerID] The ID of seller
     [listingID] The ID of listing
    returns: undefined
*/
function buy(buyerID, boughtItems) {
    if(!itemsBought[buyerID]){
        itemsBought[buyerID] = boughtItems
    } else {
    itemsBought[buyerID] = itemsBought[buyerID].concat(boughtItems)}
    fs.writeFileSync('db/itemsBought.json', JSON.stringify(itemsBought))
    return {success: true}
}


/* 
allItemsForSale returns the IDs of all the items beingsold by a seller
    parameter: [sellerID] The ID of the seller
    returns: an array of listing IDs
*/

let allItemsForSale = (sellerID) => {
    return itemsForSale[sellerID].map(itemID => listings[itemID])
}

module.exports = {
    genUID, // This is just a shorthand. It's the same as genUID: genUID. 

    putItemsBought,
    getItemsBought,
    createListing,
    getItemDetails,
    buy,
    registerNewUser,
    login,
    userMap,
    listings,
    allItemsForSale,
    search,
    addItemImage,
    addToCart,
    categories,
    getRandomListings,
    buy,
    // Add all the other functions that need to be exported
}
