package com.example.orderflowmobile.transaction

import retrofit2.Response
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

// This matches the exact JSON response your Spring Boot Order entity sends back
data class OrderResponse(
    val id: Long,
    val orderNumber: String,
    val totalAmount: Double,
    val status: String
)

interface TransactionApi {
    // Calls the @PostMapping we just made in Spring Boot
    @POST("api/transactions/checkout/{buyerId}")
    suspend fun checkout(
        @Path("buyerId") buyerId: Long,
        @Query("paymentMethod") paymentMethod: String = "CASH" // Our Mock payment method!
    ): Response<OrderResponse>
}