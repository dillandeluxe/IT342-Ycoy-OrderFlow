package com.example.orderflowmobile.transaction

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

// Matches the checkout response
data class OrderResponse(
    val id: Long,
    val orderNumber: String,
    val totalAmount: Double,
    val status: String
)

// Matches each item inside an order receipt
data class OrderItemDto(
    val productName: String,
    val quantity: Int,
    val price: Double
)

// Full order receipt returned from /buyer/{id}
data class OrderReceipt(
    val id: Long,
    val orderNumber: String,
    val totalAmount: Double,
    val status: String,
    val shippingAddress: String,
    val createdAt: String,
    val orderItems: List<OrderItemDto>
)

interface TransactionApi {

    // POST checkout
    @POST("api/transactions/checkout/{buyerId}")
    suspend fun checkout(
        @Path("buyerId") buyerId: Long,
        @Query("paymentMethod") paymentMethod: String = "CASH"
    ): Response<OrderResponse>

    // GET buyer order history
    @GET("api/transactions/buyer/{buyerId}")
    suspend fun getOrderHistory(
        @Path("buyerId") buyerId: Long
    ): Response<List<OrderReceipt>>
}