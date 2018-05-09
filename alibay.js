const assert = require('assert');

let itemsBought = {} // map that keeps track of all the items a user has bought
let itemsForSale = {}
let listings = {}
let userMap = {}
let sessionInfo = {}
/*
Before implementing the login functionality, use this function to generate a new UID every time.
*/
function genUID() {
    return Math.floor(Math.random() * 100000000)
}

function putItemsBought(userID, value) {
    itemsBought[userID] = value;
}
let registerNewUser = (newUserID, newPassword, newName) => {
    userMap[newUserID] = {
        password: newPassword,
        name: newName
    }
}

let login = (userID, password) => {
    if (userMap[userID].password === password) {
        let sessionID = Math.floor(Math.random() * 100000000)
        sessionInfo[sessionID] = { userID: userID }//session id created each time they login
        return { name: userMap[userID].name, sessionID: sessionID, success: true }
        console.log(sessionInfo)
    } else {
        return null
    }
}

function createListing(title, price, sellerID, blurb, imageName, category) {
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
    return itemID
}

function getItemDetails(itemID) {
    return listings[itemID]
    console.log(listings[itemID])
}

let search = (keyWord) => {
    let allItemArray = Object.values(listings)
    let searchResults = []
    let test = allItemArray.filter(obj => 
        Object.values(obj).some(val => {
            if(val.includes) return val.toLowerCase().includes(keyWord.toLowerCase())
            return false;
        })
    );
    return test

}

function getItemsBought(userID) {
    var ret = itemsBought[userID];
    if (ret == undefined) {
        return null;
    }
    return ret;
}


/*
initializeUserIfNeeded adds the UID to our database unless it's already there
parameter: [uid] the UID of the user.
returns: undefined
*/
function initializeUserIfNeeded(uid) {
    var items = getItemsBought[uid];
    if (items == null) {
        putItemsBought(uid, []);
    }
}

/*
allItemsBought returns the IDs of all the items bought by a buyer
    parameter: [buyerID] The ID of the buyer
    returns: an array of listing IDs
*/
function allItemsBought(buyerID) {
    return itemsBought[buyerID];
}

/* 
createListing adds a new listing to our global state.
This function is incomplete. You need to complete it.
    parameters: 
      [sellerID] The ID of the seller
      [price] The price of the item
      [blurb] A blurb describing the item
    returns: The ID of the new listing
*/


/* 
getItemDescription returns the description of a listing
    parameter: [listingID] The ID of the listing
    returns: An object containing the price and blurb properties.
*/


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
function buy(buyerID, sellerID, listingID) {

}


/* 
allItemsForSale returns the IDs of all the items beingsold by a seller
    parameter: [sellerID] The ID of the seller
    returns: an array of listing IDs
*/

function allItemsForSale(sellerID) {
    return itemsForSale[sellerID];
}

/* 
allItemsSold returns the IDs of all the items sold by a seller
    parameter: [sellerID] The ID of the seller
    returns: an array of listing IDs
*/
function allItemsSold(sellerID) {

}

/*
allListings returns the IDs of all the listings currently on the market
Once an item is sold, it will not be returned by allListings
    returns: an array of listing IDs
*/
function allListings() {
    return Object.keys(listings)
}

function allListingObjects() {
    console.log("VALUES", Object.values(listings))
    return Object.values(listings)
}

/*
searchForListings returns the IDs of all the listings currently on the market
Once an item is sold, it will not be returned by searchForListings
    parameter: [searchTerm] The search string matching listing descriptions
    returns: an array of listing IDs
*/
function searchForListings(searchTerm) {

}

module.exports = {
    genUID, // This is just a shorthand. It's the same as genUID: genUID. 
    initializeUserIfNeeded,
    putItemsBought,
    getItemsBought,
    createListing,
    getItemDetails,
    buy,
    allItemsSold,
    registerNewUser,
    login,
    userMap,
    listings,
    allListingObjects,
    search
    // Add all the other functions that need to be exported
}
