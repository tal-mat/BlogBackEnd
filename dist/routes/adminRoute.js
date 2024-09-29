"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authUser_1 = __importDefault(require("../middlewares/authUser"));
// This route is only accessible to authenticated users who are admins
router.get('/', authUser_1.default.authUserSecured, authUser_1.default.isAdmin, (req, res) => {
    res.send('Admin is valid.');
});
exports.default = router;
