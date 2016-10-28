(function(window, document, THREE) {

  window.RAF= (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
  })();

  var width = window.innerWidth,
      height = window.innerHeight,
      view_angle = 45,
      aspect = width / height,
      near = 0.1,
      far = 10000;

  var container = document.getElementById('xmas-field');
  console.log((container));

  // create a WebGL renderer, camera
  // and a scene
  var renderer = new THREE.WebGLRenderer({antialias: true});
  var camera =
    new THREE.PerspectiveCamera(
      view_angle,
      aspect,
      near,
      far);

  var scene = new THREE.Scene();
  window.scene = scene;

  // add the camera to the scene
  scene.add(camera);

  // the camera starts at 0,0,0
  // so pull it back
  camera.position.z = 100;

  // start the renderer
  renderer.setSize(width, height);

  // attach the render-supplied DOM element
  container.appendChild( renderer.domElement );

  // set up the snowflake vars
  var radius = 0.5,
      segments = 10,
      rings = 10;

  var snowflakeMaterial = new THREE.MeshLambertMaterial(
    {
      color: 0xffffff
    });

	var treeMaterial = new THREE.MeshLambertMaterial(
		{
			color: 0x006600
		}
	);

	var landscape = new THREE.Mesh(
		new THREE.SphereGeometry(
			180, 40, 50
		),
		snowflakeMaterial
	);

	landscape.position.y = -200;
	scene.add(landscape);

	var tree = new THREE.Mesh(
		new THREE.CylinderGeometry(
			0, 10, 50, 30, 30
		),
		treeMaterial
	);

	scene.add(tree);

	for(var i = 0; i < 30; i++) {
		tree = new THREE.Mesh(
			new THREE.CylinderGeometry(
				0, 5, Math.random() * 15 + 25, 30, 30
			),
			treeMaterial
		);

		tree.position.x = Math.random() * 80 - 40;
		tree.position.z = Math.random() * 80 - 40;
		tree.position.y = -25;

		scene.add(tree);
	}


  // create a new mesh with
  // snowflake geometry - we will cover
  // the snowflakeMaterial next!
  var snowflake = new THREE.Mesh(

    new THREE.SphereGeometry(
      radius,
      segments,
      rings),

    snowflakeMaterial);

  // add the snowflake to the scene
  // scene.add(snowflake);

  // create a point light
  var pointLight = new THREE.PointLight(0xFFFFFF);
  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

	pointLight = new THREE.PointLight(0xFFCCCC);
  pointLight.position.x = -10;
  pointLight.position.y = 50;
  pointLight.position.z = -130;

  // add to the scene
  scene.add(pointLight);

	var movingLight = new THREE.PointLight(0xFFFFFF);
	scene.add(movingLight);

  var pl2 = new THREE.PointLight(0xffffff);
  pl2.position.x = 0;
  pl2.position.y = -10;
  pl2.position.z = 1000;
  scene.add(pl2);

  var dx = 0.1;
  var dy = 0.1;

  var pointMaterial = new THREE.MeshLambertMaterial({
    color: 0x000066
  });

  points = [];
  window.points = points;
  window.snowflake = snowflake;

	var center = new THREE.Vector3(0,0,0);

  var frameCount = 0;
	var MIN_X = -80, MAX_X = 80,
			MIN_Y = -50, MAX_Y = 80,
	    MIN_Z = -80, MAX_Z = 80;

  (function drawLoop() {
    RAF(drawLoop);
    frameCount++;

		if (frameCount % 10 == 0) {
			var snowflake = new THREE.Mesh(

				new THREE.SphereGeometry(
					radius,
					segments,
					rings),

				snowflakeMaterial);

			snowflake.position.y = MAX_Y;
			snowflake.position.x = Math.random() * (MAX_X - MIN_X) - MAX_X;
			snowflake.position.z = Math.random() * (MAX_Z - MIN_Z) - MAX_Z;

			snowflake.name = 'flake';
			snowflake.userData.modifier = Math.random() * 3 - 1.5;

			scene.add(snowflake);
		}

		// animate the flakes
		scene.children
			.filter(function(flake){ return flake.name == 'flake'; })
			.forEach(function(flake) {
				flake.position.y -= 0.1;
				flake.position.x += Math.sin((frameCount)/ 10 + flake.userData.modifier) / (8);
				flake.position.z += Math.cos((frameCount)/ 10 + flake.userData.modifier) / (8);

				if (flake.position.y < MIN_Y) {
					scene.remove(flake);
					// console.log('flake removed. count:', scene.children.length);
				}
		});

		// rotate that camera.
		camera.position.x = Math.cos(frameCount / 800) * 100;
		camera.position.z = Math.sin(frameCount / 800) * 100;
		camera.position.y = Math.sin(frameCount / 1000) * 20;
		camera.lookAt(center);

		movingLight.position.x = Math.sin(frameCount / 300) * 100;
		movingLight.position.y = Math.cos(frameCount / 300) * 100;

    // pointLight.position.x = Math.sin(frameCount / 20) * 20;
    // pointlight.position.z = math.cos(framecount / 20) * 20;
    // pointLight.position.y = Math.sin(frameCount / 40) * 10;

    // if ( snowflake.position.x > 30 || snowflake.position.x < -30 ) {
      // dx = -dx;
    // }

    // if ( snowflake.position.y > 25 || snowflake.position.y < -25 ) {
      // dy = -dy;
    // }

    // // snowflake.position.x += dx;
    // snowflake.position.y += dy;
		// snowflake.position.x += Math.sin(frameCount / 10) / 10;

    // if ( frameCount % 10 == 0 ) {
      // var point = new THREE.Mesh(
        // new THREE.SphereGeometry( 3, 10, 10 ),
      // pointMaterial);

      // point.position.x = snowflake.position.x;
      // point.position.y = snowflake.position.y;
      // point.position.z = -20;

      // scene.add(point);
      // points.push(point);
      // point.position.dy = 0.5;

      // if ( points.length > 10 ) {
        // scene.remove(points.shift());
      // }

    // }

    // var p;
    // for( p in points ) {
      // p = points[p];
      // p.position.dy *= 1.05;
      // p.position.y -= p.position.dy;
    // }

    renderer.render(scene, camera);
  })();

})(window, document, THREE);
