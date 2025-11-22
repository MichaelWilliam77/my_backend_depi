const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000; // تعديل بسيط: ياخد البورت من Vercel أو 3000 لو محلي

// إعدادات أساسية عشان نقبل البيانات من الموبايل
app.use(cors());
app.use(bodyParser.json());

// دي داتابيز وهمية (مصفوفة في الذاكرة) بنخزن فيها اليوزرز
// ملحوظة: لو السيرفر عمل ريستارت (وده بيحصل كتير في Vercel)، البيانات دي هتتمسح
let users = [];

// رسالة ترحيب للصفحة الرئيسية عشان تتأكد إن السيرفر شغال
app.get('/', (req, res) => {
    res.send('<h1>🚀 Rental App Server is Running!</h1>');
});

// ==========================================
// 1. API إنشاء حساب جديد (Register)
// ==========================================
app.post('/api/v1/auth/signup', (req, res) => {
    const { name, email, password, phone } = req.body;

    console.log("📥 طلب تسجيل جديد:", req.body);

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: "بيانات ناقصة! تأكد من الاسم، الإيميل، والباسورد" });
    }

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "هذا البريد الإلكتروني مستخدم بالفعل" });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        phone
    };
    users.push(newUser);

    console.log("✅ تم إنشاء الحساب:", newUser.email);

    res.status(200).json({
        message: "تم إنشاء الحساب بنجاح",
        user: newUser,
        token: "fake-jwt-token-" + Date.now()
    });
});

// ==========================================
// 2. API تسجيل الدخول (Login)
// ==========================================
app.post('/api/v1/auth/signin', (req, res) => {
    const { email, password } = req.body;

    console.log("📥 محاولة دخول:", email);

    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
        return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    console.log("✅ دخول ناجح:", user.email);

    res.status(200).json({
        message: "تم تسجيل الدخول بنجاح",
        user: user,
        token: "fake-jwt-token-" + Date.now()
    });
});

// تشغيل السيرفر (للعمل محلياً)
app.listen(PORT, () => {
    console.log(`🚀 السيرفر شغال دلوقتي يا بطل!`);
    console.log(`👉 محلياً: http://localhost:${PORT}`);
});

// ==========================================
// ⚠️ هام جداً لـ Vercel
// ==========================================
module.exports = app;