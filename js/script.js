//Зареждаме webgl и canvas 
const canvas = document.querySelector('.webgl')
const overlay = document.querySelector('.overlay')

const loadingManager = new THREE.LoadingManager(
    () => {
        window.setTimeout(() => {
            gsap.to(overlay, {
                duration: 2,
                opacity: 0,
                delay: 1
            })
            gsap.to(overlay, {
                duration: 1,
                display: 'none',
                delay: 2
            })

        }, 2000)
    },
    () => {
    },
    () => {
        console.error('error');
    }
)


//Зареждаме сцената
const scene = new THREE.Scene()

//Зареждаме GLTF model
let skull = null;
let base = new THREE.Object3D();
scene.add(base);
const gltfLoader = new THREE.GLTFLoader(loadingManager)
gltfLoader.load('./assets/gltf/scene.gltf', (gltf) => {
    base.add(gltf.scene)
})

//Set-ваме резолюцията на екрана
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Прилагаме перспектива и добавяме камерата
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height)
camera.position.z = 6
scene.add(camera)

//Създаваме нов източник на светлина и го добавяме към сцената
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.z = 1.5
scene.add(pointLight)

//Създаваме векторно пространство, raycaster за светлината, мишката и вектор за пресичане на точката
var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var pointOfIntersection = new THREE.Vector3();

//Закачаме събитие към мърдането на мишката
canvas.addEventListener("mousemove", onMouseMove, false);

const cursor = document.querySelector(".cursor");
const cursorBorder = document.querySelector(".cursor-border");

const cursorPos = new THREE.Vector2();
const cursorBorderPos = new THREE.Vector2();


//функция за промянат на светлината, модела и позицията на мишката спрямо потребителското мърдане на мишката
function onMouseMove(e) {
    cursorPos.x = e.clientX
    cursorPos.y = e.clientY

    mouse.x = (cursorPos.x / sizes.width) * 2 - 1
    mouse.y = -(cursorPos.y / sizes.height) * 2 + 1

    pointLight.position.x = mouse.x
    pointLight.position.y = mouse.y

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, pointOfIntersection);
    base.lookAt(pointOfIntersection);

    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cursor.style.opacity = 1;
    cursor.style.visibility = 'visible';
   
    cursorBorder.style.opacity = 1;
    cursorBorder.style.visibility = 'visible';
}

//Създаваме renderer и задаваме стойностите
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antiAlias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

//Създаваме animationLoop
renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);

    const easting = 8;
    cursorBorderPos.x += (cursorPos.x - cursorBorderPos.x) / easting;
    cursorBorderPos.y += (cursorPos.y - cursorBorderPos.y) / easting;

    cursorBorder.style.transform = `translate(${cursorBorderPos.x}px, ${cursorBorderPos.y}px)`;
});