# Glow & Grace ✨

> Premium Salon Discovery & Booking Platform with Intelligent Recommendations

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

---

## 🎯 Overview

**Glow & Grace** is a sophisticated salon discovery and booking platform featuring:

- **Beautiful React UI** — Mobile-first responsive design with rose gold aesthetics
- **Smart Recommendation Engine** — ML-powered personalized salon suggestions
- **Seamless Booking Experience** — Intuitive appointment scheduling

The platform shows the right salon to the right customer at the right time.

---

## 📁 Project Structure

```
Task-2/
├── PLAN.md                 # Detailed implementation plan & model design
├── README.md               # This file
├── ui-react/               # Frontend Application
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .gitignore
│   ├── dist/               # Production build
│   └── src/
│       ├── main.jsx        # React entry point
│       ├── App.jsx         # Main application
│       └── styles.css      # Global styles
└── data/                   # (Future) Synthetic data
```

---

## ⚡ Quick Start

### Frontend (React)

```bash
# Navigate to UI directory
cd ui-react

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite 5** | Build Tool & Dev Server |
| **Pure CSS** | Styling with CSS Variables |

### Backend (Planned)
| Technology | Purpose |
|------------|---------|
| **Python** | ML Model & API |
| **Pandas** | Data Processing |
| **Scikit-learn** | Recommendation Engine |

---

## ✨ Features

### 📱 Responsive UI
- **Desktop**: Elegant sidebar navigation
- **Mobile**: Bottom navigation bar
- Fully responsive across all screen sizes

### 🏠 Pages

| Page | Description |
|------|-------------|
| **Home** | Personalized greetings, recommended salons, nearby listings |
| **Search** | Search with category filters (Hair, Nails, Spa, etc.) |
| **Shop Detail** | Salon gallery, stats, services menu, similar shops |
| **Booking** | Interactive calendar, time slots, payment summary |
| **My Bookings** | Upcoming appointments & booking history |
| **Profile** | User preferences, settings, account management |

### 🤖 Recommendation Engine

**Model: Customer Discovery & Recommendation**

| Feature | Description |
|---------|-------------|
| Distance Score | Closer salons rank higher |
| Service Match | Matches user's preferred services |
| Rating Weight | Higher-rated shops prioritized |
| Wait Time Penalty | Longer wait = lower score |
| Repeat Affinity | Loyal users get similar recommendations |

**Algorithm:**
```
Final Score = 
  (0.25 × distance_score) + 
  (0.25 × service_match) + 
  (0.20 × rating_weight) + 
  (0.15 × wait_time_penalty) + 
  (0.15 × repeat_affinity)
```

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| **Primary Color** | Rose Gold (`#8a4853`) |
| **Surface** | Cream (`#fffcf7`) |
| **Typography** | Manrope + Plus Jakarta Sans |
| **Icons** | Material Symbols Outlined |
| **Effects** | Glassmorphism, shadows, smooth transitions |

---

## 🚀 API Specification (Planned)

### Recommend Shops

```python
def recommend_shops(input_payload: dict) -> dict:
    """
    Input:
        {
            user_id: str,
            location: {"lat": float, "lng": float},
            service_preference: str,
            budget_range: str,
            time_slot: str
        }
    
    Output:
        {
            "recommendedShops": [
                {"shopId": "123", "score": 0.91},
                {"shopId": "456", "score": 0.86}
            ],
            "confidence": 0.88
        }
    """
```

---

## 📊 Data Model (Planned)

### Synthetic Datasets
| Dataset | Records | Description |
|---------|---------|-------------|
| Users | 1,000 | Age, preferences, budget, time slots |
| Shops | 200 | Rating, price, wait time, services |
| Bookings | 5,000-10,000 | User-shop interactions |

---

## 📈 Revenue Impact

- 📈 Higher booking conversion
- 🔄 Better repeat rate
- 💰 Higher average revenue per user
- 📉 Reduced churn
- 🎯 Smart promotion targeting

---

## 🎭 User Experience

- Smooth page transitions with animations
- Toast notifications for confirmations
- Interactive hover and press effects
- Slide-in mobile menu
- Category chips for quick filtering
- Glassmorphism and shadow effects

---

## 🔧 Customization

The UI uses CSS variables for easy theming:

```css
:root {
  --primary: #8a4853;
  --surface: #fffcf7;
  --on-surface-variant: #5f5f5f;
  /* ... more variables */
}
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Team

Built with 💜 for the modern beauty enthusiast

---

<div align="center">
  <p><strong>Glow & Grace</strong> — Your Digital Beauty Concierge</p>
  <p>Smart Discovery • Premium Experience • Seamless Booking</p>
</div>
