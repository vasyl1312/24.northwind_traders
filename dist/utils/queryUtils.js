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
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectSingleProduct = exports.selectProducts = void 0;
function selectProducts(client) {
    return __awaiter(this, void 0, void 0, function* () {
        // Вибірка лише вибраних даних з таблиці
        const selectQuery = `SELECT "id", "ProductID", "ProductName", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "UnitsOnOrder" FROM products1;`;
        const startTime = new Date();
        const selectResult = yield client.query(selectQuery);
        const finishTime = new Date();
        const executionTimeToSecond = (finishTime.getTime() - startTime.getTime()) / 1000;
        const sqlLog = [
            {
                querySqlLog: selectQuery,
                startTime: startTime.toISOString(),
                finishTime: finishTime.toISOString(),
                executionTimeToSecond: executionTimeToSecond.toFixed(3),
            },
        ];
        const selectedData = selectResult.rows;
        let result = {
            sqlLog,
            products: selectedData,
        };
        return result;
    });
}
exports.selectProducts = selectProducts;
function selectSingleProduct(client, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const selectQuery = `SELECT "id", "ProductID", "ProductName", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "SupplierID", "ReorderLevel", "Discontinued", "UnitsOnOrder" FROM products1 WHERE "id" = $1;`; //AND Supplier.Id=Product.SupplierId додати???????????????????????????????????????
        const startTime = new Date();
        const selectResult = yield client.query(selectQuery, [productId]);
        const finishTime = new Date();
        const executionTimeToSecond = (finishTime.getTime() - startTime.getTime()) / 1000;
        const sqlLog = [
            {
                querySqlLog: selectQuery,
                startTime: startTime.toISOString(),
                finishTime: finishTime.toISOString(),
                executionTimeToSecond: executionTimeToSecond.toFixed(3),
            },
        ];
        const selectedData = selectResult.rows;
        let result = {
            sqlLog,
            products: selectedData,
        };
        return result;
    });
}
exports.selectSingleProduct = selectSingleProduct;
