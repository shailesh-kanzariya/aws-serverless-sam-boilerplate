// User Model class that defines basic data structire of User object/item

// Class constructor that creates and returns new User object as per given attributes
class User {
  constructor(uEmail, uFirstName, uLastName) {
    this.Email = uEmail;
    this.FirstName = uFirstName;
    this.Lastname = uLastName;
  }
}

module.exports = {
  User,
};
