# Customer Discovery & Recommendation Model - Implementation Plan

## Project Overview
**Model Name:** Model 4 Document - Customer Discovery & Recommendation Model  
**Owner:** AI / ML Engineer  
**Role:** Data schema + API wiring only  
**Objective:** Show the right salon to the right customer at the right time.

---

## Why This Model Exists

**Problems Without This Model:**
- Users scroll randomly
- No personalization
- Same shops shown to everyone
- Low repeat rate
- Poor conversion
- App becomes simple directory

**Benefits With This Model:**
- Improves booking conversion rate
- Increases repeat bookings
- Boosts average order value
- Improves user retention
- App becomes intelligent discovery engine

---

## Where This Model Is Used

1. **Home Page** — Ranking of nearby salons, "Recommended for You" section, smart sorting
2. **Shop Detail** — "You may also like", similar shops
3. **Post-Booking** — Rebook suggestion, service-based recommendation
4. **Push Notifications** — Personalized offers, time-based suggestions

---

## Model Objective

### Inputs
- User location
- Booking history
- Service preferences
- Budget range
- Time-of-day preference
- Past cancellations
- Ratings given
- Distance from shops
- Shop rating
- Shop price level
- Shop wait time
- Service availability

### Output Format
```json
{
  "recommendedShops": [
    { "shopId": "123", "score": 0.91 },
    { "shopId": "456", "score": 0.86 }
  ],
  "confidence": 0.88
}
```

---

## Important Note
- **No real user data available**
- Must design synthetic user behavior dataset
- Simulate preferences, repeat patterns, and realistic booking journeys
- Building personalization intelligence from scratch

---

## Expected Model Type (MVP)

### Phase 1 (Current)
- Content-based filtering
- Weighted scoring algorithm
- Basic collaborative filtering (optional)

### Phase 2 (Future)
- Matrix factorization
- Neural recommendation system
- Reinforcement learning ranking

> **Note:** Keep it interpretable and explainable

---

## Implementation Plan

### Phase 1: Data Simulation (Week 1)

#### 1.1 User Table (`data/user_synthetic.csv`)
| Column | Description |
|--------|-------------|
| user_id | Unique identifier |
| age_group | User's age category |
| preferred_service_type | Main service preference |
| avg_budget | Average spending range |
| preferred_time_slot | Morning/Afternoon/Evening/Weekend |
| repeat_user_flag | 0 or 1 |

**Target:** 1,000 synthetic users

#### 1.2 Shop Table (`data/shop_synthetic.csv`)
| Column | Description |
|--------|-------------|
| shop_id | Unique identifier |
| rating | 1-5 star rating |
| price_level | Budget/Moderate/Premium |
| avg_wait_time | Average waiting time in minutes |
| distance_km | Distance from user location |
| service_types_available | Comma-separated services |

**Target:** 200 synthetic shops

#### 1.3 Booking Table (`data/booking_synthetic.csv`)
| Column | Description |
|--------|-------------|
| booking_id | Unique identifier |
| user_id | Foreign key to users |
| shop_id | Foreign key to shops |
| service_type | Service booked |
| time_of_day | Booking time slot |
| rating_given | User's rating for the service |
| booking_date | Date of booking |

**Target:** 5,000–10,000 booking rows

#### 1.4 User Archetypes to Simulate
- **Budget-conscious users** — Prefer lower price_level shops
- **Premium preference users** — Prefer high-end shops
- **Quick-service seekers** — Prioritize low avg_wait_time
- **Weekend-only users** — Prefer weekend time slots
- **Distance-sensitive users** — Prioritize proximity
- **Repeat loyal users** — High repeat_user_flag, multiple bookings

---

### Phase 2: Feature Engineering

| Feature | Description | Influence on Ranking |
|---------|-------------|---------------------|
| `distance_score` | Closer distance = higher score | Users prefer nearby salons |
| `budget_match_score` | Shop price matches user budget | Avoids showing unaffordable shops |
| `service_preference_match` | Shop has user's preferred service | Increases relevance |
| `wait_time_penalty` | Long wait = lower score | Users prefer shorter wait times |
| `rating_weight` | Normalized shop star rating | Higher rated shops rank higher |
| `repeat_affinity_score` | Past booking frequency | Loyal users get similar shops |
| `time_preference_match` | Shop hours match user time slot | Improves booking likelihood |
| `popularity_index` | Booking volume of shop | Popular shops gain visibility |

---

### Phase 3: Ranking Algorithm (Week 3)

#### Algorithm Steps

**Step 1:** Create user preference vector from synthetic data
```
User Vector = [avg_budget, preferred_service_type, preferred_time_slot, repeat_user_flag]
```

**Step 2:** Create shop feature vector
```
Shop Vector = [price_level, rating, avg_wait_time, distance_km, service_types_available]
```

**Step 3:** Calculate similarity score using weighted scoring

**Final Score Formula:**
```
Final Score = 
  (w1 × distance_score) + 
  (w2 × service_match) + 
  (w3 × rating_weight) + 
  (w4 × wait_time_penalty) + 
  (w5 × repeat_affinity)
```

**Step 4:** Rank shops by score in descending order

**Weights (MVP Default):**
- w1 = 0.25 (distance_score)
- w2 = 0.25 (service_match)
- w3 = 0.20 (rating_weight)
- w4 = 0.15 (wait_time_penalty)
- w5 = 0.15 (repeat_affinity)

---

### Phase 4: Evaluation (Week 4)

#### Test Scenarios
1. **New user cold start** — First-time user with no booking history
2. **Repeat loyal user** — User with multiple bookings at same shop
3. **Budget user** — User with low avg_budget
4. **Premium user** — User with high spending preference
5. **Peak hour condition** — High-demand time slots

#### Evaluation Metrics
- **Precision@K** — Relevance of top-K recommendations
- **Recall@K** — Coverage of relevant shops in top-K
- **Ranking stability** — Consistency of rankings across runs
- **Simulated conversion uplift** — Expected booking rate improvement

---

## Deliverables

| File | Description | Location |
|------|-------------|----------|
| Synthetic User Data | 1,000 user records | `data/user_synthetic.csv` |
| Synthetic Shop Data | 200 shop records | `data/shop_synthetic.csv` |
| Synthetic Booking Data | 5,000-10,000 bookings | `data/booking_synthetic.csv` |
| Jupyter Notebook | Full pipeline | `notebooks/recommendation_model.ipynb` |
| Feature Explanation Doc | Feature rationale | `docs/feature_explanation.md` |
| Ranking Algorithm Doc | Algorithm documentation | `docs/ranking_algorithm.md` |
| API Function | Production-ready | `src/recommend_shops.py` |

### API Function Signature
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

## What NOT to Do
- ❌ Do not randomly rank by rating only
- ❌ Do not ignore cold start problem
- ❌ Do not overcomplicate initially
- ❌ Do not skip documentation

---

## Revenue Impact
- Higher booking conversion
- Better repeat rate
- Higher average revenue per user
- Reduced churn
- Smart promotion targeting

---

## Timeline

| Week | Task |
|------|------|
| Week 1 | Data simulation (3 CSV files, user archetypes) |
| Week 2 | Feature engineering (8 features, scoring logic) |
| Week 3 | Ranking algorithm (weighted scoring, API function) |
| Week 4 | Evaluation + documentation (metrics, docs) |

---

## Final Expectation
You are building the growth intelligence layer. This model decides:
- **Which shop appears first**
- **Which shop converts**
- **Which shop retains user**

Think like a:
- Product growth engineer
- Data scientist
- Recommendation system designer
