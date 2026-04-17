# Smart Salon Recommendation Model: Ranking Algorithm

This document outlines the MVP ranking algorithm used to dynamically score and recommend salons for a given user. 

## High Level Approach
The model utilizes a **Weighted Scoring Pipeline (Content-Based Filtering)**. 

Since real historical matching data is sparse initially (cold-start), we calculate a deterministic final relevance score for every available shop nearby based on deterministic feature metrics. Shop scores are computed in real-time or near real-time.

## Input Vector Representation

### User Features ($U$)
- $U_{budget}$: Target spending (Float, derived from persona or history).
- $U_{services}$: Preferred services (List of strings).
- $U_{lat}, U_{lon}$: Current coordinates. (Simulated via relative distances).
- $U_{persona}$: Categorical segmentation (e.g., Budget, Premium, Quick).

### Shop Features ($S$)
- $S_{price}$: Price indicator (1, 2, 3).
- $S_{services}$: Available services (List).
- $S_{rating}$: Average user rating (0.0 - 5.0).
- $S_{wait}$: Current or average waiting time in minutes.
- $S_{dist}$: Distance to user in km.

## Feature Extraction (Scoring)

1. **Distance Score ($f_{dist}$)**
   $$f_{dist} = \max(0, 1 - \frac{S_{dist}}{MAX\_DIST})$$
   *(Assuming $MAX\_DIST$ is 20km for example)*

2. **Budget Score ($f_{budget}$)**
   $$f_{budget} = 1.0 - \frac{| U_{budget\_level} - S_{price} |}{2}$$
   *(Matches integer price levels 1,2,3 to the user's budget bandwidth)*

3. **Service Match ($f_{serv}$)**
   $$f_{serv} = \begin{cases} 1.0 & \text{if preferred service } \in S_{services} \\ 0.0 & \text{otherwise} \end{cases}$$

4. **Rating Normalized ($f_{rating}$)**
   $$f_{rating} = \frac{S_{rating}}{5.0}$$

5. **Wait Time Penalty ($f_{wait}$)**
   $$f_{wait} = \max\left(0, 1 - \frac{S_{wait}}{60}\right)$$
   *(Assume anything over 60 mins is a 0 score)*

6. **Repeat Affinity Boost ($f_{repeat}$)**
   If user previously rated the shop > 3 stars, $f_{repeat} = 1.0$, else $0.0$.

## Weighted Scoring Engine

The Final Ranking Score ($SCORE$) is a dot product of the feature vector $F$ and weight vector $W$. The weights are dynamically assigned based on the user's Persona segment.

$$SCORE = \sum_{i=1}^{n} w_i \cdot f_i$$

### Dynamic Weights by Persona

| Feature / Persona | Budget Persona | Premium Persona | Quick-Service | Distance-Sensitive | New User (Cold) |
|---|---|---|---|---|---|
| $w_{dist}$ | 0.20 | 0.10 | 0.15 | **0.50** | 0.30 |
| $w_{budget}$ | **0.40** | **0.30** | 0.10 | 0.15 | 0.20 |
| $w_{serv}$ | 0.20 | 0.20 | 0.15 | 0.15 | 0.20 |
| $w_{rating}$ | 0.10 | **0.30** | 0.10 | 0.10 | **0.30** |
| $w_{wait}$ | 0.10 | 0.10 | **0.50** | 0.10 | 0.00 |

### Final Computation & Confidence output
For a given User $U_{i}$, we calculate the $SCORE$ for all available shops $S_{k}$. We sort descending by $SCORE$.

Confidence Score calculation: 
If the user has $>$ 5 historical bookings, $Confidence = 0.90$. 
If cold start (new user), $Confidence = 0.60$.
If we had to impute values, confidence drops by 0.10.

## Output Structure
```json
{
  "recommendedShops": [
    { "shopId": "S042", "score": 0.89 },
    { "shopId": "S015", "score": 0.82 }
  ],
  "confidence": 0.90
}
```
