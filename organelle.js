import * as THREE from "three";

import { OrbitControls } from
"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const organelles = {
    nucleus: {
        name: "Nucleus",
        description: "The nucleus is the control centre of an animal cell. It contains DNA, which stores the genetic instructions needed for cell activities.",
        structure: "It is surrounded by a double-layered nuclear envelope containing pores. Inside are chromatin and a nucleolus.",
        function: "Controls cell activities, stores genetic information and helps regulate growth and cell division.",
        analogy: "The nucleus is like a computer's CPU. It stores instructions and coordinates the system's activities.",
        color: 0x9165d5,
        type: "nucleus"
    },

    mitochondria: {
        name: "Mitochondria",
        description: "Mitochondria are organelles that produce most of the usable energy required by the cell.",
        structure: "They have an outer membrane and a folded inner membrane. The folds are called cristae.",
        function: "They carry out cellular respiration and produce ATP, the cell's main energy-carrying molecule.",
        analogy: "Mitochondria are like a computer's power supply because they provide energy for the system.",
        color: 0xe58b48,
        type: "mitochondria"
    },

    ribosomes: {
        name: "Ribosomes",
        description: "Ribosomes are tiny structures responsible for making proteins.",
        structure: "They consist of two subunits made of ribosomal RNA and proteins. They may be free in the cytoplasm or attached to rough ER.",
        function: "They read instructions from messenger RNA and assemble amino acids into proteins.",
        analogy: "Ribosomes are like manufacturing units that produce the components required by a computer.",
        color: 0xffd16b,
        type: "ribosomes"
    },

    er: {
        name: "Endoplasmic Reticulum",
        description: "The endoplasmic reticulum is a network of membranes involved in producing and transporting materials.",
        structure: "Rough ER has ribosomes attached to its surface. Smooth ER does not have ribosomes.",
        function: "Rough ER helps make and process proteins. Smooth ER helps produce lipids and performs other chemical functions.",
        analogy: "The ER is like a computer's internal communication network, moving materials between different parts.",
        color: 0x4da9d2,
        type: "er"
    },

    golgi: {
        name: "Golgi Apparatus",
        description: "The Golgi apparatus processes and prepares proteins and lipids for delivery.",
        structure: "It consists of a series of flattened, stacked membrane sacs called cisternae.",
        function: "It modifies, sorts and packages materials into vesicles for transport.",
        analogy: "The Golgi apparatus is like a packaging and delivery centre that prepares items for distribution.",
        color: 0xe17bba,
        type: "golgi"
    },

    lysosomes: {
        name: "Lysosomes",
        description: "Lysosomes are membrane-bound sacs containing digestive enzymes.",
        structure: "They are small, rounded structures surrounded by a single membrane.",
        function: "They break down waste materials, worn-out cell parts and certain substances taken into the cell.",
        analogy: "Lysosomes are like a computer's cleanup and recycling system.",
        color: 0x65cf91,
        type: "lysosomes"
    },

    membrane: {
        name: "Cell Membrane",
        description: "The cell membrane forms the boundary around the cell and separates its contents from the external environment.",
        structure: "It is mainly made of a phospholipid bilayer containing proteins and other molecules.",
        function: "It selectively controls the movement of substances into and out of the cell and helps with cell communication.",
        analogy: "The cell membrane is like a security gateway that controls what enters and leaves a computer system.",
        color: 0x35bfc5,
        type: "membrane"
    },

    cytoplasm: {
        name: "Cytoplasm",
        description: "Cytoplasm is the material inside the cell membrane, excluding the nucleus.",
        structure: "It contains cytosol, organelles and other suspended materials.",
        function: "It supports organelles and provides the environment for many important chemical reactions.",
        analogy: "Cytoplasm is like the operating environment inside a computer, where different components work together.",
        color: 0x1d8795,
        type: "cytoplasm"
    }
};

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const data = organelles[id];

