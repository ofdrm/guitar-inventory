"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const api = __importStar(require("./api"));
exports.register = (app) => {
    app.get("/", (req, res) => {
        res.render("index");
    });
    app.get("/guitars", (req, res) => {
        res.render("guitars");
    });
    api.register(app);
};
//# sourceMappingURL=index.js.map