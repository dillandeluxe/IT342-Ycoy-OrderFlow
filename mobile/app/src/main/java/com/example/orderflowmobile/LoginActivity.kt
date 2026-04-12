package com.example.orderflowmobile

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.orderflowmobile.api.ApiClient
import com.example.orderflowmobile.api.LoginRequest
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val etEmail = findViewById<EditText>(R.id.etLoginEmail)
        val etPassword = findViewById<EditText>(R.id.etLoginPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val tvMessage = findViewById<TextView>(R.id.tvLoginMessage)
        val tvGoToRegister = findViewById<TextView>(R.id.tvGoToRegister)

        // Navigate to Register Screen when clicked
        tvGoToRegister.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }

        // Handle Login API call
        btnLogin.setOnClickListener {
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                tvMessage.text = "Please enter email and password"
                tvMessage.setTextColor(android.graphics.Color.RED)
                return@setOnClickListener
            }

            btnLogin.isEnabled = false
            tvMessage.text = "Logging in..."
            tvMessage.setTextColor(android.graphics.Color.GRAY)

            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val request = LoginRequest(email, password)
                    val response = ApiClient.authService.login(request)

                    withContext(Dispatchers.Main) {
                        btnLogin.isEnabled = true

                        // Check if successful AND if the body contains data
                        if (response.isSuccessful && response.body() != null) {
                            val loginData = response.body()!!

                            // ==========================================
                            // NEW: THE ROLE GATEKEEPER
                            // ==========================================
                            if (loginData.role.uppercase() == "SELLER") {
                                tvMessage.text = "Sellers must use the Web Dashboard. Please log in on the Web."
                                tvMessage.setTextColor(android.graphics.Color.RED)
                                return@withContext // Stops the code here, preventing them from entering!
                            }

                            // If they are a BUYER, proceed normally
                            tvMessage.text = "Login Successful!"
                            tvMessage.setTextColor(android.graphics.Color.GREEN)
                            Toast.makeText(this@LoginActivity, "Welcome!", Toast.LENGTH_SHORT).show()

                            // Navigate to Dashboard
                            val intent = Intent(this@LoginActivity, DashboardActivity::class.java)
                            intent.putExtra("USER_EMAIL", email) // Pass their email to the dashboard
                            startActivity(intent)
                            finish()

                        } else {
                            tvMessage.text = "Invalid email or password"
                            tvMessage.setTextColor(android.graphics.Color.RED)
                        }
                    }
                } catch (e: Exception) {
                    withContext(Dispatchers.Main) {
                        btnLogin.isEnabled = true
                        tvMessage.text = "Network Error: Cannot connect to server"
                        tvMessage.setTextColor(android.graphics.Color.RED)
                    }
                }
            }
        }
    }
}