package com.example.orderflowmobile.api

import com.example.orderflowmobile.models.FoodItem
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Header

interface FoodApi {
    @GET("api/food")
    suspend fun getFoodItems(
        @Header("Authorization") token: String
    ): Response<List<FoodItem>>
}