// Health calculation utilities
function getToothHealthColor(health) {
    if (health >= CONFIG.HEALTH_THRESHOLDS.GOOD) return CONFIG.HEALTH_COLORS.EXCELLENT;
    if (health >= CONFIG.HEALTH_THRESHOLDS.FAIR) return CONFIG.HEALTH_COLORS.GOOD;
    return CONFIG.HEALTH_COLORS.POOR;
}

function getToothColor(health) {
    if (health >= CONFIG.HEALTH_THRESHOLDS.GOOD) return 'أبيض';
    if (health >= CONFIG.HEALTH_THRESHOLDS.FAIR) return 'أبيض مصفر';
    return 'يحتاج تبييض';
}

function getToothCondition(health) {
    if (health >= CONFIG.HEALTH_THRESHOLDS.EXCELLENT) return 'ممتازة';
    if (health >= CONFIG.HEALTH_THRESHOLDS.GOOD) return 'جيدة';
    if (health >= CONFIG.HEALTH_THRESHOLDS.FAIR) return 'مقبولة';
    return 'تحتاج عناية';
}

// Drawing utilities
function drawTeethNumbers(ctx, upperPoints, lowerPoints, healthData) {
    ctx.font = CONFIG.CHART.DEFAULT_FONT;
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    let teethCount = 0;

    // Draw upper teeth
    upperPoints.forEach((point, index) => {
        if (index < upperPoints.length - 1) {
            const nextPoint = upperPoints[index + 1];
            const distance = calculateDistance(point, nextPoint);
            
            if (distance > CONFIG.MIN_TOOTH_DISTANCE) {
                drawToothIndicator(ctx, point, healthData[teethCount], teethCount + 1, true);
                teethCount++;
            }
        }
    });

    // Draw lower teeth
    lowerPoints.forEach((point, index) => {
        if (index < lowerPoints.length - 1) {
            const nextPoint = lowerPoints[index + 1];
            const distance = calculateDistance(point, nextPoint);
            
            if (distance > CONFIG.MIN_TOOTH_DISTANCE) {
                drawToothIndicator(ctx, point, healthData[teethCount], teethCount + 1, false);
                teethCount++;
            }
        }
    });
}

function drawToothIndicator(ctx, point, health, number, isUpper) {
    const yOffset = isUpper ? -20 : 20;
    const textYOffset = isUpper ? -10 : 30;

    // Draw health status circle
    ctx.beginPath();
    ctx.arc(point.x, point.y + yOffset, CONFIG.CHART.CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = getToothHealthColor(health);
    ctx.fill();
    ctx.stroke();

    // Draw tooth number
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.fillText(number, point.x - 4, point.y + textYOffset);
    ctx.strokeText(number, point.x - 4, point.y + textYOffset);
}

function calculateDistance(point1, point2) {
    return Math.hypot(point2.x - point1.x, point2.y - point1.y);
}

// DOM utilities
function updateResults(healthData, visibleTeethCount) {
    const resultsDiv = document.getElementById('results');
    let teethDetails = '';
    let teethNumber = 1;
    
    healthData.forEach(health => {
        if (health > 0) {
            teethDetails += `
                <div class="tooth-detail">
                    <h3>السن رقم ${teethNumber}</h3>
                    <p>الصحة: ${health}%</p>
                    <p>الحالة: ${getToothCondition(health)}</p>
                    <p>اللون: ${getToothColor(health)}</p>
                </div>
            `;
            teethNumber++;
        }
    });
    
    resultsDiv.innerHTML = teethDetails;
}
