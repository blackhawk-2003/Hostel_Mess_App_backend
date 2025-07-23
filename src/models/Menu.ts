import mongoose, { Document, Schema } from "mongoose";

export interface IMenu extends Document {
  date: string; // e.g., '2024-07-23'
  day: string; // e.g., 'Tuesday'
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

const MenuSchema = new Schema<IMenu>({
  date: { type: String, required: true, unique: true },
  day: { type: String, required: true },
  breakfast: { type: String, required: true },
  lunch: { type: String, required: true },
  snacks: { type: String, required: true },
  dinner: { type: String, required: true },
});

export default mongoose.model<IMenu>("Menu", MenuSchema);
