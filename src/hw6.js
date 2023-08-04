// Scene Declartion
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// This defines the initial distance of the camera, you may ignore this as the camera is expected to be dynamic
camera.applyMatrix4(new THREE.Matrix4().makeTranslation(-5, 3, 110));
camera.lookAt(0, -4, 1)


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// helper function for later on
function degrees_to_radians(degrees) {
	var pi = Math.PI;
	return degrees * (pi / 180);
}


// Here we load the cubemap and pitch images, you may change it

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
	'src/pitch/right.jpg',
	'src/pitch/left.jpg',
	'src/pitch/top.jpg',
	'src/pitch/bottom.jpg',
	'src/pitch/front.jpg',
	'src/pitch/back.jpg',
]);
scene.background = texture;


// TODO: Texture Loading
// We usually do the texture loading before we start everything else, as it might take processing time
const textureLoader = new THREE.TextureLoader();
const ballTexture = textureLoader.load('src/textures/soccer_ball.jpg');
const redCardTexture = textureLoader.load('src/textures/red_card.jpg');
const yellowCardTexture = textureLoader.load('src/textures/yellow_card.jpg');

// Create materials for red card and yellow card
const ballMaterial = new THREE.MeshPhongMaterial({ map: ballTexture });
const redCardMaterial = new THREE.MeshPhongMaterial({ map: redCardTexture });
const yellowCardMaterial = new THREE.MeshPhongMaterial({ map: yellowCardTexture });


// TODO: Add Lighting
const light = new THREE.AmbientLight(0xffffff); // white light
scene.add(light);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight1.position.set(0, 1, 1);
scene.add(directionalLight1);
// Second directional light at the end of the routes
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(10, 1, 1); // Change position to where you want the light to be
scene.add(directionalLight2);



// TODO: Goal
// You should copy-paste the goal from the previous exercise here
// Add here the rendering of your goal
const goalHeight = 8; // height of the goal
const ballScale = goalHeight / 16; // ball's scale  1/8 the height of the goal


// Define the radius and height of the cylinders.
const postRadius = ballScale / 8;
const postHeight = goalHeight;

// Goal posts
const postMaterial = new THREE.MeshBasicMaterial({ color: 'white', transparent: true, opacity: 0.5 });
const leftPostGeometry = new THREE.CylinderGeometry(postRadius, postRadius, postHeight);
const leftPost = new THREE.Mesh(leftPostGeometry, postMaterial);
leftPost.applyMatrix4(new THREE.Matrix4().makeTranslation(-goalHeight * 3 / 2, goalHeight / 2, 0));
const rightPostGeometry = new THREE.CylinderGeometry(postRadius, postRadius, postHeight);
const rightPost = new THREE.Mesh(rightPostGeometry, postMaterial);
rightPost.applyMatrix4(new THREE.Matrix4().makeTranslation(goalHeight * 3 / 2, goalHeight / 2, 0));

// Create the top crossbar.
const crossbarGeometry = new THREE.CylinderGeometry(postRadius, postRadius, 3 * goalHeight, 32);
const crossbar = new THREE.Mesh(crossbarGeometry, postMaterial);
crossbar.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(90)).premultiply(new THREE.Matrix4().makeTranslation(0, goalHeight, 0)));

// Define angle of back supports (35 degrees converted to radians)
const angle = degrees_to_radians(35);
const supportLength = goalHeight / Math.cos(angle);
// Create the back supports
const supportGeometry = new THREE.CylinderGeometry(postRadius, postRadius, supportLength, 32);
const leftSupport = new THREE.Mesh(supportGeometry, postMaterial);
const rightSupport = new THREE.Mesh(supportGeometry, postMaterial);
leftSupport.applyMatrix4(new THREE.Matrix4().makeTranslation(-goalHeight * 3 / 2, goalHeight / 5, -1.5 * goalHeight / 2.5).premultiply(new THREE.Matrix4().makeRotationX(degrees_to_radians(37))));
rightSupport.applyMatrix4(new THREE.Matrix4().makeTranslation(goalHeight * 3 / 2, goalHeight / 5, -1.5 * goalHeight / 2.5).premultiply(new THREE.Matrix4().makeRotationX(degrees_to_radians(37))));

