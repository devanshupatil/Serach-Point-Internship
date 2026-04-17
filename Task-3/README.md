# Smart Salon: Growth & Retention Intelligence Model

Welcome to the Task-3 repository! This directory contains the prototype for a Smart Salon Recommendation Engine. 

Instead of showing every user the exact same list of salons, this system acts as the "brain" behind the app, analyzing the user's spending habits, location, and past bookings to deliver a highly personalized **Top 10** ranking. This results in:
* Higher conversion rates
* Better user retention
* Smarter discovery

## 🚀 Getting Started

The code is written cleanly in **Node.js** with zero reliance on heavy third-party packages or complex machine learning frameworks. You only need Node installed on your computer to run it!

### 1. Generate the Synthetic Data
Because this is a prototype and we don't have real app users, we need to generate realistic fake users, shops, and booking histories to test our engine. 

Run the following command to securely generate the data:
```bash
node generate_data.js
```
*This places three CSV files inside the `data/` folder containing hundreds of synthetic profiles and bookings.*

### 2. Run the Recommendation API
To see the Engine actually run the algorithm and predict the best shops for a user:
```bash
node api.js
```
*This runs the `recommendShops()` function, processes the features like wait-time and budget, and outputs a ranked JSON array to your terminal.*

---

## 📁 Repository Structure

* `generate_data.js` — The script that generates realistic fake `users.csv`, `shops.csv`, and `bookings.csv`.
* `api.js` — The core logic containing the deterministic Content-Based Filtering algorithm. Use the exported `recommendShops(payload)` function to integrate this into your backend server.
* `Documentation.md` & `Documentation.pdf` — The deep-dive explanation detailing exactly how the feature weights are calculated, why certain metrics matter, and the limitations of the model.

## ⚙️ How the Math Works (Briefly)

The algorithm groups users into Personas (e.g., *Budget*, *Premium*, *Quick-Service*). 

Every shop is given a score for its distance, price, available services, wait time, and user rating. Depending on the user's Persona, the algorithm dynamically changes the weight of those scores. 
* Example: A **Premium** user heavily prioritizes Shop Rating over Wait Time. A **Quick-Service** user heavily prioritizes Wait Time over Shop Rating.
