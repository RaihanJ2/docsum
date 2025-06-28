import mongoose, { Schema } from "mongoose";

const SummarySchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  originalText: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  summaryType: {
    type: String,
    enum: ["general", "bullets", "tldr", "key-points", "executive"],
    default: "general",
  },
  summaryLength: {
    type: String,
    enum: ["short", "medium", "long"],
    default: "medium",
  },
  wordCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

SummarySchema.index({ userId: 1, createdAt: -1 });

const Summary =
  mongoose.models.Summary || mongoose.model("Summary", SummarySchema);

export default Summary;
