//mongoose setup
import mongoose from "mongoose";
const connectDb = (url) => {
  mongoose.set("strictQuery", false);
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDb;
