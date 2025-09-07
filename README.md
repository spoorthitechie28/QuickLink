# Shorty - URL Shortener

Shorty is a sleek, modern, and user-friendly URL shortening web application. It allows users to convert long, cumbersome URLs into short, shareable links. You can also create **custom short URLs** and track the number of clicks.

---

## 🚀 Features

- Shorten long URLs instantly
- Create custom short URLs
- Track number of clicks on each link
- Copy links to clipboard easily
- Responsive design with Tailwind CSS
- Friendly 404 page for invalid URLs

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Frontend:** EJS templates, Tailwind CSS
- **Deployment:** Render

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/spoorthitechie28/Shorty.git
cd Shorty
````

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file** in the root directory with the following:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
BASE_URL=https://quicklink.onrender.com
```

4. **Run the app locally**

```bash
npm start
```

Visit `http://localhost:5000` in your browser.

---

## 📁 Project Structure

```
Shorty/
│
├─ index.js            # Main server file
├─ package.json        # Project dependencies
├─ .env                # Environment variables
├─ models/
│   └─ url.js          # Mongoose model for URLs
├─ routes/
│   └─ urls.js         # Express routes for URL shortening and redirect
├─ views/
│   ├─ index.ejs       # Main page template
│   └─ 404.ejs         # 404 Not Found page
└─ public/             # Static files (CSS, JS, images)
```

---

## ⚡ Usage

1. Open the homepage.
2. Paste your long URL.
3. (Optional) Enter a custom short name.
4. Click **Shorten URL**.
5. Copy the generated short link and share it anywhere.
6. Access short URLs to redirect to the original long URL.

---

## 💡 Notes

* Custom short names must be unique.
* Visiting a non-existent short URL will show a 404 page.
* The app tracks the number of clicks per short URL.

---

## 📝 License

This project is licensed under the MIT License.

---

**Enjoy using Shorty!** ✨ 

Do you want me to do that?
```
