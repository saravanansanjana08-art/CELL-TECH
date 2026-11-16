
import * as THREE from "three";

import { OrbitControls } from
"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("cell3d");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07111f);

const camera = new THREE.PerspectiveCamera(
    40,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 13);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

container.appendChild(renderer.domElement);

// CAMERA CONTROLS
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;
controls.minDistance = 7;
controls.maxDistance = 20;

// LIGHTING
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const mainLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

mainLight.position.set(6, 8, 10);
mainLight.castShadow = true;
scene.add(mainLight);

const blueLight = new THREE.PointLight(
    0x31c9df,
    35,
    30
);

blueLight.position.set(-5, 2, 4);
scene.add(blueLight);

const purpleLight = new THREE.PointLight(
    0x9869e8,
    25,
    25
);

purpleLight.position.set(4, -4, -3);
scene.add(purpleLight);

// MAIN CELL
const cell = new THREE.Group();
scene.add(cell);

const clickableObjects = [];

function createMaterial(color, options = {}) {
    return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.42,
        metalness: 0,
        clearcoat: 0.35,
        ...options
    });
}

function addSphere(
    parent,
    radius,
    color,
    position,
    scale = [1, 1, 1],
    options = {}
) {
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 48, 48),
        createMaterial(color, options)
    );

    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);
    return mesh;
}

function addClickable(group, id, position, hitRadius = 0.9) {
    group.position.set(...position);

    const hitbox = new THREE.Mesh(
        new THREE.SphereGeometry(hitRadius, 20, 20),
        new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false
        })
    );

    hitbox.userData.organelleId = id;
    group.add(hitbox);

    clickableObjects.push(hitbox);
    cell.add(group);
}

// CELL MEMBRANE
const membrane = new THREE.Mesh(
    new THREE.SphereGeometry(4.7, 96, 96),
    createMaterial(0x42c6d0, {
        transparent: true,
        opacity: 0.18,
        transmission: 0.15,
        thickness: 0.4,
        roughness: 0.22,
        side: THREE.DoubleSide
    })
);

membrane.receiveShadow = true;
cell.add(membrane);

// Outer membrane surface highlight
const membraneOutline = new THREE.Mesh(
    new THREE.SphereGeometry(4.72, 96, 96),
    new THREE.MeshBasicMaterial({
        color: 0x4adbe0,
        wireframe: true,
        transparent: true,
        opacity: 0.035
    })
);

cell.add(membraneOutline);

// CYTOPLASM
addSphere(
    cell,
    4.45,
    0x328e9c,
    [0, 0, 0],
    [1, 1, 1],
    {
        transparent: true,
        opacity: 0.10,
        roughness: 0.65
    }
);

// NUCLEUS
const nucleus = new THREE.Group();

addSphere(
    nucleus,
    1.35,
    0x7654b9,
    [0, 0, 0],
    [1, 1, 0.9],
    { roughness: 0.55 }
);

// Nuclear envelope
const envelope = new THREE.Mesh(
    new THREE.SphereGeometry(1.39, 64, 64),
    createMaterial(0xb58bea, {
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide
    })
);

nucleus.add(envelope);

// Nucleolus
addSphere(
    nucleus,
    0.43,
    0xe8a5d5,
    [0.2, 0.15, 0.95],
    [1, 1, 0.75]
);

// Chromatin strands
for (let i = 0; i < 7; i++) {
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.7, -0.4 + i * 0.12, 0.4),
        new THREE.Vector3(-0.3, 0.4, 0.65),
        new THREE.Vector3(0.2, -0.5, 0.6),
        new THREE.Vector3(0.7, 0.4, 0.35)
    ]);

    const strand = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 32, 0.035, 8, false),
        createMaterial(0xd3b5fa)
    );

    nucleus.add(strand);
}

// Nuclear pores
for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;

    const pore = addSphere(
        nucleus,
        0.07,
        0xe9d4ff,
        [
            Math.cos(angle) * 1.35,
            Math.sin(angle) * 1.35,
            0
        ]
    );
}

addClickable(
    nucleus,
    "nucleus",
    [0, 0.3, 0],
    1.5
);

// MITOCHONDRIA
function createMitochondria(position, rotation) {
    const group = new THREE.Group();

    addSphere(
        group,
        0.75,
        0xc8783c,
        [0, 0, 0],
        [1.5, 0.7, 0.8]
    );

    // Inner membrane folds
    for (let i = -3; i <= 3; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(i * 0.18, -0.2, 0.25),
            new THREE.Vector3(i * 0.18 + 0.1, 0.2, 0.3),
            new THREE.Vector3(i * 0.18, -0.15, 0.35)
        ]);

        const fold = new THREE.Mesh(
            new THREE.TubeGeometry(curve, 20, 0.055, 8),
            createMaterial(0xffcf8d)
        );

        group.add(fold);
    }

    group.rotation.z = rotation;

    addClickable(
        group,
        "mitochondria",
        position,
        0.95
    );
}

