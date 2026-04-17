# Feature Engineering for Smart Salon Recommendation

To build the intelligent discovery engine for Smart Salon, our recommendation model transforms basic app interactions and shop profiles into specific features. Each feature captures a different signal of intent or preference.

Below is the explanation of the specific features designed for the ranking algorithm.

## 1. Distance Match Score (`distance_score`)
**Description:** The physical distance between the user's location and the shop.
**Why it influences ranking:** Salons are inherently local businesses. Users are less likely to book a shop that is too far away unless it offers exceptional value or a highly specialized service.
**Value generation:** Inversely proportional to the distance in km. Distance-sensitive users receive a heavier weight on this feature.

## 2. Budget Match Score (`budget_match_score`)
**Description:** The alignment between the user's average historical budget (or persona-based budget) and the shop's price level.
**Why it influences ranking:** Shows shops that the user is actually comfortable affording. Premium users might avoid lower-priced shops fearing lower quality, whereas budget-conscious users will skip high-end luxury salons.
**Value generation:** Calculated as the similarity/difference between the shop's average price level and the user's budget range. High score = Perfect match.

## 3. Service Preference Match (`service_preference_match`)
**Description:** Binary or fractional indication of whether the shop provides the user's preferred or recently searched service.
**Why it influences ranking:** It ensures that if a user historically books "Manicures", they aren't bombarded with barber shops offering only "Men's Haircuts". It serves as a hard or soft filter depending on the discovery mode.
**Value generation:** 1.0 if the requested/preferred service is available, 0.0 otherwise.

## 4. Wait Time Penalty (`wait_time_penalty`)
**Description:** A negative weight applied to shops with exceptionally high avg wait times or low availability.
**Why it influences ranking:** Time is critical. Users seeking "Quick Service" personas will bounce from the app if the recommended shops have long wait times.
**Value generation:** Formulated as an exponential decay function based on expected wait minutes. Long waits decrease the final score.

## 5. Rating Weight (`rating_weight`)
**Description:** The standardized rating of the salon combined with the volume of reviews.
**Why it influences ranking:** High-quality shops lead to better customer satisfaction, which directly improves repeat rates and lifetime value. 
**Value generation:** Calculated using a Bayesian average or simply scaled between 0 and 1 representing the relative quality of the shop compared to nearby alternatives.

## 6. Repeat Affinity Score (`repeat_affinity_score`)
**Description:** A boosted score if the user has previously visited this shop and left a positive rating.
**Why it influences ranking:** Re-booking is the core of salon app retention. If a user had a great experience, showing that shop at the top of their list heavily drives repeat bookings.
**Value generation:** Based on historical bookings; e.g., 0.5 boost for a 4-star past review, 1.0 boost for a 5-star past review. 0 for unexplored shops.

## 7. Time Preference Match (`time_preference_match`)
**Description:** Alignment between the shop's peak hours/availability and the user's typical booking time (e.g., Weekend vs. Weekday Morning).
**Why it influences ranking:** Showing shops that actially have slots when the user is free prevents drop-off during the checkout/booking step.
**Value generation:** 1.0 if highly aligned, lower if the user's preferred time slots are typically booked out at that shop.

## 8. Popularity Index (`popularity_index`)
**Description:** A general measure of a shop's conversion rate on the app for similar users.
**Why it influences ranking:** Solves the cold-start problem. When we lack data on a new user, suggesting the most broadly appealing and popular shops increases the chance of a first successful booking.
**Value generation:** Aggregated based on total bookings over the last 30 days.

---
By linearly combining these features with dynamic weights tailored to the user's generated persona segment, the ranking model adapts to show the right salon, to the right user, at the right time.
