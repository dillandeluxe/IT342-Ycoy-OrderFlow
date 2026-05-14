package com.example.orderflowmobile.cart

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.orderflowmobile.R

class CartAdapter(
    private var cartItems: List<CartItem>,
    private val onRemoveClick: (CartItem) -> Unit
) : RecyclerView.Adapter<CartAdapter.CartViewHolder>() {

    class CartViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvCartFoodName: TextView = view.findViewById(R.id.tvCartFoodName)
        val tvCartFoodPrice: TextView = view.findViewById(R.id.tvCartFoodPrice)
        val btnRemoveCartItem: ImageButton = view.findViewById(R.id.btnRemoveCartItem)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CartViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_cart, parent, false)
        return CartViewHolder(view)
    }

    override fun onBindViewHolder(holder: CartViewHolder, position: Int) {
        val item = cartItems[position]
        holder.tvCartFoodName.text = item.foodItem.name
        holder.tvCartFoodPrice.text = "₱${item.foodItem.price} x ${item.quantity}"

        holder.btnRemoveCartItem.setOnClickListener {
            onRemoveClick(item)
        }
    }

    override fun getItemCount(): Int = cartItems.size

    fun updateData(newItems: List<CartItem>) {
        cartItems = newItems
        notifyDataSetChanged()
    }
}