"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const UserBL_1 = require("../BL/UserBL");
const UserRepository_1 = require("../dal/UserRepository");
const usersRoute = express_1.default.Router();
const userController = new UserController_1.UserController(new UserBL_1.UserBL(new UserRepository_1.UserRepository()));
usersRoute.get('/valid', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userController.checkUserIsValid(req, res); }));
usersRoute.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userController.addUser(req, res); }));
usersRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userController.getUser(req, res); }));
usersRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userController.getUsers(req, res); }));
usersRoute.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userController.updateUser(req, res); }));
usersRoute.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userController.deleteUser(req, res); }));
usersRoute.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userController.getUserByLogin(req, res); }));
exports.default = usersRoute;
