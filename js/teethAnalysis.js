function analyzeTeethQuality(mouthPoints) {
    const leftPoints = mouthPoints.slice(0, mouthPoints.length / 2);
    const rightPoints = mouthPoints.slice(mouthPoints.length / 2);
    
    let symmetryScore = 0;
    for (let i = 0; i < leftPoints.length; i++) {
        const leftPoint = leftPoints[i];
        const rightPoint = rightPoints[rightPoints.length - 1 - i];
        const distance = calculateDistance(leftPoint, rightPoint);
        symmetryScore += distance;
    }

    const symmetry = Math.max(0, Math.min(100, 100 - (symmetryScore / leftPoints.length)));
    
    let health;
    if (symmetry >= CONFIG.HEALTH_THRESHOLDS.EXCELLENT) health = "ممتازة";
    else if (symmetry >= CONFIG.HEALTH_THRESHOLDS.GOOD) health = "جيدة";
    else health = "تحتاج إلى عناية";

    return { 
        symmetry: Math.round(symmetry), 
        health 
    };
}

function analyzeToothHealth(startPoint, endPoint, mouthOpenness) {
    if (!endPoint) return { health: 0, color: 'غير محدد' };
    
    // Calculate openness factor with minimum threshold
    const opennessFactor = Math.min(1, Math.max(0.5, mouthOpenness / 15));
    
    // Calculate tooth length and base health
    const toothLength = calculateDistance(startPoint, endPoint);
    const baseHealth = Math.max(0, Math.min(100, Math.round((20 - Math.abs(toothLength - 20)) / 20 * 100)));
    
    // Adjust health based on mouth openness
    const adjustedHealth = Math.round(baseHealth * (0.7 + 0.3 * opennessFactor));
    
    return {
        health: adjustedHealth,
        color: getToothColor(adjustedHealth)
    };
}

function analyzeMouthState(detections) {
    if (!detections) return null;

    const mouth = detections.landmarks.getMouth();
    const upperLip = mouth[13];
    const lowerLip = mouth[19];
    const mouthOpenness = Math.abs(upperLip.y - lowerLip.y);
    
    const upperTeethPoints = mouth.slice(13, 19);
    const lowerTeethPoints = mouth.slice(19).reverse();

    let healthData = [];
    let visibleTeethCount = 0;

    // Analyze upper teeth
    upperTeethPoints.forEach((point, index) => {
        if (index < upperTeethPoints.length - 1) {
            const toothHealth = analyzeToothHealth(
                point, 
                upperTeethPoints[index + 1], 
                Math.max(CONFIG.MIN_MOUTH_OPENNESS, mouthOpenness)
            );
            healthData.push(toothHealth.health);
            if (toothHealth.health > 0) visibleTeethCount++;
        }
    });

    // Analyze lower teeth
    lowerTeethPoints.forEach((point, index) => {
        if (index < lowerTeethPoints.length - 1) {
            const toothHealth = analyzeToothHealth(
                point, 
                lowerTeethPoints[index + 1], 
                Math.max(CONFIG.MIN_MOUTH_OPENNESS, mouthOpenness)
            );
            healthData.push(toothHealth.health);
            if (toothHealth.health > 0) visibleTeethCount++;
        }
    });

    const teethQuality = analyzeTeethQuality(mouth);

    return {
        mouthOpenness,
        healthData,
        visibleTeethCount,
        upperTeethPoints,
        lowerTeethPoints,
        teethQuality
    };
}
