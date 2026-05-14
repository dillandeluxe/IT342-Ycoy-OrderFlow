package com.example.orderflowmobile.cart

import retrofit2.Response
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface CartApi {
    @GET("api/cart/{buyerId}")
    suspend fun getCart(@Path("buyerId") buyerId: Long): Response<List<CartItem>>

    @POST("api/cart/{buyerId}/add/{foodItemId}")
    suspend fun addToCart(
        @Path("buyerId") buyerId: Long,
        @Path("foodItemId") foodItemId: Long
    ): Response<CartItem>

    @DELETE("api/cart/{cartItemId}")
    suspend fun removeFromCart(@Path("cartItemId") cartItemId: Long): Response<Void>
}