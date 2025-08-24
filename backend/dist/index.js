// index.ts ✅ (ONLY ONE listen here)
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import { configDotenv } from "dotenv";
configDotenv();
const PORT = process.env.PORT || 5000;
connectToDatabase().then(() => {
    app.listen(PORT, () => console.log("Server is Open and Connected successfully."));
}).catch((err) => console.log(err));
//# sourceMappingURL=index.js.map