import * as yup from "yup";

export const pageSchema = yup.object().shape({
  title: yup.string().required("Page title is required"),
  slug: yup
    .string()
    .required("URL slug is required")
    .matches(
      /^[a-z0-9/-]+$/,
      "URL slug can only contain lowercase letters, numbers, hyphens, and slashes",
    ),

  excerpt: yup
    .string()
    .max(160, "Post excerpt should be concise (under 160 characters)"),

  featuredImage: yup.mixed(),

  seoTitle: yup
    .string()
    .max(
      60,
      "SEO title should be under 60 characters for optimal display in search results",
    ),

  seoDescription: yup
    .string()
    .max(
      160,
      "Meta description should be under 160 characters for optimal display in search results",
    ),

  seoKeywords: yup.string(),

  schema: yup
    .mixed()
    .nullable()
    .test("is-json", "Invalid JSON format", (value) => {
      if (!value) return true;
      if (typeof value === "object") return true; // Already an object
      if (typeof value !== "string") return false;
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === "object" && parsed !== null;
      } catch {
        return false;
      }
    }),
});

export interface PageCreate {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  schema: any;
}
