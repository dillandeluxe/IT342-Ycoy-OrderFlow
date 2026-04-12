package com.example.orderflowmobile.models

data class FoodItem(
    val id: Long,
    val name: String,
    val description: String,
    val price: Double,
    val stock: Int,
    val category: String?,
    val imageUrl: String?,
    val seller: Seller?
)

data class Seller(
    val id: Long,
    val fullName: String?,
    val restaurantName: String?
)