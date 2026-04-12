package com.example.orderflowmobile

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.orderflowmobile.api.RegisterRequest
import com.example.orderflowmobile.api.ApiClient
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
        // NEW: Grab the Confirm Password field from the XML
        val etConfirmPassword = findViewById<EditText>(R.id.etConfirmPassword)

        val btnRegister = findViewById<Button>(R.id.btnRegister)
        val tvMessage = findViewById<TextView>(R.id.tvMessage)
        val tvGoToLogin = findViewById<TextView>(R.id.tvGoToLogin)

        // Navigate to Login screen when clicked
        tvGoToLogin.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
        }

        btnRegister.setOnClickListener {
            val name = etFullName.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()
            // NEW: Get the text from Confirm Password
            val confirmPassword = etConfirmPassword.text.toString().trim()

            // 1. Validate all inputs are filled
            if (name.isEmpty() || email.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
                tvMessage.text = "Please fill in all fields"
                tvMessage.setTextColor(android.graphics.Color.RED)
                return@setOnClickListener
            }

            // 2. NEW: Validate that the passwords match exactly!
            if (password != confirmPassword) {
                tvMessage.text = "Passwords do not match!"
                tvMessage.setTextColor(android.graphics.Color.RED)
                return@setOnClickListener
            }

            // Optional: Check password length for better security
            if (password.length < 6) {
                tvMessage.text = "Password must be at least 6 characters"
                tvMessage.setTextColor(android.graphics.Color.RED)
                return@setOnClickListener
            }

            // 3. Send to backend using Coroutines
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

                            // Automatically redirect to Login screen
                            val intent = Intent(this@RegisterActivity, LoginActivity::class.java)
                            startActivity(intent)
                            finish()
                        } else {
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