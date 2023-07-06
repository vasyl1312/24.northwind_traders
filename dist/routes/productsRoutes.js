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
const queryProductsUtils_1 = require("../utils/queryProductsUtils");
const router = express_1.default.Router();
const productsRoutes = (client) => {
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // createAndRead(client)
            const page = req.query.page ? parseInt(req.query.page.toString(), 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 20;
            const result = yield (0, queryProductsUtils_1.selectProducts)(client, page, limit);
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
            const result = yield (0, queryProductsUtils_1.selectSingleProduct)(client, productId);
            res.json(result);
        }
        catch (error) {
            console.error('Error retrieving data from the database:', error);
            res.status(500).send('Internal Server Error');
        }
    }));
    return router;
};
exports.default = productsRoutes;
