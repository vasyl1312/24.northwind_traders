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
exports.createTableAndInsertData = exports.readProductsFromFile = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const dotenv = __importStar(require("dotenv"));
const pg_1 = require("pg");
const queryProductsUtils_1 = require("../utils/queryProductsUtils");
const fs_1 = require("fs");
dotenv.config();
const connectionString = process.env.DATABASE_URL;
const client = new pg_1.Client({ connectionString });
function readProductsFromFile() {
    return new Promise((resolve, reject) => {
        const results = [];
        (0, fs_1.createReadStream)('Telegram Archive/Products.csv')
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => {
            results.push(data);
        })
            .on('end', () => {
            resolve(results);
        })
            .on('error', (error) => {
            reject(error);
        });
    });
}
exports.readProductsFromFile = readProductsFromFile;
function createTableAndInsertData(client, productsInfo, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // await client.connect()
            const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        "id" SERIAL PRIMARY KEY,
        "ProductID" integer,
        "ProductName" varchar(255),
        "SupplierID" integer,
        "CategoryID" integer,
        "QuantityPerUnit" varchar(255),
        "UnitPrice" numeric,
        "UnitsInStock" integer,
        "UnitsOnOrder" integer,
        "ReorderLevel" integer,
        "Discontinued" integer
      );
    `;
            yield client.query(createTableQuery);
            const insertQuery = `INSERT INTO products ("ProductID","ProductName","SupplierID","CategoryID","QuantityPerUnit","UnitPrice","UnitsInStock","UnitsOnOrder","ReorderLevel","Discontinued")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
            for (const row of productsInfo) {
                const { ProductID, ProductName, SupplierID, CategoryID, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued, } = row;
                // Перевірка, чи існує вже запис з такими даними
                const existingQuery = `
        SELECT
          "id",
          "ProductID",
          "ProductName",
          "QuantityPerUnit",
          "UnitPrice",
          "UnitsInStock",
          "UnitsOnOrder"
        FROM products
        WHERE
          "ProductID" = $1 AND
          "ProductName" = $2 AND
          "SupplierID" = $3 AND
          "CategoryID" = $4 AND
          "QuantityPerUnit" = $5 AND
          "UnitPrice" = $6 AND
          "UnitsInStock" = $7 AND
          "UnitsOnOrder" = $8 AND
          "ReorderLevel" = $9 AND
          "Discontinued" = $10
        LIMIT 1;
      `;
                const existingResult = yield client.query(existingQuery, [
                    ProductID,
                    ProductName,
                    SupplierID,
                    CategoryID,
                    QuantityPerUnit,
                    UnitPrice,
                    UnitsInStock,
                    UnitsOnOrder,
                    ReorderLevel,
                    Discontinued,
                ]);
                if (existingResult.rowCount === 0) {
                    // Якщо запис не знайдено, виконуємо INSERT запит
                    yield client.query(insertQuery, [
                        ProductID,
                        ProductName,
                        SupplierID,
                        CategoryID,
                        QuantityPerUnit,
                        UnitPrice,
                        UnitsInStock,
                        UnitsOnOrder,
                        ReorderLevel,
                        Discontinued,
                    ]);
                }
            }
            //query
            const result = yield (0, queryProductsUtils_1.selectProducts)(client);
            return result;
        }
        catch (error) {
            console.error('Error creating table and inserting productsInfo:', error);
            throw new Error('Error creating table and inserting productsInfo');
        }
        finally {
            // await client.end()
        }
    });
}
exports.createTableAndInsertData = createTableAndInsertData;
