import express from "express";
import cors from "cors";
import customerProductsRouter from "./routes/products.routes";
import adminRouter from "./routes/admin.routes";
import authRouter from "./routes/auth.routes";
import resellerRouter from "./routes/reseller.routes";

const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use("/api/v1/products", resellerRouter);
app.use("/api/v1/customer/products", customerProductsRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/auth", authRouter);



app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});