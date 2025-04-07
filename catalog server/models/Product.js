const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_description: { type: String, required: true },
    creation_date: { type: Date, default: Date.now },
    status: { type: Boolean, default: true },
    current_stock_level: { type: Number, default: 0 },
    product_id: {
        type: Number,
        unique: true,
        required: true,
        validate: {
            validator: function (v) {
                console.log('Validating product_id:', v); // Log the value
                return true; // Always return true for now
            },
            message: 'product_id validation failed'
        }
    },
});

module.exports = mongoose.model('Product', productSchema);