import Product from "../models/Product.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";
import deleteCloudinaryImage from "../utils/deleteCloudinary.js";
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
    };

    if (productData.price !== undefined) {
      productData.price = Number(productData.price);
    }

    if (productData.stock !== undefined && productData.stock !== "") {
      productData.stock = Number(productData.stock);
    }

    if (req.file) {
      productData.image = req.file.path;
    }

    const product = await Product.create(productData);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search, category, categorySlug, minPrice, maxPrice } = req.query;

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Search by product name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category ID
    if (category) {
      filter.category = category;
    }

    // Filter by category slug
    if (categorySlug) {
      const foundCategory = await Category.findOne({
        slug: categorySlug.toLowerCase(),
        isActive: true,
      });

      if (!foundCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      filter.category = foundCategory._id;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const products = await Product.find(filter)
      .populate("category", "name slug image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug image",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = await Review.find({
      product: product._id,
    });

    const reviewsCount = reviews.length;

    const averageRating =
      reviewsCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount
        : 0;

    return res.status(200).json({
      success: true,
      product,
      rating: Number(averageRating.toFixed(1)),
      reviewsCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateData = {
      ...req.body,
    };

    if (updateData.price !== undefined && updateData.price !== "") {
      updateData.price = Number(updateData.price);
    }

    if (updateData.stock !== undefined && updateData.stock !== "") {
      updateData.stock = Number(updateData.stock);
    }

    if (req.file) {
      if (existingProduct.image) {
        await deleteCloudinaryImage(existingProduct.image);
      }

      updateData.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.image) {
      await deleteCloudinaryImage(product.image);
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
