let db = require('../models/data');


/**User Interactions**/
function signUp() {
    // With email, username and password (encrypted, decrypt here and save to db)
}

function deleteAccount() {
    // User voluntarily delete his/her own account, need to wipe out everything about him/her
    // from database
}

function logIn() {
    // email/username and password (encrypted, decrypt here and check with db)
}

function logOut() {
    // clear session? 
}

function addEvent() {
    // With dates, event name, event type
}

function deleteEvent() {
    // With dates, event name, event type
}

function editEvent() {
    // With dates, event name, event type
}

function editProfile() {
    // save the updates to db
}

function follow() {
    // add the person to current user's 'following' property
    // add the current user to the person's 'followedBy' property 
}

function unFollow() {
    // remove this person from current user's 'following' property
    // remove the current user from the person's 'followedBy' property
}

function showFollowedEvents() {
    // get followed people from 'following' property
    // return their events
}

function showMyEvents() {
    // get the current user's events
}

function plusOne() {
    // pass in event id, change +1 value
}

function addTheDDLToMyList() {
    // add someone's deadline event to the current user's own list
}

function comment(){
    // current user leave a comment to someone's event, put this commentId into this event
}

function deleteComment() {
    // delete one's own comment, delete the corresponding comment in this event
}

function subscribeEmailNotificatino() {
    // future feature
}

function search() {
    // search by username/date/keyword/category
    // How to know if the input is a username or a date or a keyword or a category?
}

/**Functions for Admin users**/
function deleteUsers() {
    // delete the selected users from database
}

function deleteEvents() {
    // delete events from database
}

function deleteInproperComments() {
    // delete whatever comments the admin doesn't like
}

function createCommonEvents() {
    // create some sample/common events for the users to add in one click
}