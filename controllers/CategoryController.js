import Category from "../models/Category.js";
import deleteCloudinaryImage from "../utils/deleteCloudinary.js";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const parseIsActive = (value, fallback = true) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value === "true" || value === "1";
  }

  return Boolean(value);
};

export const createCategory = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();

    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const slug = slugify(req.body.slug || name);

    if (!slug || slug.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Valid slug is required",
      });
    }

    const categoryData = {
      name,
      slug,
      isActive: parseIsActive(req.body.isActive, true),
      image: "",
    };

    if (req.file?.path) {
      categoryData.image = req.file.path;
    }

    const category = await Category.create(categoryData);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const existingCategory = await Category.findById(req.params.id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const updateData = {};

    if (req.body.name !== undefined) {
      const name = String(req.body.name).trim();
      if (!name || name.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }
      updateData.name = name;
    }

    if (req.body.slug !== undefined || req.body.name !== undefined) {
      const slugSource =
        req.body.slug !== undefined
          ? req.body.slug
          : updateData.name || existingCategory.name;
      const slug = slugify(String(slugSource));

      if (!slug || slug.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Valid slug is required",
        });
      }

      updateData.slug = slug;
    }

    if (req.body.isActive !== undefined && req.body.isActive !== "") {
      updateData.isActive = parseIsActive(
        req.body.isActive,
        existingCategory.isActive
      );
    }

    if (req.file?.path) {
      if (existingCategory.image) {
        await deleteCloudinaryImage(existingCategory.image);
      }
      updateData.image = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category.image) {
      await deleteCloudinaryImage(category.image);
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
