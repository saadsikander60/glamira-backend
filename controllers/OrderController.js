import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
export const createOrder = async (req, res) => {
  try {
    const { paymentMethod, shippingAddress } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let itemsTotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`,
        });
      }

      itemsTotal += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Delivery Charges
    const customerCity = shippingAddress.city.toLowerCase();

    let deliveryCharge;
    let deliveryArea;

    if (customerCity === "ajman") {
      deliveryCharge = Number(process.env.AJMAN_DELIVERY_CHARGE);
      deliveryArea = "AJMAN";
    } else {
      deliveryCharge = Number(process.env.OUTSIDE_DELIVERY_CHARGE);
      deliveryArea = "OUTSIDE";
    }

    const totalAmount = itemsTotal + deliveryCharge;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,

      itemsTotal,
      deliveryCharge,
      deliveryArea,

      totalAmount,
      currency: process.env.CURRENCY,

      paymentMethod,
      shippingAddress,
    });


    // Reduce Stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }


    // Empty Cart After Order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );


    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const ownerId =
      order.user && typeof order.user === "object" && order.user._id
        ? order.user._id.toString()
        : order.user?.toString();

    const isOwner = ownerId === req.user._id.toString();
    const isAdminUser = req.user.role === "ADMIN";

    if (!isOwner && !isAdminUser) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = req.body.status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};