const netMaterial = new THREE.MeshBasicMaterial({ color: 'lightgray', side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
// Back net
const backNetGeometry = new THREE.PlaneGeometry(goalHeight * 3, goalHeight + 1.5);
const backNet = new THREE.Mesh(backNetGeometry, netMaterial);
backNet.applyMatrix4(new THREE.Matrix4().makeTranslation(0, goalHeight / 5, -1.5 * goalHeight / 2.5).premultiply(new THREE.Matrix4().makeRotationX(degrees_to_radians(37))));

//Side nets
const triangleVertices = [
	-goalHeight * 3 / 2, 0, 0,    // bottom right vertex
	-goalHeight * 3 / 2, goalHeight, 0, // top vertex
	-goalHeight * 3 / 2, 0.25, -1.5 * goalHeight / 2,    // bottom left vertex
];
const triangleGeometry = new THREE.BufferGeometry();
triangleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(triangleVertices, 3));
const indices = [0, 1, 2];
triangleGeometry.setIndex(indices);
const triangleMaterial = new THREE.MeshBasicMaterial({ color: 'lightgray', side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
const rightSideNet = triangleMesh.clone();
rightSideNet.scale.x = -1;

// Create the Torus Geometry for the rings
const torusGeometry = new THREE.TorusGeometry(postRadius * 5, postRadius / 0.3, 16, 100);

// Create the Torus Material
const torusMaterial = new THREE.MeshBasicMaterial({ color: 'white', transparent: true, opacity: 0.5 });

// Rings for the front legs of the goalposts
const frontLeftRing = new THREE.Mesh(torusGeometry, torusMaterial);
const frontRightRing = new THREE.Mesh(torusGeometry, torusMaterial);


// Rings for the back legs of the goalposts
const backLeftRing = new THREE.Mesh(torusGeometry, torusMaterial);
const backRightRing = new THREE.Mesh(torusGeometry, torusMaterial);

//Position the rings
frontLeftRing.applyMatrix4(new THREE.Matrix4().makeTranslation(-goalHeight * 3 / 2, 0, 0).premultiply(new THREE.Matrix4().makeRotationX(degrees_to_radians(90))));
frontRightRing.applyMatrix4(new THREE.Matrix4().makeTranslation(goalHeight * 3 / 2, 0, 0).premultiply(new THREE.Matrix4().makeRotationX(degrees_to_radians(90))));

let deltaZ = supportLength * Math.sin(angle);
backLeftRing.applyMatrix4(new THREE.Matrix4().makeTranslation(-goalHeight * 3 / 2, 0, -0.2).premultiply(new THREE.Matrix4().makeRotationX(degrees_to_radians(90))));
backLeftRing.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, - deltaZ));
backRightRing.applyMatrix4(new THREE.Matrix4().makeTranslation(goalHeight * 3 / 2, 0, -0.2).premultiply(new THREE.Matrix4().makeRotationX(degrees_to_radians(90))));
backRightRing.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, - deltaZ));

// Create a group
const goalGroup = new THREE.Group();

// Add the goal components to the group
goalGroup.add(leftPost);
goalGroup.add(rightPost);
goalGroup.add(crossbar);
goalGroup.add(leftSupport);
goalGroup.add(rightSupport);
goalGroup.add(backNet);
goalGroup.add(triangleMesh);
goalGroup.add(rightSideNet);
goalGroup.add(frontLeftRing);
goalGroup.add(frontRightRing);
goalGroup.add(backLeftRing);
goalGroup.add(backRightRing);

// Add the group to the scene
scene.add(goalGroup);


// TODO: Ball
// You should add the ball with the soccer.jpg texture here
const ballGeometry = new THREE.SphereGeometry(ballScale, 32, 32); // This creates a new sphere geometry with a radius equal to ballScale. The other parameters like widthSegments and heightSegments are left as their default values, which are enough to make the sphere look round.
const ball = new THREE.Mesh(ballGeometry, ballMaterial); // This creates a new mesh with the ball's geometry and material. A mesh is an object that takes a geometry, and applies a material to it, which we can then insert to our scene, and move freely around.
// Position the ball
ball.applyMatrix4(new THREE.Matrix4().makeTranslation(0, ballScale, 3)); // This moves the ball 3 units away from the goal along the z-axis. The ball is also raised to its radius's height (ballScale) along the y-axis so that it's resting on the ground instead of being half-submerged.
// Add the ball to the scene
scene.add(ball);



// TODO: Bezier Curves
// Define the start, control, and end points
var start = new THREE.Vector3(0, ballScale, 100);
var end = new THREE.Vector3(0, goalHeight / 2, 0);

// Define control points
var controlRightWinger = new THREE.Vector3(50, 0, 50);
var controlCenterForward = new THREE.Vector3(0, 50, 50);
var controlLeftWinger = new THREE.Vector3(-50, 0, 50);

// Define the Bezier Curves
var curveRightWinger = new THREE.QuadraticBezierCurve3(start, controlRightWinger, end);
var curveCenterForward = new THREE.QuadraticBezierCurve3(start, controlCenterForward, end);
var curveLeftWinger = new THREE.QuadraticBezierCurve3(start, controlLeftWinger, end);

var routes = [curveRightWinger, curveCenterForward, curveLeftWinger];
var currentRouteIndex = 0;


