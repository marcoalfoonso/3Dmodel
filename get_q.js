//mqtt server connection

const client = mqtt.connect("wss://e4f0d50b37b04ea79745872566f605ff.s1.eu.hivemq.cloud:8884/mqtt",{
    clientId: "web_" + Math.random().toString(16).slice(2, 10),
    username: "MarcoA",
    password: "HATeR3__",
    clean: true
});

console.log("Connecting to HiveMQ Claud...");

client.on("connect", () => {
  console.log("Connecting with Outh");

  client.subscribe(["q1","q2","q3"], (err)=>{
    if(!err){
        console.log("Subscripcion en q1, q2 y q3 exitosa");
    }else{
        console.error("Error en subscripcion q1, q2 y q3:", err);
    }
    });
});

client.on("error", (err) => {
  console.error("Error:", err);
});

let g1 = 0;
let g2 = 0;
let g3 = 0;


document.addEventListener("DOMContentLoaded", function(){

    //se obtienen los valores de mqtt

    client.on("message",(topic,message)=>{
        const value = Number(message.toString());
        console.log("Topic: ",topic,"Value: ",value);


        if(topic === "q1"){
            console.log("q1: ", value);
            g1 = value;
        }

        if(topic === "q2"){
            console.log("q2: ", value);
            g2 = value;
        }

        if(topic === "q3"){
            console.log("q3: ", value);
            g3 = value;
        }

    });


    const container = document.getElementById("scope");
    const renderer = new THREE.WebGLRenderer({antialias:true});
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        100,
        1,
        0.1,
        1000
    );

    camera.position.set(1,1.2,-1.3);
    camera.lookAt(0,0,0);

    function resize(){
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width,height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener("resize", resize);

    const b1 = 0.38;
    const b2 = 0.23;
    const l1 = 0.45;
    const l2 = 0.88;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(3,3,3);
    scene.add(light);

    scene.add(new THREE.AmbientLight(0x404040));


    const robot = new THREE.Group();
    scene.add(robot);

    // BASE
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32),
        new THREE.MeshStandardMaterial({color: 0x444444})
    );
    robot.add(base);

    // JOINT 1
    const joint1 = new THREE.Group();
    joint1.position.y = 0.05;
    base.add(joint1);

    // LINK 1
    const link1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, l1, 32),
        new THREE.MeshStandardMaterial({color: 0xff5555})
    );
    link1.position.y = l1/2;
    joint1.add(link1);

    // JOINT 2
    const joint2 = new THREE.Group();
    joint2.position.y = l1;
    joint1.add(joint2);

    // LINK 2
    const link2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, l2, 32),
        new THREE.MeshStandardMaterial({color: 0x55ff55})
    );
    link2.position.y = l2/2;
    joint2.add(link2);

    // JOINT 3
    const joint3 = new THREE.Group();
    joint3.position.y = l2;
    joint2.add(joint3);

    // LINK 3 (efector)
    const link3 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.2, 32),
        new THREE.MeshStandardMaterial({color: 0x5555ff})
    );
    link3.position.y = 0.1;
    joint3.add(link3);


    let lastSend = 0;
    let lastSend2 = 0;
    let lastSend3 = 0;


    let q1 = g1 * Math.PI/180;
    let q2 = g2 * Math.PI/180;
    let q3 = g3 * Math.PI/180;

    function animate(){
        joint1.rotation.y = q1;
        joint2.rotation.z = q2;
        joint3.rotation.z = q3;

        renderer.render(scene, camera);
    }   

    renderer.setAnimationLoop(animate);

});