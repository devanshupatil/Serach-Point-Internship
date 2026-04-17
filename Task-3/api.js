const fs = require('fs');
const path = require('path');

// Simple CSV Parser for Node.js standard lib
function parseCSV(filepath) {
    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const lines = content.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            // Handle quoted commas properly (important for service_types)
            const rowStr = lines[i];
            const row = [];
            let inQuotes = false;
            let currentStr = '';
            for (let char of rowStr) {
                if (char === '"') inQuotes = !inQuotes;
                else if (char === ',' && !inQuotes) {
                    row.push(currentStr);
                    currentStr = '';
                } else {
                    currentStr += char;
                }
            }
            row.push(currentStr); // Last element

            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            data.push(obj);
        }
        return data;
    } catch (e) {
        console.warn(`Warning: Could not parse ${filepath}`);
        return [];
    }
}

// Pseudo-hash equivalent for mocking distance deterministically 
function stringHash(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit int
    }
    return Math.abs(hash);
}

class ModelDataStore {
    constructor(dataDir = 'data') {
        this.shops = parseCSV(path.join(__dirname, dataDir, 'shops.csv'));
        this.users = parseCSV(path.join(__dirname, dataDir, 'users.csv'));
        this.bookings = parseCSV(path.join(__dirname, dataDir, 'bookings.csv'));

        this.userShopRatings = {};

        const aggregations = {};
        for (let b of this.bookings) {
            const key = `${b.user_id}_${b.shop_id}`;
            if (!aggregations[key]) {
                aggregations[key] = [];
            }
            aggregations[key].push(parseFloat(b.rating_given));
        }

        for (const [key, ratings] of Object.entries(aggregations)) {
            const sum = ratings.reduce((a, b) => a + b, 0);
            this.userShopRatings[key] = sum / ratings.length;
        }

        this.isReady = this.shops.length > 0;
    }

    getShop(shopId) {
        return this.shops.find(s => s.shop_id === shopId) || null;
    }

    getUser(userId) {
        return this.users.find(u => u.user_id === userId) || null;
    }

    getUserRepeatAffinity(userId, shopId) {
        return this.userShopRatings[`${userId}_${shopId}`] || 0.0;
    }
}

// Initialize datastore
const store = new ModelDataStore();

/**
 * API-ready function to rank shops in Node.js
 */
function recommendShops(inputPayload) {
    const userId = inputPayload.user_id;
    let requestedService = inputPayload.preferred_service_type;

    const userRecord = userId ? store.getUser(userId) : null;

    // Defaults (Cold Start)
    let budgetLevel = 2;
    let persona = "Distance-sensitive";
    let confidence = 0.60;

    if (userRecord) {
        confidence = 0.90;
        persona = userRecord.persona;
        const avgBudget = parseFloat(userRecord.avg_budget);

        if (avgBudget > 50) budgetLevel = 3; // Premium
        else if (avgBudget < 25) budgetLevel = 1; // Budget

        if (!requestedService) {
            requestedService = userRecord.preferred_service_type;
        }
    }

    if (store.shops.length === 0) {
        return { recommendedShops: [], confidence: 0.0, message: "No data available." };
    }

    // Set dynamic weights
    let weights = { dist: 0.3, budget: 0.2, serv: 0.2, rating: 0.2, wait: 0.1, repeat: 0.0 };

    if (persona === "Premium") {
        weights = { dist: 0.1, budget: 0.3, serv: 0.2, rating: 0.3, wait: 0.1, repeat: 0.1 };
    } else if (persona === "Budget") {
        weights = { dist: 0.2, budget: 0.4, serv: 0.2, rating: 0.1, wait: 0.1, repeat: 0.1 };
    } else if (persona === "Quick") {
        weights = { dist: 0.15, budget: 0.1, serv: 0.15, rating: 0.1, wait: 0.5, repeat: 0.1 };
    } else if (persona === "Distance-sensitive") {
        weights = { dist: 0.5, budget: 0.15, serv: 0.15, rating: 0.1, wait: 0.1, repeat: 0.0 };
    }

    let recommended = [];

    for (let shop of store.shops) {
        // Mock distance deterministically using string hash
        const hashSeed = userId ? stringHash(userId + shop.shop_id) : 50;
        const sDist = userId ? 1.0 + ((hashSeed % 100) / 10.0) : 5.0;

        // Features
        const fDist = Math.max(0, 1.0 - (sDist / 15.0));
        const fBudget = Math.max(0, 1.0 - (Math.abs(budgetLevel - parseInt(shop.price_level)) / 2.0));

        const shopServices = shop.service_types_available.split(',');
        const fServ = shopServices.includes(requestedService) ? 1.0 : 0.0;

        const fRating = parseFloat(shop.rating) / 5.0;
        const fWait = Math.max(0, 1.0 - (parseFloat(shop.avg_wait_time) / 60.0));

        let fRepeat = 0.0;
        if (userId) {
            const historicalRating = store.getUserRepeatAffinity(userId, shop.shop_id);
            if (historicalRating >= 4.0) {
                fRepeat = 1.0;
            }
        }

        // Combine Score
        const score = (weights.dist * fDist) +
            (weights.budget * fBudget) +
            (weights.serv * fServ) +
            (weights.rating * fRating) +
            (weights.wait * fWait) +
            (weights.repeat * fRepeat);

        recommended.push({
            shopId: shop.shop_id,
            score: parseFloat(score.toFixed(4))
        });
    }

    // Sort descending by score
    recommended.sort((a, b) => b.score - a.score);

    return {
        recommendedShops: recommended.slice(0, 10), // Top 10
        confidence: confidence,
        debug_persona: persona
    };
}

// Allow module exportation
module.exports = { recommendShops, store };

// Basic CLI Test to prove it works
if (require.main === module) {
    console.log("Testing API logic with user U0042 in Node.js...");
    const result = recommendShops({ user_id: "U0042" });
    console.log(result);
}
