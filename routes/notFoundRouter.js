import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notFoundRouter = (req, res, next) => {
  return res.sendFile(path.join(__dirname, "..", "views", "404.html"));
};

export default notFoundRouter;
