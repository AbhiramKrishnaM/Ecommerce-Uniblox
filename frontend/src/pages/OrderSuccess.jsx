import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { formatPrice } from "../utils/formatters";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    if (!orderDetails) {
      navigate("/");
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Order #{orderDetails.id}
            </h2>
            <p className="text-sm text-gray-500">
              Placed on {new Date(orderDetails.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {orderDetails.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity} × ${formatPrice(item.unitPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${formatPrice(item.quantity * item.unitPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <address className="not-italic text-gray-600">
                <p>{orderDetails.shippingAddress.street}</p>
                <p>
                  {orderDetails.shippingAddress.city},{" "}
                  {orderDetails.shippingAddress.state}{" "}
                  {orderDetails.shippingAddress.zipCode}
                </p>
                <p>{orderDetails.shippingAddress.country}</p>
              </address>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="text-gray-600">
                <p>{orderDetails.contactEmail}</p>
                <p>{orderDetails.contactPhone}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${formatPrice(orderDetails.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              {orderDetails.discountCode && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({orderDetails.discountCode})</span>
                  <span>-${formatPrice(orderDetails.discountAmount || 0)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${formatPrice(orderDetails.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Order
          </button>
        </div>

        {/* Email Notice */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            A confirmation email has been sent to {orderDetails.contactEmail}.
            <br />
            Please check your inbox for order details and tracking information.
          </p>
        </div>
      </div>
    </div>
  );
}
