import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ThreeDViewer {
    constructor(containerId, modelPath = '/models/weather-station.glb') {
        this.containerId = containerId;
        this.modelPath = modelPath;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const width = container.clientWidth;
        const height = 400;

        // Сцена
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0d1c2a);
        this.scene.fog = new THREE.FogExp2(0x0d1c2a, 0.008);

        // Камера
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(3, 2, 5);
        this.camera.lookAt(0, 0.5, 0);

        // Рендерер
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);

        // Орбит контрол
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = false;
        this.controls.enableZoom = true;
        this.controls.target.set(0, 0.5, 0);

        // Освещение
        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);
        
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7);
        mainLight.castShadow = true;
        this.scene.add(mainLight);
        
        const fillLight = new THREE.PointLight(0x4466cc, 0.3);
        fillLight.position.set(-2, 1, 3);
        this.scene.add(fillLight);
        
        const backLight = new THREE.PointLight(0xffaa66, 0.2);
        backLight.position.set(0, 1, -3);
        this.scene.add(backLight);

        // Пол-сетка
        const gridHelper = new THREE.GridHelper(10, 20, 0x88aaff, 0x335588);
        gridHelper.position.y = -0.5;
        this.scene.add(gridHelper);

        // Загрузка GLB модели
        const loader = new GLTFLoader();
        loader.load(this.modelPath, 
            (gltf) => {
                this.model = gltf.scene;
                this.model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                // Центрирование модели
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                this.model.position.x = -center.x;
                this.model.position.z = -center.z;
                this.model.position.y = -box.min.y;
                this.scene.add(this.model);
            },
            (xhr) => {
                console.log('Загрузка 3D модели: ' + Math.round(xhr.loaded / xhr.total * 100) + '%');
            },
            (error) => {
                console.warn('Модель не найдена, использую стандартную фигуру');
                this.addFallbackModel();
            }
        );

        this.animate();
    }

    addFallbackModel() {
        // Метеорологический зонд (заглушка)
        const baseGeo = new THREE.CylinderGeometry(0.6, 0.8, 1.2, 8);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x4a7db4, metalness: 0.6 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.castShadow = true;
        base.position.y = 0.4;
        this.scene.add(base);
        
        const poleGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 6);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0xccccdd, metalness: 0.8 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.castShadow = true;
        pole.position.y = 1.2;
        this.scene.add(pole);
        
        const sensorGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const sensorMat = new THREE.MeshStandardMaterial({ color: 0xffaa44, emissive: 0x442200 });
        const sensor = new THREE.Mesh(sensorGeo, sensorMat);
        sensor.castShadow = true;
        sensor.position.y = 1.9;
        this.scene.add(sensor);
    }

    animate() {
        if (!this.renderer) return;
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setCameraView(view) {
        if (!this.camera || !this.controls) return;
        switch(view) {
            case 'front':
                this.camera.position.set(0, 0.5, 5);
                break;
            case 'back':
                this.camera.position.set(0, 0.5, -5);
                break;
            case 'left':
                this.camera.position.set(-5, 0.5, 0);
                break;
            case 'right':
                this.camera.position.set(5, 0.5, 0);
                break;
        }
        this.controls.target.set(0, 0.5, 0);
        this.controls.update();
    }

    zoom(delta) {
        if (!this.camera) return;
        const newZ = this.camera.position.z - delta;
        if (newZ > 1.5 && newZ < 8) {
            this.camera.position.z = newZ;
            this.controls.update();
        }
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}