// TODO: Camera Settings
// Set the camera following the ball here
camera.position.x = ball.position.x;
camera.position.y = ball.position.y + 5; // offset the camera above the ball
camera.position.z = ball.position.z + 10; // offset the camera behind the ball
camera.lookAt(ball.position); // make the camera look at the ball


// TODO: Add collectible cards with textures
// Clear cards array and reset variables
let cards = [];
let currentCardIndex = 0;
let yellowCardsCollected = 0;
let redCardsCollected = 0;

// Define the material and geometry of cards
let cardMaterial = [new THREE.MeshBasicMaterial({ color: 'red' }), new THREE.MeshBasicMaterial({ color: 'yellow' })];
let cardGeometry = new THREE.PlaneGeometry(2, 3);

// Function to create a card with the right color
function createCard(color) {
	let material = color === "red" ? cardMaterial[0] : cardMaterial[1];
	return new THREE.Mesh(cardGeometry, material);
}

// Create 3 yellow and 3 red cards for each route
for (let i = 0; i < routes.length; i++) {
	for (let j = 0; j < 6; j++) {
		let t = (j * 0.15) + Math.random() * 0.2;  // evenly distributed along the route
		let card = {
			route: routes[i],
			t: t,
			object: createCard(j < 3 ? "red" : "yellow"),  // Create a new card with the right color
			color: j < 3 ? "red" : "yellow",  // Assign card color
		};
		let cardPosition = routes[i].getPoint(t);
		card.object.position.set(cardPosition.x, cardPosition.y, cardPosition.z);
		scene.add(card.object);
		cards.push(card);
	}
}



// TODO: Add keyboard event
// We wrote some of the function for you
const handle_keydown = (e) => {
	if (e.code == 'ArrowLeft') {
		currentRouteIndex--;
		if (currentRouteIndex < 0) {
			currentRouteIndex = routes.length - 1;
		}
	} else if (e.code == 'ArrowRight') {
		currentRouteIndex++;
		if (currentRouteIndex >= routes.length) {
			currentRouteIndex = 0;
		}
	}

	// reset the ball to the start of the new route
	ball.position.set(routes[currentRouteIndex].v0.x, routes[currentRouteIndex].v0.y, routes[currentRouteIndex].v0.z);

	// reset any other necessary variables here
}
document.addEventListener('keydown', handle_keydown);

let increment = 0;
const increments = 1000; // the higher this number, the slower the ball will move



// Hit cards
var hitYellowCard = 0;
var hitRedCard = 0;
var score = 200;



// Calculate the collision between ball and cards
function calculateCollision(ball, cards) {
    let ballPosition = ball.position;

    for(let i = 0; i < cards.length; i++) {
        let cardPosition = cards[i].object.position;
        let distance = ballPosition.distanceTo(cardPosition);

        // Let's say the ball's radius is half of the ball's scale
        // And the card's radius is half of card's width, you can adjust them based on your actual model
        let ballRadius = ballScale / 2;
        let cardRadius = 1; // half of card's width

        if(distance < (ballRadius + cardRadius)) {
            console.log('Collision detected!');
            handleCollision(cards[i]);

            // Remove the card from the cards array
            cards.splice(i, 1);

            break; // One collision per frame is enough
        }
    }
}

// Handle collision action
function handleCollision(card) {
    // Remove the card from scene
    scene.remove(card.object);

    // Add the score
    if(card.color === 'yellow') {
        hitYellowCard++;
    } else {
        hitRedCard++;
    }
}


function animate() {


	requestAnimationFrame(animate);



	// TODO: Animation for the ball's position
	// get the current point on the curve
	// If there's no route to follow, we don't do anything
	if (routes.length === 0) {
		renderer.render(scene, camera);
		return;
	}

	// get the current point on the curve
	let currentRoute = routes[currentRouteIndex];
	let t = increment / increments;
	let point = currentRoute.getPoint(t);

	// set the ball's position to the point
	ball.position.set(point.x, point.y, point.z);

	// rotate the ball
	ball.rotation.y += 0.01;

	// make the camera follow the ball
	camera.position.x = ball.position.x;
	camera.position.y = ball.position.y + 5; // offset the camera above the ball
	camera.position.z = ball.position.z + 10; // offset the camera behind the ball
	camera.lookAt(ball.position); // make the camera look at the ball

	// increment the counter
	increment = (increment + 1) % increments;

	// Test if we are at the end of the current curve
	if (increment === 0) {
		
		// Move to next route
		currentRouteIndex = (currentRouteIndex + 1) % routes.length;

		score =  100 * Math.pow(2, -((hitYellowCard + hitRedCard * 10) / 10))
		alert("Your score is:"  + score);
	}

	calculateCollision(ball, cards);


	renderer.render(scene, camera);

}
animate()