// import cors from 'cors'
// import express from 'express'
// import { Client } from 'pg'
// import productsRoutes from './routes/productsRoutes'
// import suppliersRoutes from './routes/suppliersRoutes'
// import { swaggerRouter } from './swagger/router'

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
import cors from 'cors';
import express from 'express';
import { Client } from 'pg';
import productsRoutes from './routes/productsRoutes';
import suppliersRoutes from './routes/suppliersRoutes';
import { swaggerRouter } from './swagger/router';

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8081;
const connectionString = process.env.DATABASE_URL;

const app = express();
const client = new Client({ connectionString });

app.use(cors());
app.use(express.json());

app.use('/products', productsRoutes(client));
app.use('/suppliers', suppliersRoutes(client)); 
app.use('/api_docs', swaggerRouter);

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Error connecting to the database:', error);
});
