import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { formatPrice } from "../utils/formatters";
import { discountService } from "../../api/discount";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartId, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [userDiscounts, setUserDiscounts] = useState([]);
  const [selectedChip, setSelectedChip] = useState(null);

  const [formData, setFormData] = useState({
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    contactEmail: user?.email || "",
    contactPhone: "",
    sameAsBilling: true,
  });

  if (!cartItems.length) {
    navigate("/cart");
    return null;
  }

  // Fetch user's discount codes
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        // Only fetch discounts if user is logged in
        if (user) {
          const response = await discountService.getUserDiscounts();
          setUserDiscounts(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch discount codes:", error);
        setUserDiscounts([]);
      }
    };

    fetchDiscounts();
  }, [user]);

  const handleAddressChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
      billingAddress:
        prev.sameAsBilling && type === "shippingAddress"
          ? {
              ...prev.billingAddress,
              [field]: value,
            }
          : prev.billingAddress,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      sameAsBilling: checked,
      billingAddress: checked
        ? prev.shippingAddress
        : {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
    }));
  };

  const validateForm = () => {
    const errors = [];
    const { shippingAddress, billingAddress, contactEmail, contactPhone } =
      formData;

    // Validate shipping address
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode ||
      !shippingAddress.country
    ) {
      errors.push("All shipping address fields are required");
    }

    // Validate billing address if different
    if (!formData.sameAsBilling) {
      if (
        !billingAddress.street ||
        !billingAddress.city ||
        !billingAddress.state ||
        !billingAddress.zipCode ||
        !billingAddress.country
      ) {
        errors.push("All billing address fields are required");
      }
    }

    // Validate contact information
    if (!contactEmail || !/\S+@\S+\.\S+/.test(contactEmail)) {
      errors.push("Valid email is required");
    }
    if (!contactPhone || !/^\+?[\d\s-]{10,}$/.test(contactPhone)) {
      errors.push("Valid phone number is required");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        cartId,
        userId: user?.id,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.sameAsBilling
          ? formData.shippingAddress
          : formData.billingAddress,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        discountCode: appliedDiscount?.code,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      clearCart();
      navigate("/order-success", {
        state: {
          orderId: data.data.order.id,
          orderDetails: data.data.order,
        },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    try {
      setDiscountLoading(true);
      setDiscountError(null);
      const response = await discountService.validateCode(discountCode);

      if (response.code === 200) {
        setAppliedDiscount(response.data);
        // Show success message
        setDiscountError(null);
      }
    } catch (error) {
      setDiscountError(error.message);
      setAppliedDiscount(null);
    } finally {
      setDiscountLoading(false);
    }
  };

  const calculateTotal = () => {
    let total = cartTotal;
    if (appliedDiscount) {
      if (appliedDiscount.discountType === "PERCENTAGE") {
        total = total * (1 - appliedDiscount.discountValue / 100);
      } else {
        total = total - appliedDiscount.discountValue;
      }
    }
    return Math.max(total, 0);
  };

  const handleChipClick = (discount) => {
    setSelectedChip(discount.id);
    setDiscountCode(discount.code);
    // Optionally auto-apply the discount
    // handleApplyDiscount();
  };

  // Only render discount chips if user is logged in
  const renderDiscountChips = () => {
    if (!user) {
      return (
        <p className="text-sm text-gray-600 mb-2">
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Log in
          </Link>{" "}
          to see your available discount codes
        </p>
      );
    }

    if (userDiscounts.length === 0) {
      return (
        <p className="text-sm text-gray-600 mb-2">
          No discount codes available
        </p>
      );
    }

    return (
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Available Discounts:</p>
        <div className="flex flex-wrap gap-2">
          {userDiscounts.map((discount) => (
            <button
              key={discount.id}
              onClick={() => handleChipClick(discount)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${
                  selectedChip === discount.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {discount.code}
              {discount.discountType === "PERCENTAGE" && (
                <span> ({discount.discountValue}% off)</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Street
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress.street}
                    onChange={(e) =>
                      handleAddressChange(
                        "shippingAddress",
                        "street",
                        e.target.value
                      )
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* Add other shipping address fields similarly */}
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={formData.sameAsBilling}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Billing address same as shipping
                </label>
              </div>

              {!formData.sameAsBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Add billing address fields */}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactPhone: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 text-white rounded-md ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading
                ? "Processing..."
                : `Pay ${formatPrice(calculateTotal())}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  ${formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}

            <div className="border-t pt-4">
              {/* Available Discount Chips */}
              {renderDiscountChips()}

              {/* Discount Input Section */}
              <div className="space-y-2 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value);
                      setSelectedChip(null); // Clear selected chip when typing
                    }}
                    placeholder="Enter discount code"
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={discountLoading || appliedDiscount}
                  />
                  {!appliedDiscount ? (
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={discountLoading || !discountCode.trim()}
                      className={`px-4 py-2 rounded-md ${
                        discountLoading || !discountCode.trim()
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {discountLoading ? "Applying..." : "Apply"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedDiscount(null);
                        setDiscountCode("");
                        setSelectedChip(null);
                      }}
                      className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Additional info for selected discount */}
                {selectedChip && (
                  <div className="text-sm text-gray-600">
                    {userDiscounts.find((d) => d.id === selectedChip)
                      ?.minPurchase && (
                      <p>
                        Minimum purchase: $
                        {formatPrice(
                          userDiscounts.find((d) => d.id === selectedChip)
                            .minPurchase
                        )}
                      </p>
                    )}
                    {userDiscounts.find((d) => d.id === selectedChip)
                      ?.endDate && (
                      <p>
                        Valid until:{" "}
                        {new Date(
                          userDiscounts.find(
                            (d) => d.id === selectedChip
                          ).endDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {discountError && (
                  <p className="text-red-500 text-sm">{discountError}</p>
                )}

                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Discount ({appliedDiscount.code})
                      {appliedDiscount.discountType === "PERCENTAGE"
                        ? ` (${appliedDiscount.discountValue}% off)`
                        : ""}
                    </span>
                    <span>
                      -$
                      {formatPrice(
                        appliedDiscount.discountType === "PERCENTAGE"
                          ? (cartTotal * appliedDiscount.discountValue) / 100
                          : appliedDiscount.discountValue
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>${formatPrice(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
