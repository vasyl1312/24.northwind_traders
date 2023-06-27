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
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const productConnect_1 = require("../db/productConnect");
const queryProductsUtils_1 = require("../utils/queryProductsUtils");
dotenv_1.default.config();
const router = express_1.default.Router();
const connectionString = process.env.DATABASE_URL;
const client = new pg_1.Client({ connectionString });
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsInfo = yield (0, productConnect_1.readProductsFromFile)();
        const result = yield (0, productConnect_1.createTableAndInsertData)(productsInfo, res);
        res.json(result);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    try {
        // await client.connect()
        const result = yield (0, queryProductsUtils_1.selectSingleProduct)(client, productId);
        res.json(result);
    }
    catch (error) {
        console.error('Error retrieving data from the database:', error);
        res.status(500).send('Internal Server Error');
    }
    finally {
        // await client.end()
    }
}));
exports.default = router;
