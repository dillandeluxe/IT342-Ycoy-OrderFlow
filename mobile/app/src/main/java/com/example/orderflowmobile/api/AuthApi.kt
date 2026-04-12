package com.example.orderflowmobile.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

data class LoginRequest(val email: String, val password: String)

data class RegisterRequest(
    val email: String,
    val password: String,
    val fullName: String,
    val role: String = "BUYER"
)

// Used for Registration (since it just returns a success message)
data class AuthResponse(val message: String?, val error: String?)

// NEW: Used specifically for Login to catch the token and role!
data class LoginResponse(
    val message: String,
    val token: String,
    val role: String,
    val userId: Long,
    val restaurantName: String?
)

interface AuthApi {

    // UPDATE: Make sure this returns LoginResponse now!
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>
}