if (!data) {
    document.getElementById("organelleName").textContent =
        "Organelle not found";

    document.getElementById("organelleDescription").textContent =
        "Please return to the main page and select an organelle.";

} else {
    document.title = data.name + " | CELL-TECH";

    document.getElementById("organelleName").textContent = data.name;
    document.getElementById("organelleDescription").textContent = data.description;
    document.getElementById("organelleStructure").textContent = data.structure;
    document.getElementById("organelleFunction").textContent = data.function;
    document.getElementById("organelleAnalogy").textContent = data.analogy;

    create3DModel(data);
}

function create3DModel(data) {
    const container = document.getElementById("organelle3d");

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;

    scene.add(new THREE.AmbientLight(0xffffff, 2));

    const light = new THREE.PointLight(0x53e0d0, 30);
    light.position.set(4, 5, 6);
    scene.add(light);

    const group = new THREE.Group();
    scene.add(group);

    const mat = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.4
    });

    function sphere(radius, position = [0, 0, 0], scale = [1, 1, 1]) {
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            mat
        );
        mesh.position.set(...position);
        mesh.scale.set(...scale);
        group.add(mesh);
        return mesh;
    }

    function torus(radius, tube, position = [0, 0, 0]) {
        const mesh = new THREE.Mesh(
            new THREE.TorusGeometry(radius, tube, 12, 48),
            mat
        );
        mesh.position.set(...position);
        group.add(mesh);
        return mesh;
    }

    switch (data.type) {

        case "nucleus":
            sphere(1.25);
            sphere(0.4, [0.3, 0.2, 0.9], [1, 1, 1]);
            for (let i = 0; i < 8; i++) {
                torus(1.28, 0.025, [0, 0, 0]);
                group.children[group.children.length - 1].rotation.y =
                    i * Math.PI / 8;
            }
            break;

        case "mitochondria":
            sphere(1, [0, 0, 0], [1.5, 0.7, 0.7]);
            for (let i = -3; i <= 3; i++) {
                const fold = torus(0.3, 0.045, [i * 0.3, 0, 0.35]);
                fold.scale.set(0.7, 0.7, 0.7);
            }
            break;

        case "ribosomes":
            for (let i = 0; i < 18; i++) {
                sphere(0.14, [
                    (Math.random() - 0.5) * 2.5,
                    (Math.random() - 0.5) * 2.5,
                    (Math.random() - 0.5) * 1.5
                ]);
            }
            break;

        case "er":
            for (let i = 0; i < 6; i++) {
                const ring = torus(0.5 + i * 0.13, 0.07);
                ring.rotation.x = Math.PI / 2;
                ring.scale.set(1.5, 0.8, 1);
            }
            break;

        case "golgi":
            for (let i = 0; i < 6; i++) {
                const stack = torus(0.85 - i * 0.09, 0.09, [0, i * 0.2 - 0.5, 0]);
                stack.rotation.x = Math.PI / 2;
                stack.scale.set(1.1, 0.65, 1);
            }
            break;

        case "lysosomes":
            sphere(0.9);
            for (let i = 0; i < 8; i++) {
                sphere(0.12, [
                    Math.cos(i * Math.PI / 4) * 0.5,
                    Math.sin(i * Math.PI / 4) * 0.5,
                    0.5
                ]);
            }
            break;

        case "membrane":
            const shell = new THREE.Mesh(
                new THREE.SphereGeometry(1.4, 48, 48),
                new THREE.MeshPhysicalMaterial({
                    color: data.color,
                    transparent: true,
                    opacity: 0.35,
                    side: THREE.DoubleSide,
                    roughness: 0.2
                })
            );
            group.add(shell);

            for (let i = 0; i < 12; i++) {
                const protein = sphere(0.12, [
                    Math.cos(i * Math.PI / 6) * 1.4,
                    Math.sin(i * Math.PI / 6) * 1.4,
                    0
                ]);
            }
            break;

        case "cytoplasm":
            const cytoplasmMesh = new THREE.Mesh(
                new THREE.SphereGeometry(1.4, 48, 48),
                new THREE.MeshPhysicalMaterial({
                    color: data.color,
                    transparent: true,
                    opacity: 0.45,
                    roughness: 0.5
                })
            );
            group.add(cytoplasmMesh);

            for (let i = 0; i < 12; i++) {
                sphere(0.09, [
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                ]);
            }
            break;
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}