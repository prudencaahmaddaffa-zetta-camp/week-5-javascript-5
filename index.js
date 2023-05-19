const express = require('express');
const basicAuth = require('express-basic-auth');

const app = express();
app.use(express.json());

// Define your book purchasing route with Basic Authentication
app.post(
  '/purchase/book',
  basicAuth({ users: { username: 'password' } }),
  async (req, res) => {
    const {
      bookTitle,
      bookAuthor,
      bookPrice,
      discountPercentage,
      taxPercentage,
      stockAmount,
      purchasedAmount,
      creditTerm,
      additionalPrices,
    } = req.body;

    try {
      const termPrices = await calculateTermPrices(
        bookPrice,
        discountPercentage,
        taxPercentage,
        stockAmount,
        purchasedAmount,
        creditTerm,
        additionalPrices
      );

      // Calculations for total price
      let totalPrice = 0;
      for (let i = 0; i < purchasedAmount; i++) {
        totalPrice += termPrices[i];
      }

      // Prepare response
      const response = {
        bookTitle,
        bookAuthor,
        totalPrice,
        termPrices,
        discountPercentage,
        taxPercentage,
        stockAmount,
        purchasedAmount,
        creditTerm,
      };

      // Send response
      res.status(200).json(response);
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: 'An error occurred' });
    }
  }
);

// Asynchronous function to calculate term prices
async function calculateTermPrices(
  bookPrice,
  discountPercentage,
  taxPercentage,
  stockAmount,
  purchasedAmount,
  creditTerm,
  additionalPrices
) {
  const termPrices = [];
  let remainingStock = stockAmount;

  for (let i = 0; i < creditTerm; i++) {
    if (remainingStock === 0 || i >= purchasedAmount) {
      termPrices.push(0);
      continue;
    }

    const discountAmount = bookPrice * (discountPercentage / 100);
    const priceAfterDiscount = bookPrice - discountAmount;
    const taxAmount = priceAfterDiscount * (taxPercentage / 100);
    let priceAfterTax = priceAfterDiscount + taxAmount;

    // Add additional price for certain terms
    if (additionalPrices[i]) {
      priceAfterTax += additionalPrices[i];
    }

    termPrices.push(priceAfterTax);
    remainingStock--;
  }

  return termPrices;
}

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
