import Order from '../models/order.model.js'
import Product from '../models/product.model.js'
import User from '../models/user.model.js'

export const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments()
  const totalProducts = await Product.countDocuments()

  const salesData = await Order.aggregate([
    { $match: { status: { $ne: 'pending' } } },
    {
      $group: {
        _id: null, // it groups all documents together,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ])

  const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 }

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue
  }
}

// Best sellers by revenue: explode each paid order into its line items, total them per item, rank
// them, and only then join the products collection for the top few (so the $lookup runs on `limit`
// documents rather than on every line item).
export const getTopProducts = async (limit = 5) => {
  return Order.aggregate([
    { $match: { status: 'paid' } },
    { $unwind: '$products' },
    {
      $group: {
        _id: { itemType: '$products.itemType', product: '$products.product' },
        name: { $first: '$products.name' },
        unitsSold: { $sum: '$products.quantity' },
        revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } },
        orders: { $addToSet: '$_id' }
      }
    },
    { $addFields: { orders: { $size: '$orders' } } },
    { $sort: { revenue: -1, _id: 1 } },
    { $limit: limit },
    // Bundles and collections have their own collections, so only plain products resolve here.
    { $lookup: { from: 'products', localField: '_id.product', foreignField: '_id', as: 'details' } },
    {
      $project: {
        _id: '$_id.product',
        itemType: '$_id.itemType',
        name: 1,
        unitsSold: 1,
        revenue: 1,
        orders: 1,
        image: { $arrayElemAt: ['$details.image', 0] },
        category: { $arrayElemAt: ['$details.category', 0] }
      }
    }
  ])
}

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          },
          status: { $ne: 'pending' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // example of dailySalesData
    // [
    // 	{
    // 		_id: "2024-08-18",
    // 		sales: 12,
    // 		revenue: 1450.75
    // 	},
    // ]

    const dateArray = getDatesInRange(startDate, endDate)
    // console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]

    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date)

      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0
      }
    })
  } catch (error) {
    throw error
  }
}

function getDatesInRange(startDate, endDate) {
  const dates = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}
