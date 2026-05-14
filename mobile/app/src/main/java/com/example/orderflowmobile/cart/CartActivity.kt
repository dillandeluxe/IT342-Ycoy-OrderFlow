package com.example.orderflowmobile.cart

import android.app.AlertDialog
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.orderflowmobile.R
import com.example.orderflowmobile.core.ApiClient
import com.example.orderflowmobile.core.SharedPreferencesManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class CartActivity : AppCompatActivity() {

    private lateinit var rvCartItems: RecyclerView
    private lateinit var tvTotalPrice: TextView
    private lateinit var btnCheckout: Button
    private lateinit var cartAdapter: CartAdapter
    private var cartItems: List<CartItem> = listOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cart)

        rvCartItems = findViewById(R.id.rvCartItems)
        tvTotalPrice = findViewById(R.id.tvTotalPrice)
        btnCheckout = findViewById(R.id.btnCheckout)

        rvCartItems.layoutManager = LinearLayoutManager(this)
        cartAdapter = CartAdapter(cartItems) { item ->
            removeFromCart(item)
        }
        rvCartItems.adapter = cartAdapter

        loadCart()

        // -----------------------------------------
        // CHECKOUT BUTTON LOGIC WITH CONFIRMATION
        // -----------------------------------------
        btnCheckout.setOnClickListener {
            // 1. Double check the cart isn't empty
            if (cartItems.isEmpty()) {
                Toast.makeText(this@CartActivity, "Your cart is empty!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // 2. Show the Confirmation Pop-up
            AlertDialog.Builder(this@CartActivity)
                .setTitle("Confirm Checkout")
                .setMessage("Are you sure you want to place this order using Cash on Delivery?")
                .setCancelable(false) // Forces them to click a button
                .setPositiveButton("Place Order") { _, _ ->

                    // 3. Disable button to prevent double-clicks
                    btnCheckout.isEnabled = false
                    btnCheckout.text = "Processing..."

                    val userId = SharedPreferencesManager.userId
                    if (userId == -1L) {
                        Toast.makeText(this@CartActivity, "Not logged in. Please log in again.", Toast.LENGTH_LONG).show()
                        btnCheckout.isEnabled = true
                        btnCheckout.text = "Proceed to Checkout"
                        return@setPositiveButton
                    }

                    android.util.Log.d("CHECKOUT", "Attempting checkout for userId=$userId")

                    CoroutineScope(Dispatchers.IO).launch {
                        try {
                            val response = ApiClient.transactionService.checkout(userId, "CASH")
                            val errorBody = response.errorBody()?.string() ?: "no body"
                            android.util.Log.d("CHECKOUT", "HTTP ${response.code()} - $errorBody")

                            withContext(Dispatchers.Main) {
                                if (response.isSuccessful && response.body() != null) {
                                    val orderNumber = response.body()!!.orderNumber
                                    Toast.makeText(this@CartActivity, "Success! Receipt: $orderNumber", Toast.LENGTH_LONG).show()

                                    // Reload cart (it will be empty now)
                                    loadCart()
                                    btnCheckout.text = "Proceed to Checkout"
                                } else {
                                    // Show REAL error: HTTP code + server message
                                    Toast.makeText(
                                        this@CartActivity,
                                        "Checkout failed [HTTP ${response.code()}]: $errorBody",
                                        Toast.LENGTH_LONG
                                    ).show()
                                    btnCheckout.isEnabled = true
                                    btnCheckout.text = "Proceed to Checkout"
                                }
                            }
                        } catch (e: Exception) {
                            android.util.Log.e("CHECKOUT", "Exception: ${e.javaClass.simpleName}: ${e.message}", e)
                            withContext(Dispatchers.Main) {
                                // Show REAL exception type + message
                                Toast.makeText(
                                    this@CartActivity,
                                    "Error: ${e.javaClass.simpleName}: ${e.message}",
                                    Toast.LENGTH_LONG
                                ).show()
                                btnCheckout.isEnabled = true
                                btnCheckout.text = "Proceed to Checkout"
                            }
                        }
                    }
                }
                .setNegativeButton("Cancel") { dialog, _ ->
                    // 4. Do nothing, just close the dialog
                    dialog.dismiss()
                }
                .show()
        }
    }

    private fun loadCart() {
        val userId = SharedPreferencesManager.userId
        if (userId == -1L) return

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.cartService.getCart(userId)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        cartItems = response.body()!!
                        cartAdapter.updateData(cartItems)
                        updateTotalPrice()

                        // Automatically enable/disable checkout button based on cart contents
                        btnCheckout.isEnabled = cartItems.isNotEmpty()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@CartActivity, "Error loading cart", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun removeFromCart(item: CartItem) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = ApiClient.cartService.removeFromCart(item.id)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        loadCart()
                    } else {
                        Toast.makeText(this@CartActivity, "Failed to remove item", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@CartActivity, "Error removing item", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun updateTotalPrice() {
        var total = 0.0
        for (item in cartItems) {
            total += item.foodItem.price * item.quantity
        }
        tvTotalPrice.text = "₱%.2f".format(total)
    }
}