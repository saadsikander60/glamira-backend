import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";


export const getDashboardStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();


    // Lifetime Sales (without delivery charges)
    const lifetimeSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$itemsTotal",
          },
        },
      },
    ]);


    const totalSales =
      lifetimeSales.length > 0
        ? lifetimeSales[0].totalSales
        : 0;



    // Current Month
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );


    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,

          sales: {
            $sum: "$itemsTotal",
          },

          orders: {
            $sum: 1,
          },
        },
      },
    ]);


    const currentMonthSales =
      monthlyStats.length > 0
        ? monthlyStats[0].sales
        : 0;


    const currentMonthOrders =
      monthlyStats.length > 0
        ? monthlyStats[0].orders
        : 0;



    // Yearly Stats
    const startOfYear = new Date(
      now.getFullYear(),
      0,
      1
    );


    const yearlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lte: now,
          },
        },
      },
      {
        $group: {
          _id: null,

          sales: {
            $sum: "$itemsTotal",
          },

          orders: {
            $sum: 1,
          },
        },
      },
    ]);



    const yearlySales =
      yearlyStats.length > 0
        ? yearlyStats[0].sales
        : 0;


    const yearlyOrders =
      yearlyStats.length > 0
        ? yearlyStats[0].orders
        : 0;



    // Monthly Sales Chart Data
    const monthlySalesChart = await Order.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
            year: {
              $year: "$createdAt",
            },
          },

          sales: {
            $sum: "$itemsTotal",
          },

          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);



    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);



    return res.status(200).json({

      success: true,

      stats: {

        totalUsers,

        totalProducts,

        totalOrders,

        totalSales,

        currentMonthSales,

        currentMonthOrders,

        yearlySales,

        yearlyOrders,

        currency: process.env.CURRENCY || "AED",

      },


      monthlySalesChart,

      recentOrders,

    });


  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};