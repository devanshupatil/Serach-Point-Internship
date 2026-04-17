# Smart Salon Recommendation Engine: Full Documentation

This document serves as the comprehensive guide for the Growth & Retention Intelligence Model designed for Task-3. It explains how synthetic data was created, why certain features are preferred by the recommendation algorithm, how the scoring calculates relevance, and the underlying assumptions of the model.

---

## 1. How Data Was Generated (`generate_data.js`)

Since real user behavior and booking history were not natively available, we simulated a realistic environment using a deterministic, weighted random generation algorithm in Node.js. The datasets are output locally as CSV files.

### Users (`users.csv`)
- **Quantity Generated:** 1,000 Users.
- **Methodology:** We randomly assigned users one of five distinct "Personas" to simulate realistic segments:
  - `Budget`: Lower average budgets, prefer haircuts/manicures.
  - `Premium`: High budgets, prefer luxury services like spa and coloring.
  - `Quick`: Prefer fast services and are highly sensitive to wait times.
  - `Weekend`: Strict preferences for weekend slots.
  - `Distance-sensitive`: Favor salons closer to their geographical location.

### Shops (`shops.csv`)
- **Quantity Generated:** 100 Salons.
- **Methodology:** Shops are randomly assigned a price level (1-3, acting like $, $$, $$$), a base rating between 3.0 and 5.0, a random average wait time (between 5 and 60 minutes), and a subset of available services (e.g., just Haircuts, or full suite including Spa and Coloring).

### Bookings (`bookings.csv`)
- **Quantity Generated:** 10,000 Bookings.
- **Methodology:** We sample a random user and match them to candidate shops based loosely on their Persona (e.g., Premium users naturally lean toward level 2 & 3 shops). We simulate dynamic distance bounds, add minor random noise to the shop's base rating to emulate realistic varying review scores, and record the appointment time slot.

---

## 2. Why Features Are Used (`api.js`)

The recommendation model evaluates shops based on a variety of features to ensure it shows the right shop to the right customer at the right time.

* **Distance ($f_{dist}$)**: Salons are deeply local businesses. We prioritize closer shops because excessive travel distance massively increases user churn. 
* **Budget Match ($f_{budget}$)**: Avoids recommending luxury spas to budget-conscious users, and simultaneously hides "cheap" low-quality solutions from users expecting premium experiences.
* **Service Match ($f_{serv}$)**: Acts as a hard relevance metric—if a shop doesn't offer a "Pedicure," it shouldn't show up for a user seeking one.
* **Rating & Popularity ($f_{rating}$)**: High-rated shops are universally preferred and yield higher lifetime value for the business. 
* **Wait Time Penalty ($f_{wait}$)**: Extended wait times negatively impact user retention, specifically for the "Quick-service" persona segments who value speed over aesthetic luxury.
* **Repeat Affinity ($f_{repeat}$)**: If the user previously booked a shop and gave it a strong rating (>4 stars), the shop receives a massive score boost. Repeat bookings are the cornerstone of retention.

---

## 3. How Scoring Works

The engine relies on **Weighted Content-Based Filtering**. It does not use opaque Machine Learning Black Boxes; it uses an interpretable linearly weighted scoring approach.

At scoring time, the Engine:
1. Iterates over every shop in the dataset.
2. Extracts a score normalized between `0.0` and `1.0` for each feature block:
   - *Example: A wait time of 0 mins scores `1.0`, a wait time of 60 mins scores `0.0`.*
3. Calculates the **Final Relevancy Score** using a dot product of the feature values against dynamically assigned weights ($w$).

### Dynamic Weights by Persona Example
The scoring rules change based on who the user is. 

$$SCORE = (w_{dist} \cdot f_{dist}) + (w_{budget} \cdot f_{budget}) + (w_{rating} \cdot f_{rating}) + ...$$

* **If the user is "Distance-Sensitive":** $w_{dist}$ is heavily increased to `0.5`, overshadowing ratings and wait times.
* **If the user is "Premium":** $w_{rating}$ is boosted to `0.3` and $w_{budget}$ is boosted to `0.3`, strongly favoring highly-rated, expensive shops.

The Top 10 shops with the highest calculated `$SCORE$` are returned as the `recommendedShops` array to be sent to the front-end UI.

---

## 4. Key Assumptions

1. **Static Pricing:** The model assumes price level categories (1, 2, 3) are sufficient to capture the budget preferences of the user. We assume a linear correlation between user Persona and comfortable price point.
2. **Cold Start Determinism:** When a user with absolutely no history joins the platform, the model assumes basic fallback weights leaning slightly toward distance and generic high ratings.
3. **Availability:** We assume `avg_wait_time` in real life would be provided in real-time by a live Queue or Scheduling system on the backend.
4. **Distance Simulation:** In real life, Distance is calculated using geospatial queries (like Haversine formula) using the user's phone GPS and the Salon's coordinate footprint. In our synthetic engine, distance is simulated pseudo-randomly to demonstrate the mathematical effect on the scoring function.
