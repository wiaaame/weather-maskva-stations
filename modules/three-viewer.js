import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ThreeViewer {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.options = {
            backgroundColor: null, // Прозрачный фон
            cameraPosition: { x: 3, y: 2, z: 5 },
            autoRotate: false,
            transparent: true, // Включить прозрачность
            showGrid: false, // Скрыть сетку
            showAxes: false, // Скрыть оси
            ...options
        };
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        
        this.init();
    }
    
    init() {
        const width = this.container.clientWidth;
        const height = 400;
        
        // Сцена с прозрачным фоном
        this.scene = new THREE.Scene();
        if (this.options.transparent) {
            this.scene.background = null; // Прозрачный фон
        } else if (this.options.backgroundColor) {
            this.scene.background = new THREE.Color(this.options.backgroundColor);
        }
        
        // Камера
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(
            this.options.cameraPosition.x,
            this.options.cameraPosition.y,
            this.options.cameraPosition.z
        );
        this.camera.lookAt(0, 0, 0);
        
        // Рендерер с прозрачностью
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: this.options.transparent // Включаем альфа-канал
        });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 0); // Полностью прозрачный фон
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Освещение (обязательно для модели)
        this.setupLights();
        
        // Вспомогательные элементы (скрыты по умолчанию)
        if (this.options.showGrid) {
            this.setupGround();
        }
        
        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = this.options.autoRotate;
        this.controls.autoRotateSpeed = 1.0;
        this.controls.enableZoom = true;
        this.controls.zoomSpeed = 1.2;
        this.controls.enablePan = true;
        this.controls.panSpeed = 0.8;
        this.controls.target.set(0, 0.5, 0);
        
        // Анимация
        this.animate();
        
        // Обработка resize
        window.addEventListener('resize', () => this.onResize());
    }
    
    setupLights() {
        // Ambient light - мягкий свет со всех сторон
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Main directional light - основной направленный свет
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7);
        mainLight.castShadow = true;
        mainLight.receiveShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 15;
        mainLight.shadow.camera.left = -5;
        mainLight.shadow.camera.right = 5;
        mainLight.shadow.camera.top = 5;
        mainLight.shadow.camera.bottom = -5;
        this.scene.add(mainLight);
        
        // Fill light from below - подсветка снизу
        const fillLight = new THREE.PointLight(0x4466aa, 0.3);
        fillLight.position.set(0, -1, 0);
        this.scene.add(fillLight);
        
        // Back rim light - контровой свет
        const rimLight = new THREE.PointLight(0xffaa66, 0.4);
        rimLight.position.set(-2, 2, -3);
        this.scene.add(rimLight);
        
        // Warm fill front - теплый свет спереди
        const warmLight = new THREE.PointLight(0xff9966, 0.3);
        warmLight.position.set(2, 1, 3);
        this.scene.add(warmLight);
        
        // Additional blue light - дополнительный холодный свет
        const blueLight = new THREE.PointLight(0x6688ff, 0.2);
        blueLight.position.set(3, 1, 1);
        this.scene.add(blueLight);
    }
    
    setupGround() {
        // Сетка (если нужна)
        const gridHelper = new THREE.GridHelper(8, 20, 0x88aaff, 0x335588);
        gridHelper.position.y = -0.6;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.4;
        this.scene.add(gridHelper);
        
        // Плоскость для теней (опционально)
        const shadowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 6),
            new THREE.ShadowMaterial({ 
                opacity: 0.3, 
                color: 0x000000, 
                transparent: true, 
                side: THREE.DoubleSide,
                visible: false
            })
        );
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -0.6;
        shadowPlane.receiveShadow = true;
        this.scene.add(shadowPlane);
    }
    
    centerModel(model) {
        // Вычисляем bounding box модели
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Находим самую нижнюю точку модели
        const minY = box.min.y;
        
        // Смещаем модель так, чтобы основание (minY) оказалось на y = -0.5
        const offsetY = -0.5 - minY;
        
        model.position.y += offsetY;
        
        // Центрируем по X и Z
        model.position.x -= center.x;
        model.position.z -= center.z;
        
        // Настраиваем камеру и controls для оптимального обзора
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = Math.max(maxDim * 1.2, 2.5);
        
        // Позиционируем камеру
        this.camera.position.set(distance * 0.8, distance * 0.7, distance);
        this.controls.target.set(0, size.y * 0.4, 0);
        this.controls.update();
        
        // Анимация появления
        model.scale.set(0, 0, 0);
        this.animateScale(model, 1, 300);
        
        return { size, center };
    }
    
    animateScale(model, targetScale, duration) {
        const startTime = performance.now();
        const startScale = 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const scale = startScale + (targetScale - startScale) * easeProgress;
            
            model.scale.set(scale, scale, scale);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    async loadModel(url, options = {}) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            
            this.showLoadingIndicator();
            
            loader.load(url, 
                (gltf) => {
                    this.hideLoadingIndicator();
                    
                    if (this.model) {
                        this.scene.remove(this.model);
                        if (this.mixer) {
                            this.mixer.stopAllAction();
                        }
                    }
                    
                    this.model = gltf.scene;
                    
                    this.model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });
                    
                    this.centerModel(this.model);
                    this.scene.add(this.model);
                    
                    if (gltf.animations && gltf.animations.length > 0) {
                        this.mixer = new THREE.AnimationMixer(this.model);
                        gltf.animations.forEach((clip) => {
                            const action = this.mixer.clipAction(clip);
                            action.play();
                        });
                    }
                    
                    resolve(gltf);
                },
                (progress) => {
                    const percent = (progress.loaded / progress.total * 100).toFixed(0);
                    this.updateLoadingProgress(percent);
                },
                (error) => {
                    this.hideLoadingIndicator();
                    console.error('Ошибка загрузки модели:', error);
                    this.showFallbackModel();
                    reject(error);
                }
            );
        });
    }
    
    showFallbackModel() {
        const geometry = new THREE.SphereGeometry(0.8, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            color: 0x44aaff,
            roughness: 0.3,
            metalness: 0.1,
            emissive: 0x114466,
            emissiveIntensity: 0.3
        });
        
        const fallbackModel = new THREE.Mesh(geometry, material);
        fallbackModel.castShadow = true;
        fallbackModel.receiveShadow = false;
        
        const ringGeometry = new THREE.TorusGeometry(1.0, 0.05, 64, 200);
        const ringMaterial = new THREE.MeshStandardMaterial({ color: 0x88aaff, emissive: 0x224466 });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        fallbackModel.add(ring);
        
        this.model = fallbackModel;
        this.centerModel(this.model);
        this.scene.add(this.model);
    }
    
    showLoadingIndicator() {
        if (!this.loadingDiv) {
            this.loadingDiv = document.createElement('div');
            this.loadingDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 10px 20px;
                border-radius: 30px;
                font-size: 14px;
                z-index: 10;
                pointer-events: none;
                font-family: system-ui, -apple-system, sans-serif;
            `;
            this.container.style.position = 'relative';
            this.container.appendChild(this.loadingDiv);
        }
        this.loadingDiv.style.display = 'block';
        this.loadingDiv.textContent = 'Загрузка 3D модели... 0%';
    }
    
    updateLoadingProgress(percent) {
        if (this.loadingDiv) {
            this.loadingDiv.textContent = `Загрузка 3D модели... ${percent}%`;
        }
    }
    
    hideLoadingIndicator() {
        if (this.loadingDiv) {
            this.loadingDiv.style.display = 'none';
        }
    }
    
    zoomIn() {
        const delta = this.camera.position.clone().sub(this.controls.target);
        const newLength = delta.length() * 0.8;
        delta.normalize();
        this.camera.position.copy(this.controls.target.clone().add(delta.multiplyScalar(newLength)));
        this.controls.update();
    }
    
    zoomOut() {
        const delta = this.camera.position.clone().sub(this.controls.target);
        const newLength = delta.length() * 1.25;
        delta.normalize();
        this.camera.position.copy(this.controls.target.clone().add(delta.multiplyScalar(newLength)));
        this.controls.update();
    }
    
    viewFront() {
        const target = this.controls.target;
        this.camera.position.set(0, target.y, 5);
        this.controls.target.set(target.x, target.y, target.z);
        this.controls.update();
    }
    
    viewBack() {
        const target = this.controls.target;
        this.camera.position.set(0, target.y, -5);
        this.controls.target.set(target.x, target.y, target.z);
        this.controls.update();
    }
    
    viewLeft() {
        const target = this.controls.target;
        this.camera.position.set(-5, target.y, 0);
        this.controls.target.set(target.x, target.y, target.z);
        this.controls.update();
    }
    
    viewRight() {
        const target = this.controls.target;
        this.camera.position.set(5, target.y, 0);
        this.controls.target.set(target.x, target.y, target.z);
        this.controls.update();
    }
    
    viewTop() {
        const target = this.controls.target;
        this.camera.position.set(0, 5, 0);
        this.controls.target.set(target.x, target.y, target.z);
        this.controls.update();
    }
    
    resetView() {
        this.camera.position.set(3, 2, 5);
        this.controls.target.set(0, 0.5, 0);
        this.controls.update();
    }
    
    toggleAutoRotate() {
        this.controls.autoRotate = !this.controls.autoRotate;
        return this.controls.autoRotate;
    }
    
    setBackgroundColor(color) {
        if (color === null) {
            this.scene.background = null;
            this.renderer.setClearColor(0x000000, 0);
        } else {
            this.scene.background = new THREE.Color(color);
            this.renderer.setClearColor(color, 1);
        }
    }
    
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.controls) {
            this.controls.dispose();
        }
        window.removeEventListener('resize', () => this.onResize());
    }
    
    onResize() {
        const width = this.container.clientWidth;
        const height = 400;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}