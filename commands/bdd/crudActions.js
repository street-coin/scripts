const assosActions = require('./crud/association');
const contactsActions = require('./crud/contacts');
const usersActions = require('./crud/users');

module.exports = {
    Assos: assosActions,
    Contacts: contactsActions,
    Users: usersActions
}