"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(id, firstName, lastName, username, password, email, birthDate, gender, address, phoneNumber, registrationDate, accountStatus = true, role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.birthDate = birthDate;
        this.gender = gender;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.registrationDate = registrationDate;
        this.accountStatus = accountStatus;
        this.role = role;
    }
}
exports.default = User;
