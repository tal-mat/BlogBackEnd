class User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    birthDate: Date;
    gender: string;
    address: string;
    phoneNumber: string;
    registrationDate: Date;
    accountStatus: boolean;
    role: string;


    constructor(id: number, firstName: string, lastName: string, username: string, password: string, email: string, birthDate: Date, gender: string, address: string, phoneNumber: string,
                registrationDate: Date, accountStatus: boolean = true, role:string) {
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

export default User;