"use strict";
// import cors from 'cors'
// import express from 'express'
// import { Client } from 'pg'
// import productsRoutes from './routes/productsRoutes'
// import suppliersRoutes from './routes/suppliersRoutes'
// import { swaggerRouter } from './swagger/router'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as dotenv from 'dotenv'
// dotenv.config()
// const PORT = process.env.PORT || 8081
// const connectionString = process.env.DATABASE_URL
// const client = new Client({ connectionString })
// const app = express()
// app.use(cors())
// app.use(express.json())
// app.use('/products', productsRoutes)
// app.use('/suppliers', suppliersRoutes)
// app.use('/api_docs', swaggerRouter)
// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`)
// })
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
const suppliersRoutes_1 = __importDefault(require("./routes/suppliersRoutes"));
const router_1 = require("./swagger/router");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8081;
const connectionString = process.env.DATABASE_URL;
const app = (0, express_1.default)();
const client = new pg_1.Client({ connectionString });
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/products', (0, productsRoutes_1.default)(client));
app.use('/suppliers', (0, suppliersRoutes_1.default)(client));
app.use('/api_docs', router_1.swaggerRouter);
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to the database:', error);
});
