// DI AERO Dashboard JavaScript - Fixed Navigation
class DIAERODashboard {
    constructor() {
        this.mapboxToken = 'sk.eyJ1IjoicnVzc2VsbHJhbmRvbCIsImEiOiJjbWY0YjBvN2MwM2t4Mm1vcDNzN3dvNXV3In0.n4Z3wKdA_zBl5mx38ElyUA';
        this.thermalImages = [
            'https://pub-23f7e1f517734fc09a3807185400d484.r2.dev/Aerial_Thermal_Imaging_roof.jpg',
            'https://pub-23f7e1f517734fc09a3807185400d484.r2.dev/04-15-32-170_radiometric%20-%20good%20.JPG',
            'https://pub-23f7e1f517734fc09a3807185400d484.r2.dev/DJI_20240913124146_0015_V.JPG',
            'https://pub-23f7e1f517734fc09a3807185400d484.r2.dev/DJI_20240913124115_0013_V.JPG'
        ];
        
        this.sampleData = {
            missions: [
                {
                    id: 'M001',
                    type: 'Roof Inspection',
                    client: 'State Farm Insurance',
                    property: '1234 Oak Street, Lafayette, LA',
                    status: 'Active',
                    drone: 'DJI Mavic 3T-Alpha',
                    pilot: 'Sarah Johnson',
                    start_time: '09:15 AM',
                    estimated_completion: '10:45 AM',
                    weather: 'Clear, 72°F, Wind 5mph NE'
                },
                {
                    id: 'M002',
                    type: 'Emergency Response',
                    client: 'Lafayette Fire Dept',
                    property: 'Industrial Complex Fire',
                    status: 'Queued',
                    drone: 'DJI Mavic 3T-Beta',
                    pilot: 'Mike Rodriguez',
                    scheduled: '11:30 AM',
                    priority: 'High'
                }
            ],
            agents: [
                {
                    name: 'Nova',
                    role: 'Navigation & Flight Planning',
                    status: 'Active',
                    last_action: 'Optimized waypoint route for M001',
                    confidence: 0.94
                },
                {
                    name: 'Marla',
                    role: 'Mission Analysis',
                    status: 'Processing',
                    last_action: 'Analyzing thermal data from roof inspection',
                    confidence: 0.87
                },
                {
                    name: 'Rhea',
                    role: 'Report Generation',
                    status: 'Active',
                    last_action: 'Generated insurance claim report',
                    confidence: 0.92
                },
                {
                    name: 'Val',
                    role: 'Data Validation',
                    status: 'Monitoring',
                    last_action: 'Validated chain of custody',
                    confidence: 0.96
                },
                {
                    name: 'HAIL-M',
                    role: 'Emergency Management',
                    status: 'Standby',
                    last_action: 'Weather alert monitoring',
                    confidence: 0.89
                }
            ]
        };

        this.map = null;
        this.revenueChart = null;
        this.missionsChart = null;
        this.currentPage = 'dashboard';
        
        this.init();
    }

    init() {
        console.log('Initializing DI AERO Dashboard...');
        
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        this.setupNavigation();
        this.loadDashboardData();
        this.setupThermalAnalysis();
        this.setupActionButtons();
        this.setupWebSocketSimulation();
        console.log('Application setup complete');
    }

