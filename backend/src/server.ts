import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.routes";
import adminRouter from "./routes/admin.routes";
//import { setupSwagger } from "./swagger";

const app = express();

app.use(cors());
app.use(express.json());

//setupSwagger(app);

// Routes
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/admin", adminRouter);


app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});