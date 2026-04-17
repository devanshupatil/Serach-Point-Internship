const fs = require('fs');
const path = require('path');

// Simple seeded random number generator (Linear Congruential Generator)
let seed = 42;
function random() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

function randomChoice(arr) {
    return arr[Math.floor(random() * arr.length)];
}

function randomChoices(arr, weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    let r = random() * sum;
    for (let i = 0; i < arr.length; i++) {
        r -= weights[i];
        if (r <= 0) return arr[i];
    }
    return arr[arr.length - 1];
}

function randomUniform(min, max) {
    return random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(randomUniform(min, max + 1));
}

function randomSample(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        let x = Math.floor(random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function generateUsers(numUsers = 1000) {
    const ageGroups = ['18-24', '25-34', '35-44', '45+'];
    const serviceTypes = ['Haircut', 'Coloring', 'Spa', 'Manicure', 'Pedicure'];
    const users = [];

    for (let i = 1; i <= numUsers; i++) {
        const uid = `U${String(i).padStart(4, '0')}`;
        const persona = randomChoice(['Budget', 'Premium', 'Quick', 'Weekend', 'Distance-sensitive']);

        let budget, preferredService, timeSlot;

        if (persona === 'Budget') {
            budget = parseFloat(randomUniform(10, 30).toFixed(2));
            preferredService = randomChoice(['Haircut', 'Manicure']);
            timeSlot = randomChoice(['Morning', 'Afternoon']);
        } else if (persona === 'Premium') {
            budget = parseFloat(randomUniform(50, 150).toFixed(2));
            preferredService = randomChoice(['Coloring', 'Spa']);
            timeSlot = randomChoice(['Evening', 'Weekend']);
        } else if (persona === 'Quick') {
            budget = parseFloat(randomUniform(15, 40).toFixed(2));
            preferredService = randomChoice(['Haircut', 'Manicure', 'Pedicure']);
            timeSlot = randomChoice(['Morning', 'Evening']);
        } else if (persona === 'Weekend') {
            budget = parseFloat(randomUniform(20, 80).toFixed(2));
            preferredService = randomChoice(serviceTypes);
            timeSlot = 'Weekend';
        } else {
            budget = parseFloat(randomUniform(20, 60).toFixed(2));
            preferredService = randomChoice(serviceTypes);
            timeSlot = randomChoice(['Morning', 'Afternoon', 'Evening']);
        }

        const repeatFlag = random() > 0.4 ? 1 : 0;

        users.push({
            user_id: uid,
            age_group: randomChoices(ageGroups, [0.3, 0.4, 0.2, 0.1]),
            preferred_service_type: preferredService,
            avg_budget: budget,
            preferred_time_slot: timeSlot,
            repeat_user_flag: repeatFlag,
            persona: persona
        });
    }
    return users;
}

function generateShops(numShops = 100) {
    const serviceTypes = ['Haircut', 'Coloring', 'Spa', 'Manicure', 'Pedicure'];
    const shops = [];

    for (let i = 1; i <= numShops; i++) {
        const sid = `S${String(i).padStart(3, '0')}`;
        const numServices = randomInt(1, 5);
        const availableServices = randomSample(serviceTypes, numServices);

        const priceLevel = randomChoices([1, 2, 3], [0.4, 0.4, 0.2]);
        const rating = parseFloat(randomUniform(3.0, 5.0).toFixed(1));
        const avgWaitTime = randomInt(5, 60);

        shops.push({
            shop_id: sid,
            rating: rating,
            price_level: priceLevel,
            avg_wait_time: avgWaitTime,
            service_types_available: `"${availableServices.join(',')}"` // Quote to handle commas in CSV
        });
    }
    return shops;
}

function generateBookings(users, shops, numBookings = 10000) {
    const bookings = [];

    for (let i = 0; i < numBookings; i++) {
        const user = randomChoice(users);
        const uid = user.user_id;
        const persona = user.persona;

        let candidateShops = shops;
        if (persona === 'Premium') {
            candidateShops = shops.filter(s => s.price_level >= 2);
        } else if (persona === 'Budget') {
            candidateShops = shops.filter(s => s.price_level <= 2);
        }

        if (candidateShops.length === 0) {
            candidateShops = shops;
        }

        const shop = randomChoice(candidateShops);
        const sid = shop.shop_id;

        const availableServices = shop.service_types_available.replace(/"/g, '').split(',');
        const serviceType = availableServices.includes(user.preferred_service_type)
            ? user.preferred_service_type
            : randomChoice(availableServices);

        const timeOfDay = random() > 0.3 ? user.preferred_time_slot : randomChoice(['Morning', 'Afternoon', 'Evening', 'Weekend']);

        const baseRating = shop.rating;
        const randomNoise = randomUniform(-1, 0.5);
        const ratingGiven = parseFloat(Math.min(5.0, Math.max(1.0, baseRating + randomNoise)).toFixed(1));

        const distanceKm = persona === 'Distance-sensitive'
            ? parseFloat(randomUniform(0.5, 3.0).toFixed(1))
            : parseFloat(randomUniform(1.0, 15.0).toFixed(1));

        bookings.push({
            booking_id: `B${String(i + 1).padStart(5, '0')}`,
            user_id: uid,
            shop_id: sid,
            service_type: serviceType,
            time_of_day: timeOfDay,
            distance_km: distanceKm,
            rating_given: ratingGiven
        });
    }
    return bookings;
}

function writeCSV(filename, data) {
    if (!data || data.length === 0) return;
    const keys = Object.keys(data[0]);
    const lines = [];
    lines.push(keys.join(','));
    for (const row of data) {
        lines.push(keys.map(k => row[k]).join(','));
    }
    fs.writeFileSync(filename, lines.join('\n'));
}

function main() {
    console.log("Generating synthetic datasets with Node.js...");

    const outputDir = path.join(__dirname, 'data');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const users = generateUsers(1000);
    writeCSV(path.join(outputDir, 'users.csv'), users);
    console.log(`Created users.csv (${users.length} rows)`);

    const shops = generateShops(100);
    writeCSV(path.join(outputDir, 'shops.csv'), shops);
    console.log(`Created shops.csv (${shops.length} rows)`);

    const bookings = generateBookings(users, shops, 10000);
    writeCSV(path.join(outputDir, 'bookings.csv'), bookings);
    console.log(`Created bookings.csv (${bookings.length} rows)`);

    console.log("Data generation complete!");
}

if (require.main === module) {
    main();
}
