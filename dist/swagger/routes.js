"use strict";
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API для отримання даних про продукти
 */
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
exports.swaggerSpec = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const productConnect_1 = require("../db/productConnect");
const queryUtils_1 = require("../utils/queryUtils");
dotenv_1.default.config();
const router = express_1.default.Router();
const connectionString = process.env.DATABASE_URL;
const client = new pg_1.Client({ connectionString });
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Отримати всі продукти
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Успішний запит
 *       500:
 *         description: Помилка сервера
 */
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
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Отримати окремий продукт за його ідентифікатором
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ідентифікатор продукту
 *     responses:
 *       200:
 *         description: Успішний запит
 *       500:
 *         description: Помилка сервера
 */
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    try {
        yield client.connect();
        const result = yield (0, queryUtils_1.selectSingleProduct)(client, productId);
        res.json(result);
    }
    catch (error) {
        console.error('Error retrieving data from the database:', error);
        res.status(500).send('Internal Server Error');
    }
    finally {
        yield client.end();
    }
}));
exports.default = router;
const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Products API',
        version: '1.0.0',
        description: 'API для отримання даних про продукти',
    },
    servers: [
        {
            url: '...',
        },
    ],
    paths: {
        '/products': {
            get: {
                summary: 'Отримати всі продукти',
                tags: ['Products'],
                responses: {
                    '200': {
                        description: 'Успішний запит',
                    },
                    '500': {
                        description: 'Помилка сервера',
                    },
                },
            },
        },
        '/products/{id}': {
            get: {
                summary: 'Отримати окремий продукт за його ідентифікатором',
                tags: ['Products'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'Ідентифікатор продукту',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Успішний запит',
                    },
                    '500': {
                        description: 'Помилка сервера',
                    },
                },
            },
        },
    },
    tags: [
        {
            name: 'Products',
            description: 'API для отримання даних про продукти',
        },
    ],
};
exports.swaggerSpec = swaggerSpec;
