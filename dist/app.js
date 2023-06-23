"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
const suppliersRoutes_1 = __importDefault(require("./routes/suppliersRoutes"));
const router_1 = require("./swagger/router");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const PORT = process.env.PORT || 8081;
const swaggerPort = process.env.SWAGGER_PORT || 4000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/products', productsRoutes_1.default);
app.use('/suppliers', suppliersRoutes_1.default);
app.use('/api_docs', router_1.swaggerRouter);
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
app.listen(swaggerPort, () => {
    console.log(`Swagger listening on port  ${swaggerPort}`);
});