    setupNavigation() {
        console.log('Setting up navigation...');
        
        // Set up main navigation buttons with explicit targeting
        const navButtons = [
            { selector: '[data-page="dashboard"]', page: 'dashboard' },
            { selector: '[data-page="flight-ops"]', page: 'flight-ops' },
            { selector: '[data-page="thermal"]', page: 'thermal' },
            { selector: '[data-page="agents"]', page: 'agents' },
            { selector: '[data-page="custody"]', page: 'custody' },
            { selector: '[data-page="integrations"]', page: 'integrations' },
            { selector: '[data-page="compliance"]', page: 'compliance' },
            { selector: '[data-page="analytics"]', page: 'analytics' }
        ];

        navButtons.forEach(({ selector, page }) => {
            const button = document.querySelector(selector);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Navigating to: ${page}`);
                    this.navigateToPage(page);
                });
                console.log(`Set up navigation for: ${page}`);
            } else {
                console.warn(`Navigation button not found: ${selector}`);
            }
        });

        // Logo click to return to dashboard
        const logo = document.querySelector('.header-logo');
        if (logo) {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Logo clicked - returning to dashboard');
                this.navigateToPage('dashboard');
            });
        }

        console.log('Navigation setup complete');
    }

    navigateToPage(pageId) {
        console.log(`Starting navigation to: ${pageId}`);
        
        if (!pageId) {
            console.error('No page ID provided');
            return;
        }

        // Hide all pages
        const allPages = document.querySelectorAll('.page');
        console.log(`Found ${allPages.length} pages`);
        
        allPages.forEach((page, index) => {
            page.classList.remove('active');
            console.log(`Hid page ${index}: ${page.id}`);
        });
        
        // Show target page
        const targetPageId = `${pageId}-page`;
        const targetPage = document.getElementById(targetPageId);
        
        if (targetPage) {
            targetPage.classList.add('active');
            console.log(`Activated page: ${targetPageId}`);
        } else {
            console.error(`Page not found: ${targetPageId}`);
            // List all available pages for debugging
            const availablePages = document.querySelectorAll('[id$="-page"]');
            console.log('Available pages:', Array.from(availablePages).map(p => p.id));
            return;
        }
        
        // Update navigation button states
        const allNavButtons = document.querySelectorAll('.nav-btn');
        allNavButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeNavBtn = document.querySelector(`[data-page="${pageId}"]`);
        if (activeNavBtn) {
            activeNavBtn.classList.add('active');
            console.log(`Activated nav button for: ${pageId}`);
        }
        
        this.currentPage = pageId;
        
        // Initialize page-specific functionality
        this.initializePageSpecificFeatures(pageId);
        
        console.log(`Navigation to ${pageId} complete`);
    }

    initializePageSpecificFeatures(pageId) {
        console.log(`Initializing features for: ${pageId}`);
        
        switch(pageId) {
            case 'flight-ops':
                if (!this.map) {
                    setTimeout(() => this.initializeMap(), 200);
                }
                break;
            case 'analytics':
                if (!this.revenueChart) {
                    setTimeout(() => this.initializeCharts(), 200);
                }
                break;
            case 'thermal':
                // Ensure thermal analysis is set up
                this.setupThermalAnalysis();
                break;
        }
    }

    setupActionButtons() {
        console.log('Setting up action buttons...');
        
        // Use event delegation for better reliability
        document.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn')) {
                return;
            }
            
            const buttonText = e.target.textContent.trim();
            console.log('Button clicked:', buttonText);
            
            // Prevent default button behavior
            e.preventDefault();
            
            switch(buttonText) {
                case 'New Mission':
                    this.handleNewMission();
                    break;
                case 'Emergency Protocol':
                    this.handleEmergencyProtocol();
                    break;
                case 'Plan Mission':
                    this.handlePlanMission();
                    break;
                case 'Generate Report':
                    this.handleGenerateReport();
                    break;
                case 'Deploy Agent':
                    this.handleDeployAgent();
                    break;
                case 'View Logs':
                    this.handleViewLogs();
                    break;
                case 'Add Integration':
                    this.handleAddIntegration();
                    break;
                case 'Test Connections':
                    this.handleTestConnections();
                    break;
                case 'Schedule Audit':
                    this.handleScheduleAudit();
                    break;
                case 'Export Report':
                    this.handleExportReport();
                    break;
                case 'YOLOv8 Analysis':
                    this.handleYOLOAnalysis();
                    break;
                case 'Temperature Map':
                    this.handleTemperatureMap();
                    break;
                default:
                    console.log('Unhandled button:', buttonText);
            }
        });
        
        console.log('Action buttons setup complete');
    }

    loadDashboardData() {
        console.log('Loading dashboard data...');
        this.renderActiveMissions();
        this.renderAgentOverview();
        this.renderAgentCards();
        this.renderMissionQueue();
        this.renderEvidenceChain();
        console.log('Dashboard data loaded');
    }

    renderActiveMissions() {
        const container = document.getElementById('active-missions');
        if (!container) {
            console.warn('Active missions container not found');
            return;
        }

        container.innerHTML = this.sampleData.missions.map(mission => `
            <div class="mission-item">
                <div class="mission-header">
                    <span class="mission-title">${mission.type} - ${mission.id}</span>
                    <span class="status status--${mission.status.toLowerCase() === 'active' ? 'success' : 'warning'}">${mission.status}</span>
                </div>
                <div class="mission-details">
                    <div><strong>Client:</strong> ${mission.client}</div>
                    <div><strong>Property:</strong> ${mission.property}</div>
                    <div><strong>Drone:</strong> ${mission.drone}</div>
                    <div><strong>Pilot:</strong> ${mission.pilot}</div>
                    ${mission.start_time ? `<div><strong>Started:</strong> ${mission.start_time}</div>` : ''}
                    ${mission.scheduled ? `<div><strong>Scheduled:</strong> ${mission.scheduled}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    renderAgentOverview() {
        const container = document.getElementById('agent-overview');
        if (!container) return;

        container.innerHTML = this.sampleData.agents.map(agent => `
            <div class="agent-mini">
                <div class="agent-mini-name">${agent.name}</div>
                <div class="agent-mini-status">${agent.status}</div>
            </div>
        `).join('');
    }

    renderAgentCards() {
        const container = document.getElementById('agent-cards');
        if (!container) return;

        container.innerHTML = this.sampleData.agents.map(agent => `
            <div class="agent-card ${agent.status.toLowerCase()}">
                <div class="agent-header">
                    <h3 class="agent-name">${agent.name}</h3>
                    <span class="status status--${this.getAgentStatusClass(agent.status)}">${agent.status}</span>
                </div>
                <p class="agent-role">${agent.role}</p>
                <div class="agent-stats">
                    <div class="agent-stat">
                        <span class="label">Last Action:</span>
                        <span class="value">Just now</span>
                    </div>
                    <div class="agent-stat">
                        <span class="label">Confidence:</span>
                        <span class="value">${Math.round(agent.confidence * 100)}%</span>
                    </div>
                </div>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${agent.confidence * 100}%"></div>
                </div>
                <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 12px;">${agent.last_action}</p>
            </div>
        `).join('');
    }

    renderMissionQueue() {
        const container = document.getElementById('mission-queue');
        if (!container) return;

        const queuedMissions = this.sampleData.missions.filter(m => m.status === 'Queued');
        
        container.innerHTML = queuedMissions.map(mission => `
            <div class="queue-item">
                <div class="queue-header">
                    <span class="queue-title">${mission.type} - ${mission.id}</span>
                    <span class="queue-time">${mission.scheduled}</span>
                </div>
                <div style="font-size: 12px; color: var(--color-text-secondary);">
                    ${mission.client} - ${mission.property}
                </div>
            </div>
        `).join('');
    }

    renderEvidenceChain() {
        const container = document.getElementById('evidence-chain');
        if (!container) return;

        const evidenceEntries = [
            {
                id: 'E001',
                type: 'Mission Start',
                hash: 'sha256:a1b2c3d4e5f6789...',
                timestamp: '2025-09-03 09:15:32 CDT',
                validator: 'Val Agent'
            },
            {
                id: 'E002',
                type: 'Thermal Capture',
                hash: 'sha256:f6e5d4c3b2a1987...',
                timestamp: '2025-09-03 09:47:15 CDT',
                validator: 'Blockchain Network'
            },
            {
                id: 'E003',
                type: 'AI Analysis',
                hash: 'sha256:9876543210abcdef...',
                timestamp: '2025-09-03 09:52:08 CDT',
                validator: 'Marla Agent'
            }
        ];

        container.innerHTML = evidenceEntries.map(entry => `
            <div class="evidence-item">
                <div class="evidence-header">
                    <strong>${entry.type} (${entry.id})</strong>
                    <span class="evidence-timestamp">${entry.timestamp}</span>
                </div>
                <div class="evidence-hash">${entry.hash}</div>
                <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 8px;">
                    Validated by: ${entry.validator}
                </div>
            </div>
        `).join('');
    }

    getAgentStatusClass(status) {
        switch(status.toLowerCase()) {
            case 'active': return 'success';
            case 'processing': return 'warning';
            case 'standby': return 'info';
            case 'monitoring': return 'info';
            default: return 'info';
        }
    }

    initializeMap() {
        console.log('Initializing Mapbox map...');
        
        if (typeof mapboxgl === 'undefined') {
            console.error('Mapbox GL JS not loaded');
            const mapContainer = document.getElementById('flight-map');
            if (mapContainer) {
                mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-text-secondary); background: var(--color-surface); border-radius: var(--radius-base);">Mapbox GL JS not available - Map functionality disabled</div>';
            }
            return;
        }

        mapboxgl.accessToken = this.mapboxToken;
        
        const mapContainer = document.getElementById('flight-map');
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        try {
            this.map = new mapboxgl.Map({
                container: 'flight-map',
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: [-92.0198, 30.2241], // Lafayette, LA
                zoom: 13
            });

            this.map.on('load', () => {
                console.log('Map loaded successfully');
                this.addMapFeatures();
                this.setupMapControls();
            });

            this.map.on('error', (e) => {
                console.error('Map error:', e);
            });

        } catch (error) {
            console.error('Error initializing map:', error);
            mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-text-secondary);">Map temporarily unavailable</div>';
        }
    }

    addMapFeatures() {
        // Add drone marker
        const droneMarker = new mapboxgl.Marker({
            color: '#1FB8CD',
            scale: 1.2
        })
        .setLngLat([-92.0150, 30.2280])
        .setPopup(new mapboxgl.Popup().setHTML('<strong>DJI Mavic 3T-Alpha</strong><br>Mission M001 - Active<br>Altitude: 120 ft AGL<br>Battery: 87%'))
        .addTo(this.map);

        // Add mission area
        this.map.addSource('mission-area', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [-92.0170, 30.2260],
                        [-92.0130, 30.2260],
                        [-92.0130, 30.2300],
                        [-92.0170, 30.2300],
                        [-92.0170, 30.2260]
                    ]]
                }
            }
        });

        this.map.addLayer({
            id: 'mission-area-fill',
            type: 'fill',
            source: 'mission-area',
            paint: {
                'fill-color': '#1FB8CD',
                'fill-opacity': 0.2
            }
        });

        this.map.addLayer({
            id: 'mission-area-border',
            type: 'line',
            source: 'mission-area',
            paint: {
                'line-color': '#1FB8CD',
                'line-width': 2
            }
        });
    }

    setupMapControls() {
        const centerBtn = document.getElementById('center-map');
        const noFlyBtn = document.getElementById('show-nofly');
        const weatherBtn = document.getElementById('weather-overlay');

        if (centerBtn) {
            centerBtn.addEventListener('click', () => {
                this.map.flyTo({
                    center: [-92.0198, 30.2241],
                    zoom: 13
                });
            });
        }

        if (noFlyBtn) {
            noFlyBtn.addEventListener('click', () => {
                if (this.map.getLayer('no-fly-zones')) {
                    this.map.removeLayer('no-fly-zones');
                    this.map.removeSource('no-fly-zones');
                    noFlyBtn.textContent = 'No-Fly Zones';
                } else {
                    this.addNoFlyZones();
                    noFlyBtn.textContent = 'Hide No-Fly';
                }
            });
        }

        if (weatherBtn) {
            weatherBtn.addEventListener('click', () => {
                alert('Weather overlay: NOAA/NWS integration would display real-time weather data, wind speeds, and flight safety alerts.');
            });
        }
    }

    addNoFlyZones() {
        this.map.addSource('no-fly-zones', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [-92.0350, 30.2100],
                        [-92.0250, 30.2100],
                        [-92.0250, 30.2200],
                        [-92.0350, 30.2200],
                        [-92.0350, 30.2100]
                    ]]
                }
            }
        });

        this.map.addLayer({
            id: 'no-fly-zones',
            type: 'fill',
            source: 'no-fly-zones',
            paint: {
                'fill-color': '#FF5459',
                'fill-opacity': 0.4
            }
        });
    }

    setupThermalAnalysis() {
        const thermalSelect = document.getElementById('thermal-image-select');
        const thermalImage = document.getElementById('thermal-image');

        if (thermalSelect && thermalImage) {
            // Remove existing listeners
            thermalSelect.removeEventListener('change', this.handleThermalImageChange);
            
            // Add new listener
            this.handleThermalImageChange = (e) => {
                const index = parseInt(e.target.value);
                console.log('Changing thermal image to index:', index);
                thermalImage.src = this.thermalImages[index];
                this.updateThermalOverlay(index);
            };
            
            thermalSelect.addEventListener('change', this.handleThermalImageChange);
        }
    }

    updateThermalOverlay(imageIndex) {
        const overlay = document.getElementById('thermal-overlay');
        if (!overlay) return;

        const overlayConfigs = [
            [
                { top: '25%', left: '30%', width: '15%', height: '10%', label: 'Thermal Anomaly - 94% confidence' },
                { top: '45%', left: '60%', width: '12%', height: '8%', label: 'Missing Shingles - 87% confidence' }
            ],
            [
                { top: '35%', left: '25%', width: '20%', height: '15%', label: 'Hot Spot - 91% confidence' },
                { top: '55%', left: '50%', width: '18%', height: '12%', label: 'Temperature Gradient - 83% confidence' }
            ],
            [
                { top: '20%', left: '40%', width: '25%', height: '20%', label: 'Structural Damage - 96% confidence' },
                { top: '60%', left: '20%', width: '15%', height: '10%', label: 'Debris - 78% confidence' }
            ],
            [
                { top: '30%', left: '35%', width: '22%', height: '18%', label: 'Roof Damage - 89% confidence' },
                { top: '65%', left: '55%', width: '20%', height: '15%', label: 'Gutter Damage - 76% confidence' }
            ]
        ];

        const config = overlayConfigs[imageIndex] || overlayConfigs[0];
        
        overlay.innerHTML = config.map(detection => `
            <div class="detection-box" style="top: ${detection.top}; left: ${detection.left}; width: ${detection.width}; height: ${detection.height};">
                <span class="detection-label">${detection.label}</span>
            </div>
        `).join('');
    }

    initializeCharts() {
        console.log('Initializing analytics charts...');
        
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            return;
        }

        this.initializeRevenueChart();
        this.initializeMissionsChart();
    }

    initializeRevenueChart() {
        const ctx = document.getElementById('revenue-chart');
        if (!ctx) {
            console.error('Revenue chart canvas not found');
            return;
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
        const revenueData = [285, 312, 398, 445, 467, 489, 512, 478, 487];

        this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly ARR ($K)',
                    data: revenueData,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1FB8CD',
                    pointBorderColor: '#1FB8CD',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 200,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            callback: function(value) {
                                return '$' + value + 'K';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
        
        console.log('Revenue chart initialized');
    }

    initializeMissionsChart() {
        const ctx = document.getElementById('missions-chart');
        if (!ctx) {
            console.error('Missions chart canvas not found');
            return;
        }

        this.missionsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Successful', 'Failed', 'In Progress'],
                datasets: [{
                    data: [142, 2, 3],
                    backgroundColor: ['#1FB8CD', '#FF5459', '#FFC185'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
        
        console.log('Missions chart initialized');
    }

    setupWebSocketSimulation() {
        console.log('Starting real-time update simulation...');
        
        setInterval(() => {
            this.updateSystemMetrics();
        }, 3000);

        setInterval(() => {
            this.updateMissionStatus();
        }, 8000);
    }

    updateSystemMetrics() {
        const cpuMetric = document.querySelector('.metric-value');
        if (cpuMetric) {
            const cpuSpans = cpuMetric.querySelectorAll('span');
            if (cpuSpans.length >= 1) {
                const currentCpu = parseInt(cpuSpans[0].textContent);
                const newCpu = Math.max(35, Math.min(75, currentCpu + (Math.random() - 0.5) * 8));
                cpuSpans[0].textContent = `CPU: ${Math.round(newCpu)}%`;
            }
        }

        const latencyMetric = document.querySelector('.metric-value.highlight');
        if (latencyMetric) {
            const currentLatency = parseFloat(latencyMetric.textContent);
            const newLatency = Math.max(6, Math.min(12, currentLatency + (Math.random() - 0.5) * 1.5));
            latencyMetric.textContent = `${newLatency.toFixed(1)}ms latency`;
        }
    }

    updateMissionStatus() {
        const statusIndicator = document.getElementById('connection-status');
        if (statusIndicator) {
            const dot = statusIndicator.querySelector('.status-dot');
            const text = statusIndicator.querySelector('span:last-child');
            
            dot.classList.remove('active');
            text.textContent = 'Updating...';
            
            setTimeout(() => {
                dot.classList.add('active');
                text.textContent = 'Connected';
            }, 800);
        }
    }

    // Action button handlers
    handleNewMission() {
        alert('🚁 New Mission Wizard\n\nThis would open the mission planning interface with:\n• DJI SDK integration\n• Flight path optimization\n• Weather validation\n• Equipment selection\n• Pilot assignment');
    }

    handleEmergencyProtocol() {
        alert('🚨 Emergency Protocol Activated!\n\nHAIL-M agent coordinating:\n• Immediate drone recall\n• Emergency responder notification\n• Real-time incident tracking\n• Safety zone establishment');
    }

    handlePlanMission() {
        alert('📋 Mission Planning\n\nOpening flight planning interface:\n• Interactive waypoint editor\n• Altitude optimization\n• No-fly zone validation\n• Weather impact analysis');
    }

    handleGenerateReport() {
        alert('📊 Generating Report\n\nRhea agent creating:\n• Thermal analysis summary\n• AI detection findings\n• Damage assessment\n• Insurance claim documentation\n• Blockchain verification');
    }

    handleDeployAgent() {
        alert('🤖 Deploy New Agent\n\nAgent deployment options:\n• Custom LangChain workflows\n• Specialized analysis models\n• Multi-drone coordination\n• Emergency response protocols');
    }

    handleViewLogs() {
        alert('📝 Agent Conversation Logs\n\nDisplaying:\n• Inter-agent communications\n• Decision trees\n• Workflow execution\n• Error handling\n• Performance metrics');
    }

    handleAddIntegration() {
        alert('🔌 Add Integration\n\nAvailable integrations:\n• CRM systems (Salesforce, HubSpot)\n• Weather services (NOAA, NWS)\n• Communication (SMS, Email)\n• Insurance APIs\n• Mapping services');
    }

    handleTestConnections() {
        alert('🔍 Testing Connections...\n\nValidating:\n• CRM API endpoints\n• Weather service feeds\n• Blockchain network\n• Cloud storage\n• Communication channels');
        
        setTimeout(() => {
            alert('✅ Connection Test Results\n\n• Salesforce: Connected\n• Weather APIs: Active\n• Blockchain: Synchronized\n• Cloud Services: Operational\n• All systems nominal');
        }, 2000);
    }

    handleScheduleAudit() {
        alert('📅 Schedule Compliance Audit\n\nAudit scheduling:\n• FAA Part 107 compliance\n• GDPR data protection\n• ISO 27001 security\n• SOX financial controls\n• Calendar integration');
    }

    handleExportReport() {
        alert('📄 Export Analytics Report\n\nGenerating comprehensive report:\n• Revenue metrics\n• Mission success rates\n• Equipment utilization\n• ROI analysis\n• PDF/Excel formats');
    }

    handleYOLOAnalysis() {
        alert('🔥 YOLOv8 Thermal Analysis\n\nRunning AI analysis on thermal imagery:\n• Object detection\n• Damage classification\n• Confidence scoring\n• Thermal anomaly detection\n• <10ms inference latency');
    }

    handleTemperatureMap() {
        alert('🌡️ Temperature Mapping\n\nGenerating thermal map:\n• Temperature gradients\n• Hot spot identification\n• Statistical analysis\n• Color-coded visualization\n• Export capabilities');
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing DI AERO dashboard...');
    window.diAeroDashboard = new DIAERODashboard();
});

// Handle window resize for responsive charts
window.addEventListener('resize', () => {
    if (window.diAeroDashboard && window.diAeroDashboard.revenueChart) {
        window.diAeroDashboard.revenueChart.resize();
    }
    if (window.diAeroDashboard && window.diAeroDashboard.missionsChart) {
        window.diAeroDashboard.missionsChart.resize();
    }
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}