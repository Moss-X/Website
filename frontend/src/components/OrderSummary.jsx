import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { Link } from "react-router-dom";
import { MoveRight, MapPin, User } from "lucide-react";
import axios from "../lib/axios";
import { useState, useEffect } from "react";
import ShippingAddressForm from "./ShippingAddressForm";
import { toast } from "react-hot-toast";

const OrderSummary = () => {
  const {
    total,
    subtotal,
    coupon,
    isCouponApplied,
    cart,
    shippingAddress,
    setShippingAddress,
  } = useCartStore();
  const { user } = useUserStore();
  const [razorpayKey, setRazorpayKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("address");
  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const response = await axios.get("/payments/razorpay-key");
        setRazorpayKey(response.data.key);
      } catch (error) {
        console.error("Error fetching Razorpay key:", error);
      }
    };
    fetchRazorpayKey();
  }, []);

  const canProceedToCheckout = () => {
    if (!user) return false;
    if (!shippingAddress) return false;
    return true;
  };

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    setShowAddressForm(false);
    setCheckoutStep("payment");
  };

  const handlePayment = async () => {
    if (!razorpayKey) {
      console.error("Razorpay key not loaded");
      return;
    }

    if (!user) {
      toast.error("Please login to proceed with checkout");
      return;
    }

    if (!shippingAddress) {
      setShowAddressForm(true);
      setCheckoutStep("address");
      return;
    }

    setLoading(true);
    try {
      const transformed = cart.map((item) => {
        if (item.type === "bundle")
          return { ...item, price: item.discountedPrice };
        if (item.type === "collection")
          return { ...item, price: item.totalPrice };
        return item;
      });

      const orderResponse = await axios.post(
        "/payments/create-razorpay-order",
        {
          products: transformed,
          couponCode: coupon ? coupon.code : null,
          shippingAddress: shippingAddress,
        }
      );

      const { orderId, amount, currency } = orderResponse.data;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: razorpayKey,
          amount: amount,
          currency: currency,
          name: "Moss X Store",
          description: "Purchase from Moss X",
          order_id: orderId,
          handler: async (response) => {
            try {
              const verifyResponse = await axios.post(
                "/payments/verify-razorpay-payment",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }
              );

              if (verifyResponse.data.success) {
                window.location.href = `/purchase-success?order_id=${verifyResponse.data.orderId}`;
              } else {
                window.location.href =
                  "/purchase-cancel?reason=verification_failed";
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
              window.location.href = "/purchase-cancel?reason=verify_error";
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            email: user.email || "customer@example.com",
            contact: shippingAddress.phone,
          },
          theme: {
            color: "#10b981",
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error("Error creating order:", error);
      setLoading(false);
    }
  };

  const renderCheckoutButton = () => {
    if (!user) {
      return (
        <Link
          to="/login"
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-hidden focus:ring-4 focus:ring-emerald-300 transition-colors"
        >
          <User className="w-4 h-4 mr-2" />
          Login to Checkout
        </Link>
      );
    }

    if (!shippingAddress) {
      return (
        <button
          onClick={() => setShowAddressForm(true)}
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-hidden focus:ring-4 focus:ring-emerald-300 transition-colors"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Add Shipping Address
        </button>
      );
    }

    return (
      <motion.button
        className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-hidden focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: loading ? 1 : 1.05 }}
        whileTap={{ scale: loading ? 1 : 0.95 }}
        onClick={handlePayment}
        disabled={loading || !razorpayKey}
      >
        {loading ? "Processing..." : "Proceed to Checkout"}
      </motion.button>
    );
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-xs sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      {shippingAddress && (
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-white">
                {shippingAddress.fullName}
              </p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && (
                <p>{shippingAddress.addressLine2}</p>
              )}
              <p>
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
              <p className="text-emerald-400">{shippingAddress.phone}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ₹{formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -₹{formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ₹{formattedTotal}
            </dd>
          </dl>
        </div>

        {renderCheckoutButton()}

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>

      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Shipping Address
              </h3>
              <button
                onClick={() => setShowAddressForm(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <ShippingAddressForm
                onAddressSubmit={handleAddressSubmit}
                isCheckout={true}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default OrderSummary;
