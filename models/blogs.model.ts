import { model, models, Schema, Document, ObjectId, Types } from "mongoose";

export interface IBlog extends Document {
  title: string;
  caption: string;
  category: ObjectId;
  FeaturedImage: string;
  content: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Please provide a blog title"],
      lowercase: true,
      trim: true,
    },
    caption: {
      type: String,
      required: [true, "Please provide a blog caption"],
      trim: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "Please provide a blog category"],
    },
    FeaturedImage: {
      type: String,
      required: [true, "Please provide a featured image url"],
    },
    content: {
      type: String,
      required: [true, "Please provide a blog content"],
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      avatarUrl: {
        type: String,
        required: true,
      },
    },
    seo: {
      metaTitle: {
        type: String,
        required: [true, "Please provide a meta title"],
      },
      metaDescription: {
        type: String,
        required: [true, "Please provide a meta description"],
      },
    },
    slug: {
      type: String,
      default: function (this: IBlog) {
        return this.title.toLowerCase().split(" ").join("-");
      },
      unique: true,
    },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  this.slug = this.title.toLowerCase().split(" ").join("-");
  next();
});
export default models.Blog || model<IBlog>("Blog", blogSchema);
