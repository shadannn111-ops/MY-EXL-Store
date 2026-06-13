const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ========== DATA SETUP ==========
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
    console.log('📁 Created data directory');
}

let users = [];
let orders = [];

try {
    if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        console.log(`📚 Loaded ${users.length} users`);
    } else {
        users = [{
            id: "1",
            name: "Demo User",
            email: "demo@exl.com",
            password: "password123",
            mobile: "9876543210",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            address: "123, Andheri East, Mumbai",
            createdAt: new Date().toISOString()
        }];
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('📝 Created demo user');
    }
} catch (error) {
    users = [];
}

try {
    if (fs.existsSync(ORDERS_FILE)) {
        orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
        console.log(`📦 Loaded ${orders.length} orders`);
    } else {
        fs.writeFileSync(ORDERS_FILE, '[]');
    }
} catch (error) {
    orders = [];
}

function saveUsers() { 
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); 
}

function saveOrders() { 
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2)); 
}

// ========== HELPER FUNCTION: Format Price with Commas ==========
function formatPrice(price) {
    return price.toLocaleString('en-IN');
}

// ========== 50 PRODUCTS WITH FORMATTED PRICES ==========
const products = [
    { id: 1, name: "Samsung Galaxy S23", category: "mobiles", price: 64999, original: 74999, priceFormatted: "64,999", originalFormatted: "74,999", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400", brand: "Samsung" },
    { id: 2, name: "iPhone 15 Pro", category: "mobiles", price: 134900, original: 149900, priceFormatted: "1,34,900", originalFormatted: "1,49,900", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", brand: "Apple" },
    { id: 3, name: "OnePlus 12", category: "mobiles", price: 64999, original: 69999, priceFormatted: "64,999", originalFormatted: "69,999", image: "https://tse1.mm.bing.net/th/id/OIP.uN5mBwzrbp8e59oxl33mbwHaHa?pid=Api&P=0&h=180", brand: "OnePlus" },
    { id: 4, name: "Google Pixel 8", category: "mobiles", price: 75999, original: 79999, priceFormatted: "75,999", originalFormatted: "79,999", image: "https://tse1.mm.bing.net/th/id/OIP.DFRyNvBSaG6iHW_CthuARgHaJN?pid=Api&P=0&h=180", brand: "Google" },
    { id: 5, name: "Xiaomi 14 Pro", category: "mobiles", price: 59999, original: 64999, priceFormatted: "59,999", originalFormatted: "64,999", image: "https://tse1.mm.bing.net/th/id/OIP.9WQgckQPsksVfP_R0S2lkAHaHa?pid=Api&P=0&h=180", brand: "Xiaomi" },
    { id: 6, name: "Nothing Phone 2", category: "mobiles", price: 44999, original: 49999, priceFormatted: "44,999", originalFormatted: "49,999", image: "https://tse3.mm.bing.net/th/id/OIP.BRZ91pZ1ZyRCiL2Sg-OBnAHaHT?pid=Api&P=0&h=180", brand: "Nothing" },
    { id: 7, name: "Motorola Edge 40", category: "mobiles", price: 29999, original: 34999, priceFormatted: "29,999", originalFormatted: "34,999", image: "https://tse1.mm.bing.net/th/id/OIP.xR3AraGJhNK29ZD1zRKMfwHaJe?pid=Api&P=0&h=180", brand: "Motorola" },
    { id: 8, name: "Vivo X100 Pro", category: "mobiles", price: 54999, original: 59999, priceFormatted: "54,999", originalFormatted: "59,999", image: "https://tse4.mm.bing.net/th/id/OIP.h-QayYc0R-9ujHYNtGJQzwHaHa?pid=Api&P=0&h=180", brand: "Vivo" },
    { id: 9, name: "Oppo Find N3", category: "mobiles", price: 84999, original: 89999, priceFormatted: "84,999", originalFormatted: "89,999", image: "https://tse2.mm.bing.net/th/id/OIP.papsa7K-Z0VjTmZhJlG8OQHaFj?pid=Api&P=0&h=180", brand: "Oppo" },
    { id: 10, name: "Realme GT 5", category: "mobiles", price: 42999, original: 47999, priceFormatted: "42,999", originalFormatted: "47,999", image: "https://tse4.mm.bing.net/th/id/OIP.4TikGkme-9T7OBGLeh4e8AHaEK?pid=Api&P=0&h=180", brand: "Realme" },
    { id: 11, name: "Levi's Men Jeans", category: "fashion", price: 1799, original: 2999, priceFormatted: "1,799", originalFormatted: "2,999", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", brand: "Levi's" },
    { id: 12, name: "US Polo T-Shirt", category: "fashion", price: 899, original: 1499, priceFormatted: "899", originalFormatted: "1,499", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", brand: "US Polo" },
    { id: 13, name: "Peter England Shirt", category: "fashion", price: 1299, original: 2199, priceFormatted: "1,299", originalFormatted: "2,199", image: "https://tse4.mm.bing.net/th/id/OIP.K6yIjQ3H1_fpgMOSqv1A8wHaI0?pid=Api&P=0&h=180", brand: "Peter England" },
    { id: 14, name: "Nike Air Max", category: "fashion", price: 5499, original: 6999, priceFormatted: "5,499", originalFormatted: "6,999", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", brand: "Nike" },
    { id: 15, name: "Adidas Ultraboost", category: "fashion", price: 4999, original: 5999, priceFormatted: "4,999", originalFormatted: "5,999", image: "https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=400", brand: "Adidas" },
    { id: 16, name: "Women's Silk Saree", category: "fashion", price: 1999, original: 3999, priceFormatted: "1,999", originalFormatted: "3,999", image: "https://tse1.mm.bing.net/th/id/OIP.bDdt99F4ISg5BLh8j-DtYQHaEG?pid=Api&P=0&h=180", brand: "Manyavar" },
    { id: 17, name: "Women's Cotton Kurti", category: "fashion", price: 799, original: 1499, priceFormatted: "799", originalFormatted: "1,499", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400", brand: "Biba" },
    { id: 18, name: "Women's Jeans", category: "fashion", price: 1299, original: 2299, priceFormatted: "1,299", originalFormatted: "2,299", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", brand: "Levi's" },
    { id: 19, name: "Women's Top", category: "fashion", price: 599, original: 999, priceFormatted: "599", originalFormatted: "999", image: "https://tse1.mm.bing.net/th/id/OIP.Rh3r1dJeBEufalm7tEi9dgHaJ3?pid=Api&P=0&h=180", brand: "Zara" },
    { id: 20, name: "Leather Handbag", category: "fashion", price: 1499, original: 2999, priceFormatted: "1,499", originalFormatted: "2,999", image: "https://tse1.mm.bing.net/th/id/OIP.iN4j03FZ4LMx-F7VuiYX_gHaIt?pid=Api&P=0&h=180", brand: "Lavie" },
    { id: 21, name: "Face Wash", category: "beauty", price: 299, original: 499, priceFormatted: "299", originalFormatted: "499", image: "https://tse3.mm.bing.net/th/id/OIP.lKzch_efmRiGGrOhUeZ3gwAAAA?pid=Api&P=0&h=180", brand: "Garnier" },
    { id: 22, name: "Moisturizer Cream", category: "beauty", price: 449, original: 699, priceFormatted: "449", originalFormatted: "699", image: "https://tse3.mm.bing.net/th/id/OIP.o2axbiDudmn8E3oaE00o4wHaHa?pid=Api&P=0&h=180", brand: "Cetaphil" },
    { id: 23, name: "Face Cream", category: "beauty", price: 199, original: 299, priceFormatted: "199", originalFormatted: "299", image: "https://tse4.mm.bing.net/th/id/OIP.AhOYp8J0sQI_usVaT_6QjAHaHa?pid=Api&P=0&h=180", brand: "Nivea" },
    { id: 24, name: "Lip Balm", category: "beauty", price: 149, original: 249, priceFormatted: "149", originalFormatted: "249", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", brand: "Garnier" },
    { id: 25, name: "Sunscreen", category: "beauty", price: 399, original: 599, priceFormatted: "399", originalFormatted: "599", image: "https://tse4.mm.bing.net/th/id/OIP.LPoYZsMNXSigB8jVjrVFmwHaHa?pid=Api&P=0&h=180", brand: "Lakme" },
    { id: 26, name: "Foundation", category: "beauty", price: 599, original: 899, priceFormatted: "599", originalFormatted: "899", image: "https://tse4.mm.bing.net/th/id/OIP.enSJxVuzzCpUngmwqt0S8QHaHa?pid=Api&P=0&h=180", brand: "Lakme" },
    { id: 27, name: "Lipstick", category: "beauty", price: 449, original: 699, priceFormatted: "449", originalFormatted: "699", image: "https://tse3.mm.bing.net/th/id/OIP.MiRZCoSobyK_8a7XiBfaXwHaHa?pid=Api&P=0&h=180", brand: "Maybelline" },
    { id: 28, name: "Shampoo", category: "beauty", price: 399, original: 599, priceFormatted: "399", originalFormatted: "599", image: "https://tse4.mm.bing.net/th/id/OIP.AWk68Vn5fdXOIJlAKGtSHQHaHa?pid=Api&P=0&h=180", brand: "L'Oreal" },
    { id: 29, name: "Body Wash", category: "beauty", price: 349, original: 499, priceFormatted: "349", originalFormatted: "499", image: "https://tse1.mm.bing.net/th/id/OIP.wZw3AKKyU1SODz9SIN85PwHaHa?pid=Api&P=0&h=180", brand: "Dove" },
    { id: 30, name: "Face Serum", category: "beauty", price: 799, original: 1299, priceFormatted: "799", originalFormatted: "1,299", image: "https://tse1.mm.bing.net/th/id/OIP.C0PBrn5UwT8-dSKuI_-lvwHaHa?pid=Api&P=0&h=180", brand: "Ponds" },
    { id: 31, name: "Wireless Headphones", category: "gadgets", price: 1999, original: 3999, priceFormatted: "1,999", originalFormatted: "3,999", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", brand: "boAt" },
    { id: 32, name: "Smart Watch", category: "gadgets", price: 2999, original: 5999, priceFormatted: "2,999", originalFormatted: "5,999", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", brand: "Noise" },
    { id: 33, name: "Bluetooth Speaker", category: "gadgets", price: 3499, original: 5999, priceFormatted: "3,499", originalFormatted: "5,999", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", brand: "JBL" },
    { id: 34, name: "Power Bank", category: "gadgets", price: 1499, original: 2499, priceFormatted: "1,499", originalFormatted: "2,499", image: "https://tse4.mm.bing.net/th/id/OIP.RppXV3LogGQlg5iD5Zf6MwHaHa?pid=Api&P=0&h=180", brand: "Mi" },
    { id: 35, name: "USB Pendrive", category: "gadgets", price: 599, original: 999, priceFormatted: "599", originalFormatted: "999", image: "https://tse1.mm.bing.net/th/id/OIP.UnCleF5pUmCbak151C334QHaGN?pid=Api&P=0&h=180", brand: "SanDisk" },
    { id: 36, name: "Wireless Mouse", category: "gadgets", price: 799, original: 1299, priceFormatted: "799", originalFormatted: "1,299", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400", brand: "Logitech" },
    { id: 37, name: "Gaming Keyboard", category: "gadgets", price: 2999, original: 4999, priceFormatted: "2,999", originalFormatted: "4,999", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400", brand: "Zebronics" },
    { id: 38, name: "Printer", category: "gadgets", price: 7499, original: 9999, priceFormatted: "7,499", originalFormatted: "9,999", image: "https://tse1.mm.bing.net/th/id/OIP.hS1pr69DlFY9LTrZGrCN-QHaEG?pid=Api&P=0&h=180", brand: "Canon" },
    { id: 39, name: "Action Camera", category: "gadgets", price: 29999, original: 35999, priceFormatted: "29,999", originalFormatted: "35,999", image: "https://tse3.mm.bing.net/th/id/OIP.1vM7T3nEYdWT4ydyzZ5zygHaFW?pid=Api&P=0&h=180", brand: "GoPro" },
    { id: 40, name: "Drone", category: "gadgets", price: 54999, original: 59999, priceFormatted: "54,999", originalFormatted: "59,999", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400", brand: "DJI" },
    { id: 41, name: "Mixer Grinder", category: "appliances", price: 2799, original: 3999, priceFormatted: "2,799", originalFormatted: "3,999", image: "https://tse3.mm.bing.net/th/id/OIP.-1JGM3VPa-miUs142z5nzAHaEl?pid=Api&P=0&h=180", brand: "Bajaj" },
    { id: 42, name: "Pressure Cooker", category: "appliances", price: 1999, original: 2999, priceFormatted: "1,999", originalFormatted: "2,999", image: "https://tse1.mm.bing.net/th/id/OIP.fuZipKghSKgoiNtc7Z761QHaE0?pid=Api&P=0&h=180", brand: "Prestige" },
    { id: 43, name: "Ceiling Fan", category: "appliances", price: 2299, original: 3499, priceFormatted: "2,299", originalFormatted: "3,499", image: "https://tse2.mm.bing.net/th/id/OIP.-m7_WU8ieo86ZaCgV1W7SQHaHa?pid=Api&P=0&h=180", brand: "Havells" },
    { id: 44, name: "Refrigerator", category: "appliances", price: 25999, original: 29999, priceFormatted: "25,999", originalFormatted: "29,999", image: "https://tse2.mm.bing.net/th/id/OIP.c88-Ou9xYiWWpK00F5wIYgHaE6?pid=Api&P=0&h=180", brand: "LG" },
    { id: 45, name: "Washing Machine", category: "appliances", price: 15999, original: 21999, priceFormatted: "15,999", originalFormatted: "21,999", image: "https://tse1.mm.bing.net/th/id/OIP.ZcuAqIbXzF3Ke21tJbjrQAHaLH?pid=Api&P=0&h=180", brand: "Samsung" },
    { id: 46, name: "Microwave Oven", category: "appliances", price: 8999, original: 12999, priceFormatted: "8,999", originalFormatted: "12,999", image: "https://tse4.mm.bing.net/th/id/OIP.1766BbOQEA4H8BkjbHQK5AHaEt?pid=Api&P=0&h=180", brand: "IFB" },
    { id: 47, name: "Steam Iron", category: "appliances", price: 1299, original: 1999, priceFormatted: "1,299", originalFormatted: "1,999", image: "https://tse3.mm.bing.net/th/id/OIP.flGGNA0c8UWs8vGNFOyJ3AHaGt?pid=Api&P=0&h=180", brand: "Philips" },
    { id: 48, name: "Water Purifier", category: "appliances", price: 10999, original: 14999, priceFormatted: "10,999", originalFormatted: "14,999", image: "https://tse2.mm.bing.net/th/id/OIP._S7uwy4fOIoQDGRc2aUaIgHaHa?pid=Api&P=0&h=180", brand: "Kent" },
    { id: 49, name: "Toaster", category: "appliances", price: 1999, original: 2999, priceFormatted: "1,999", originalFormatted: "2,999", image: "https://tse4.mm.bing.net/th/id/OIP.XEZVtWGQmc8_qTxzeoixTQHaGk?pid=Api&P=0&h=180", brand: "Morphy" },
    { id: 50, name: "Vacuum Cleaner", category: "appliances", price: 3999, original: 5999, priceFormatted: "3,999", originalFormatted: "5,999", image: "https://tse2.mm.bing.net/th/id/OIP.PKRlGhHpdo75TUJ25UgxgAHaF_?pid=Api&P=0&h=180", brand: "Eureka" }
];

// ========== USER API ==========

app.post('/api/register', (req, res) => {
    const { name, email, password, mobile, city, state, pincode, address } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email and password required' });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const newUser = {
        id: Date.now().toString(),
        name, email, password,
        mobile: mobile || '',
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        pincode: pincode || '400001',
        address: address || '',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers();
    
    res.json({ success: true, message: 'Registration successful', user: { id: newUser.id, email, name, mobile: newUser.mobile, city: newUser.city, state: newUser.state, pincode: newUser.pincode } });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: { 
                id: user.id, 
                email: user.email, 
                name: user.name,
                mobile: user.mobile,
                city: user.city,
                state: user.state,
                pincode: user.pincode,
                address: user.address
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
});

// Products API - Returns formatted prices
app.get('/api/products', (req, res) => {
    res.json({ success: true, products: products });
});

// ========== CHECKOUT API ==========
app.post('/api/checkout', (req, res) => {
    const { userId, paymentMethod, shippingAddress, items, total, orderNumber, userEmail } = req.body;
    const user = users.find(u => u.id == userId || u.email === userEmail);
    
    const transactionId = 'TXN' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
    const finalOrderNumber = orderNumber || 'ORD' + Date.now().toString().slice(-8);
    
    const order = {
        id: orders.length + 1,
        orderNumber: finalOrderNumber,
        userId: userId || 'guest',
        userEmail: userEmail,
        userName: user ? user.name : 'Guest',
        userCity: user ? user.city : 'Unknown',
        userMobile: user ? user.mobile : 'Not provided',
        userAddress: user ? user.address : '',
        items: items,
        total: total,
        paymentMethod: paymentMethod,
        shippingAddress: shippingAddress,
        transactionId: transactionId,
        status: 'paid',
        createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    saveOrders();
    
    console.log(`\n🛍️ NEW ORDER PLACED: ${finalOrderNumber} | Total: ₹${total.toLocaleString('en-IN')} | Payment: ${paymentMethod}`);
    
    res.json({ success: true, message: 'Payment successful', order: order, transactionId: transactionId });
});

// ========== INVOICE API ==========
app.get('/api/invoice/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const order = orders.find(o => o.orderNumber === orderId);
    
    if (order) {
        const subtotal = order.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        
        res.json({ 
            success: true, 
            invoice: {
                orderNumber: order.orderNumber,
                orderDate: order.createdAt,
                paymentMethod: order.paymentMethod,
                transactionId: order.transactionId,
                customerName: order.userName,
                customerEmail: order.userEmail,
                customerMobile: order.userMobile,
                customerAddress: order.userAddress,
                shippingAddress: order.shippingAddress,
                items: order.items,
                subtotal: subtotal,
                shipping: 0,
                tax: 0,
                total: order.total,
                status: order.status
            }
        });
    } else {
        res.status(404).json({ success: false, message: 'Order not found' });
    }
});

// ========== GET ALL ORDERS ==========
app.get('/api/orders', (req, res) => {
    res.json({ success: true, orders: orders, total: orders.length });
});

// ========== STATUS API ==========
app.get('/api/status', (req, res) => {
    res.json({ 
        success: true, 
        status: 'running', 
        message: 'EXL Store API is working!',
        stats: {
            users: users.length,
            orders: orders.length,
            products: products.length
        }
    });
});

// ========== SERVER START ==========
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     ✅ EXL STORE BACKEND IS RUNNING!                             ║
║                                                                  ║
║     📍 Server: http://localhost:${PORT}                             ║
║     📱 Open: http://localhost:${PORT}/login.html                   ║
║                                                                  ║
║     👤 Demo Login: demo@exl.com / password123                    ║
║                                                                  ║
║                                                                  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    `);
    
    setTimeout(() => {
        const platform = process.platform;
        let command = platform === 'win32' ? 'start' : (platform === 'darwin' ? 'open' : 'xdg-open');
        exec(`${command} http://localhost:${PORT}/login.html`, (error) => {
            if (error) console.log('Please open browser manually: http://localhost:3000/login.html');
        });
    }, 1500);
});