"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const router_1 = require("./swagger/router");
const ordersRoutes_1 = __importDefault(require("./routes/ordersRoutes"));
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
const suppliersRoutes_1 = __importDefault(require("./routes/suppliersRoutes"));
const customersRoutes_1 = __importDefault(require("./routes/customersRoutes"));
const employeesRoutes_1 = __importDefault(require("./routes/employeesRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8081;
const connectionString = process.env.DATABASE_URL;
const client = new pg_1.Client({ connectionString });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/products', (0, productsRoutes_1.default)(client));
app.use('/suppliers', (0, suppliersRoutes_1.default)(client));
app.use('/customers', (0, customersRoutes_1.default)(client));
app.use('/employees', (0, employeesRoutes_1.default)(client));
app.use('/orders', (0, ordersRoutes_1.default)(client));
app.use('/api_docs', router_1.swaggerRouter);
client
    .connect()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to the database:', error);
});
