package com.example.orderflowmobile

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.orderflowmobile.api.RegisterRequest
import edu.cit.ycoy.orderflowmobile.api.ApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class RegisterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val etFullName = findViewById<EditText>(R.id.etFullName)
        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnRegister = findViewById<Button>(R.id.btnRegister)
        val tvMessage = findViewById<TextView>(R.id.tvMessage)

        btnRegister.setOnClickListener {
            val name = etFullName.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            // 1. Validate inputs
            if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
                tvMessage.text = "Please fill in all fields"
                tvMessage.setTextColor(android.graphics.Color.RED)
                return@setOnClickListener
            }

            // 2. Send to backend using Coroutines (background thread)
            btnRegister.isEnabled = false
            tvMessage.text = "Registering..."
            tvMessage.setTextColor(android.graphics.Color.GRAY)

            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val request = RegisterRequest(email, password, name, "BUYER")
                    val response = ApiClient.authService.register(request)

                    withContext(Dispatchers.Main) {
                        btnRegister.isEnabled = true
                        if (response.isSuccessful) {
                            tvMessage.text = "Success! " + response.body()?.message
                            tvMessage.setTextColor(android.graphics.Color.GREEN)
                            Toast.makeText(this@RegisterActivity, "Registration Successful!", Toast.LENGTH_SHORT).show()
                            // Later, we will redirect to Login screen here
                        } else {
                            // Extract error message from your Spring Boot backend
                            val errorMsg = response.errorBody()?.string() ?: "Registration failed"
                            tvMessage.text = errorMsg
                            tvMessage.setTextColor(android.graphics.Color.RED)
                        }
                    }
                } catch (e: Exception) {
                    withContext(Dispatchers.Main) {
                        btnRegister.isEnabled = true
                        tvMessage.text = "Network Error: Is Spring Boot running?"
                        tvMessage.setTextColor(android.graphics.Color.RED)
                    }
                }
            }
        }
    }
}