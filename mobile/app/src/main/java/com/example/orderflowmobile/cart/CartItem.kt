package com.example.orderflowmobile.cart

data class CartItem(
    val id: Long,
    val quantity: Int,
    val foodItem: CartFoodItem 
)

data class CartFoodItem(
    val id: Long,
    val name: String,
    val price: Double,
    val imageUrl: String?
)