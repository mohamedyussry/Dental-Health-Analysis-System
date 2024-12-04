const CONFIG = {
    // Detection settings
    PERSISTENCE_THRESHOLD: 30,
    MIN_MOUTH_OPENNESS: 5,
    MIN_TOOTH_DISTANCE: 5,
    
    // Health thresholds
    HEALTH_THRESHOLDS: {
        EXCELLENT: 90,
        GOOD: 75,
        FAIR: 60,
        POOR: 0
    },
    
    // Colors for health indicators
    HEALTH_COLORS: {
        EXCELLENT: '#2ecc71',
        GOOD: '#f1c40f',
        POOR: '#e74c3c'
    },
    
    // Video settings
    VIDEO: {
        WIDTH: 600,
        HEIGHT: 400,
        FACING_MODE: 'user'
    },
    
    // Chart settings
    CHART: {
        MAX_TEETH: 12,
        DEFAULT_FONT: 'bold 16px Arial',
        CIRCLE_RADIUS: 8
    }
};
