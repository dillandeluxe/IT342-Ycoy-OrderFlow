package com.example.orderflowmobile.api



import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

// These data classes perfectly match your Spring Boot DTOs!
data class LoginRequest(val email: String, val password: String)
data class RegisterRequest(
    val email: String,
    val password: String,
    val fullName: String,
    val role: String = "BUYER"
)
data class AuthResponse(val message: String?, val error: String?)

interface AuthApi {
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>
}