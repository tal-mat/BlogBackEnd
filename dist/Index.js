"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const activityLogger_1 = __importDefault(require("./middlewares/activityLogger"));
const postsRoute_1 = __importDefault(require("./routes/postsRoute"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const oauthRoute_1 = __importDefault(require("./routes/oauthRoute"));
const requestRoute_1 = __importDefault(require("./routes/requestRoute"));
exports.app = (0, express_1.default)();
const port = 4000;
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(activityLogger_1.default);
// app.use(addUserHandler);
exports.app.use("/posts", postsRoute_1.default);
exports.app.use("/users", usersRoute_1.default);
exports.app.use("/requests", requestRoute_1.default);
exports.app.use("/oauth", oauthRoute_1.default);
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
