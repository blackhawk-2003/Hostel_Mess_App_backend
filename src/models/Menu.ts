import mongoose, { Document, Schema } from "mongoose";

export interface IDayMenu {
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface IMenu extends Document {
  weekStart: Date;
  days: IDayMenu[];
}

const DayMenuSchema = new Schema<IDayMenu>({
  breakfast: { type: String, required: true },
  lunch: { type: String, required: true },
  snacks: { type: String, required: true },
  dinner: { type: String, required: true },
});

const MenuSchema = new Schema<IMenu>({
  weekStart: { type: Date, required: true },
  days: {
    type: [DayMenuSchema],
    validate: [(arr: IDayMenu[]) => arr.length === 7, "Menu must have 7 days"],
    required: true,
  },
});

export default mongoose.model<IMenu>("Menu", MenuSchema);