createMitochondria([2.4, 1.7, 0.6], 0.6);
createMitochondria([-2.4, -1.6, 0.5], -0.7);
createMitochondria([1.8, -2.4, -1.3], 0.3);

// ENDOPLASMIC RETICULUM
const er = new THREE.Group();

for (let i = 0; i < 6; i++) {
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.1, i * 0.15, 0),
        new THREE.Vector3(-0.6, 0.5 + i * 0.1, 0.2),
        new THREE.Vector3(0, -0.3 + i * 0.12, 0.3),
        new THREE.Vector3(0.8, 0.5 + i * 0.1, 0)
    ]);

    const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 48, 0.09, 12, false),
        createMaterial(0x499ec9)
    );

    er.add(tube);

    // Ribosomes on rough ER
    for (let j = 0; j < 4; j++) {
        addSphere(
            er,
            0.055,
            0xffdc92,
            [
                -0.8 + j * 0.4,
                i * 0.15,
                0.12
            ]
        );
    }
}

addClickable(
    er,
    "er",
    [-2.1, 0.4, -1],
    1.15
);

// GOLGI APPARATUS
const golgi = new THREE.Group();

for (let i = 0; i < 6; i++) {
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.9, i * 0.18 - 0.5, 0),
        new THREE.Vector3(-0.5, i * 0.18 - 0.5, 0.1),
        new THREE.Vector3(0.3, i * 0.18 - 0.5, 0.1),
        new THREE.Vector3(0.9, i * 0.18 - 0.5, 0)
    ]);

    const stack = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 32, 0.1, 12),
        createMaterial(0xd98bbd)
    );

    golgi.add(stack);
}

// Golgi vesicles
for (let i = 0; i < 8; i++) {
    addSphere(
        golgi,
        0.12,
        0xf1b5d9,
        [
            Math.cos(i) * 1.1,
            Math.sin(i) * 0.8,
            0.1
        ]
    );
}

addClickable(
    golgi,
    "golgi",
    [2.3, -1.5, -1],
    1.05
);

// RIBOSOMES
const ribosomes = new THREE.Group();

for (let i = 0; i < 35; i++) {
    addSphere(
        ribosomes,
        0.09,
        0xe6c47b,
        [
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2
        ]
    );
}

addClickable(
    ribosomes,
    "ribosomes",
    [-1.4, 1.8, 1.5],
    0.85
);

// LYSOSOMES
const lysosomes = new THREE.Group();

for (let i = 0; i < 5; i++) {
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 32, 32),
        createMaterial(0x6bc58b, {
            roughness: 0.3
        })
    );

    ball.position.set(
        Math.cos(i * 1.25) * 0.5,
        Math.sin(i * 1.25) * 0.5,
        0
    );

    lysosomes.add(ball);
}

addClickable(
    lysosomes,
    "lysosomes",
    [1.5, 1.8, -1.5],
    0.85
);

// MEMBRANE CLICK TARGET
const membraneRing = new THREE.Mesh(
    new THREE.TorusGeometry(4.65, 0.11, 12, 96),
    new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
    })
);

membraneRing.userData.organelleId = "membrane";
membraneRing.rotation.x = Math.PI / 2;
cell.add(membraneRing);
clickableObjects.push(membraneRing);

// ORGANELLE CARDS
const organelleData = [
    ["nucleus", "Nucleus", "Control centre of the cell"],
    ["mitochondria", "Mitochondria", "Energy production"],
    ["ribosomes", "Ribosomes", "Protein synthesis"],
    ["er", "Endoplasmic Reticulum", "Transport network"],
    ["golgi", "Golgi Apparatus", "Packaging centre"],
    ["lysosomes", "Lysosomes", "Waste breakdown"],
    ["membrane", "Cell Membrane", "Selective protection"],
    ["cytoplasm", "Cytoplasm", "Internal cell medium"]
];

const list = document.getElementById("organelle-list");

organelleData.forEach(([id, name, description]) => {
    const card = document.createElement("button");

    card.className = "organelle-card";

    card.innerHTML = `
        <h3>${name}</h3>
        <p>${description}</p>
    `;

    card.onclick = () => {
        window.location.href = `organelle.html?id=${id}`;
    };

    list.appendChild(card);
});

// CLICK TO EXPLORE
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener("pointerdown", event => {
    renderer.userData.startX = event.clientX;
    renderer.userData.startY = event.clientY;
});

renderer.domElement.addEventListener("click", event => {
    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;

    mouse.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(
        clickableObjects,
        false
    );

    if (hits.length > 0) {
        const id = hits[0].object.userData.organelleId;

        if (id) {
            window.location.href =
                `organelle.html?id=${id}`;
        }
    }
});

// ANIMATION
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

animate();

// RESPONSIVE SIZE
window.addEventListener("resize", () => {
    camera.aspect =
        container.clientWidth / container.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );
});
