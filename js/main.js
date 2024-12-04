let isAnalyzing = false;
let stream = null;
let lastValidDetection = null;
let detectionPersistenceFrames = 0;
let blazefaceModel;

// DOM Elements
const video = document.getElementById('video');
const overlayCanvas = document.getElementById('overlay-canvas');
const ctx = overlayCanvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const realtimeStats = document.getElementById('realtime-stats');
const loadingElement = document.getElementById('loading');

// Initialize models and UI
loadingElement.style.display = 'block';

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),
    blazeface.load()
]).then(([_, __, model]) => {
    blazefaceModel = model;
    startBtn.disabled = false;
    loadingElement.style.display = 'none';
    initializeCharts();
}).catch(error => {
    console.error('Error loading models:', error);
    loadingElement.textContent = 'حدث خطأ في تحميل النماذج';
});

async function startRealTimeAnalysis() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
                width: CONFIG.VIDEO.WIDTH,
                height: CONFIG.VIDEO.HEIGHT,
                facingMode: CONFIG.VIDEO.FACING_MODE
            } 
        });
        
        video.srcObject = stream;
        await video.play();

        overlayCanvas.width = video.videoWidth;
        overlayCanvas.height = video.videoHeight;

        isAnalyzing = true;
        analyzeFrame();
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('لا يمكن الوصول إلى الكاميرا');
    }
}

function stopRealTimeAnalysis() {
    isAnalyzing = false;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    video.srcObject = null;
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    realtimeStats.innerHTML = '';
    
    resetCharts();
    document.getElementById('results').innerHTML = '';
    
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

async function analyzeFrame() {
    if (!isAnalyzing) return;

    try {
        let detections = await faceapi.detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions({
                inputSize: 512,
                scoreThreshold: 0.3
            })
        ).withFaceLandmarks();

        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        // Handle detection persistence
        if (detections) {
            lastValidDetection = detections;
            detectionPersistenceFrames = 0;
        } else if (lastValidDetection && detectionPersistenceFrames < CONFIG.PERSISTENCE_THRESHOLD) {
            detectionPersistenceFrames++;
            detections = lastValidDetection;
        }

        if (detections) {
            const analysis = analyzeMouthState(detections);
            
            if (analysis) {
                // Update UI elements
                updateResults(analysis.healthData, analysis.visibleTeethCount);
                updateCharts(analysis.healthData, analysis.teethQuality);
                drawTeethNumbers(ctx, analysis.upperTeethPoints, analysis.lowerTeethPoints, analysis.healthData);

                realtimeStats.innerHTML = `
                    <div>تناسق الأسنان: ${analysis.teethQuality.symmetry}%</div>
                    <div>الحالة العامة: ${analysis.teethQuality.health}</div>
                    <div>حالة الفم: ${analysis.mouthOpenness < CONFIG.MIN_MOUTH_OPENNESS ? 'مغلق' : 'مفتوح'}</div>
                `;
            }
        }
    } catch (error) {
        console.error('Analysis error:', error);
    }

    requestAnimationFrame(analyzeFrame);
}

// Event Listeners
startBtn.addEventListener('click', startRealTimeAnalysis);
stopBtn.addEventListener('click', stopRealTimeAnalysis);

video.addEventListener('loadedmetadata', () => {
    overlayCanvas.width = video.videoWidth;
    overlayCanvas.height = video.videoHeight;
});
