"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_json_1 = __importDefault(require("./config.json"));
const app = (0, express_1.default)();
app.get("", (req, res) => {
    res.send("Hello World");
});
app.listen(config_json_1.default.PORT, () => {
    console.log(`Server running on PORT ${config_json_1.default.PORT}`);
});
//# sourceMappingURL=app.js.map