package com.example.orderflowmobile.transaction

import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.orderflowmobile.R
import com.example.orderflowmobile.core.ApiClient
import com.example.orderflowmobile.core.SharedPreferencesManager
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.util.Locale

class OrderHistoryActivity : AppCompatActivity() {

    private val api: TransactionApi get() = ApiClient.transactionService

    private var allOrders: List<OrderReceipt> = emptyList()
    private var activeFilter = "ALL"
    private lateinit var adapter: OrderReceiptAdapter
    private lateinit var rvOrders: RecyclerView
    private lateinit var layoutEmpty: View
    private lateinit var tvEmptyTitle: TextView
    private lateinit var tvOrderCount: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_order_history)

        rvOrders     = findViewById(R.id.rvOrders)
        layoutEmpty  = findViewById(R.id.layoutEmpty)
        tvEmptyTitle = findViewById(R.id.tvEmptyTitle)
        tvOrderCount = findViewById(R.id.tvOrderCount)

        adapter = OrderReceiptAdapter(emptyList())
        rvOrders.layoutManager = LinearLayoutManager(this)
        rvOrders.adapter = adapter

        findViewById<View>(R.id.btnBack).setOnClickListener { finish() }
        setupFilterChips()

        // userId is Long (not nullable) — default is -1L when not set
        val userId = SharedPreferencesManager.userId
        Log.d("OrderHistory", "Loading orders for userId=$userId")

        if (userId == -1L) {
            Toast.makeText(this, "Please log in first", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        loadOrders(userId)
    }

    private fun setupFilterChips() {
        val layout  = findViewById<LinearLayout>(R.id.layoutFilterChips)
        val filters = listOf("ALL", "PENDING", "COMPLETED", "CANCELLED")
        val labels  = listOf("🗂 All", "⏳ Pending", "✓ Completed", "✕ Cancelled")

        filters.forEachIndexed { i, filter ->
            val btn = Button(this).apply {
                text      = labels[i]
                isAllCaps = false
                textSize  = 12f
                val params = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.setMargins(0, 0, 10, 0) }
                layoutParams = params
                setPadding(36, 16, 36, 16)
                setOnClickListener { applyFilter(filter) }
            }
            layout.addView(btn)
        }
        refreshChipStyles()
    }

    private fun applyFilter(filter: String) {
        activeFilter = filter
        refreshChipStyles()
        showFiltered()
    }

    private fun refreshChipStyles() {
        val layout  = findViewById<LinearLayout>(R.id.layoutFilterChips)
        val filters = listOf("ALL", "PENDING", "COMPLETED", "CANCELLED")
        for (i in 0 until layout.childCount) {
            val btn = layout.getChildAt(i) as? Button ?: continue
            if (filters[i] == activeFilter) {
                btn.setBackgroundColor(Color.parseColor("#E63946"))
                btn.setTextColor(Color.WHITE)
            } else {
                btn.setBackgroundColor(Color.parseColor("#F1F5F9"))
                btn.setTextColor(Color.parseColor("#64748B"))
            }
        }
    }

    private fun loadOrders(userId: Long) {
        val progress = findViewById<ProgressBar>(R.id.progressOrders)
        progress.visibility    = View.VISIBLE
        rvOrders.visibility    = View.GONE
        layoutEmpty.visibility = View.GONE

        lifecycleScope.launch {
            try {
                Log.d("OrderHistory", "Calling API: /api/transactions/buyer/$userId")
                val res = api.getOrderHistory(userId)
                progress.visibility = View.GONE

                Log.d("OrderHistory", "Response code: ${res.code()}")
                Log.d("OrderHistory", "Response body: ${res.body()}")
                Log.d("OrderHistory", "Error body: ${res.errorBody()?.string()}")

                if (res.isSuccessful) {
                    allOrders = res.body() ?: emptyList()
                    Log.d("OrderHistory", "Orders loaded: ${allOrders.size}")
                    showFiltered()
                } else {
                    Toast.makeText(
                        this@OrderHistoryActivity,
                        "Server error ${res.code()}",
                        Toast.LENGTH_LONG
                    ).show()
                    showEmpty("Could not load orders (${res.code()})")
                }
            } catch (e: Exception) {
                progress.visibility = View.GONE
                Log.e("OrderHistory", "Exception: ${e.message}", e)
                Toast.makeText(
                    this@OrderHistoryActivity,
                    "Network error: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
                showEmpty("Network error")
            }
        }
    }

    private fun showFiltered() {
        val filtered = if (activeFilter == "ALL") allOrders
                       else allOrders.filter { it.status.uppercase() == activeFilter }

        val pending   = allOrders.count { it.status.uppercase() == "PENDING" }
        val completed = allOrders.count { it.status.uppercase() == "COMPLETED" }
        val cancelled = allOrders.count { it.status.uppercase() == "CANCELLED" }
        tvOrderCount.text = "${allOrders.size} total  •  ⏳$pending  ✓$completed  ✕$cancelled"

        if (filtered.isEmpty()) {
            val label = when (activeFilter) {
                "PENDING"   -> "No pending orders"
                "COMPLETED" -> "No completed orders"
                "CANCELLED" -> "No cancelled orders"
                else        -> "No orders yet!"
            }
            showEmpty(label)
        } else {
            layoutEmpty.visibility = View.GONE
            rvOrders.visibility    = View.VISIBLE
            adapter.updateData(filtered)
        }
    }

    private fun showEmpty(title: String) {
        rvOrders.visibility    = View.GONE
        layoutEmpty.visibility = View.VISIBLE
        tvEmptyTitle.text      = title
    }
}

// ── Adapter ────────────────────────────────────────────────────────────────────
class OrderReceiptAdapter(private var orders: List<OrderReceipt>) :
    RecyclerView.Adapter<OrderReceiptAdapter.ViewHolder>() {

    private val peso = NumberFormat.getCurrencyInstance(Locale("en", "PH"))

    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvOrderNumber: TextView = view.findViewById(R.id.tvOrderNumber)
        val tvStatus: TextView      = view.findViewById(R.id.tvOrderStatus)
        val tvPickup: TextView      = view.findViewById(R.id.tvOrderPickup)
        val tvTotal: TextView       = view.findViewById(R.id.tvOrderTotal)
        val tvItems: TextView       = view.findViewById(R.id.tvOrderItemsPreview)
        val tvDate: TextView        = view.findViewById(R.id.tvOrderDate)
    }

    fun updateData(newOrders: List<OrderReceipt>) {
        orders = newOrders
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_order_receipt, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val order = orders[position]
        holder.tvOrderNumber.text = order.orderNumber
        holder.tvPickup.text      = order.shippingAddress
        holder.tvTotal.text       = peso.format(order.totalAmount)
        holder.tvDate.text        = order.createdAt.take(10)

        val count   = order.orderItems.size
        val preview = if (count == 0) "No items"
            else order.orderItems.take(2).joinToString(", ") { it.productName } +
                    if (count > 2) " +${count - 2} more" else ""
        holder.tvItems.text = preview

        val (bg, fg, label) = when (order.status.uppercase()) {
            "COMPLETED" -> Triple("#DCFCE7", "#16A34A", "✓ Completed")
            "CANCELLED" -> Triple("#FEE2E2", "#DC2626", "✕ Cancelled")
            else        -> Triple("#FEF9C3", "#CA8A04", "⏳ Pending")
        }
        holder.tvStatus.text = label
        holder.tvStatus.setTextColor(Color.parseColor(fg))
        holder.tvStatus.setBackgroundColor(Color.parseColor(bg))
    }

    override fun getItemCount() = orders.size
}
