package com.example.orderflowmobile.cart

import android.os.Bundle
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
    private lateinit var cartAdapter: CartAdapter
    private var cartItems: List<CartItem> = listOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cart)

        rvCartItems = findViewById(R.id.rvCartItems)
        tvTotalPrice = findViewById(R.id.tvTotalPrice)

        rvCartItems.layoutManager = LinearLayoutManager(this)
        cartAdapter = CartAdapter(cartItems) { item ->
            removeFromCart(item)
        }
        rvCartItems.adapter = cartAdapter

        loadCart()
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