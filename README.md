# week-5-javascript-5

example usage :

curl -X POST -u username:password -H "Content-Type: application/json" -d '{
"bookTitle": "The Great Gatsby",
"bookAuthor": "F. Scott Fitzgerald",
"bookPrice": 25.99,
"discountPercentage": 10,
"taxPercentage": 8,
"stockAmount": 5,
"purchasedAmount": 3,
"creditTerm": 6,
"additionalPrices": [2.5, 0, 1.75, 0, 0, 3.25]
}' http://localhost:3000/purchase/book
