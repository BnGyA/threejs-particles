// THREEJS automagically import position for us
// attribute vec3 position

// Import random value for each point
attribute vec3 aRandom;

// PASS TO FRAGMENT
varying vec3 vPosition;

// Pass time
uniform float uTime;
void main() {
    vPosition = position;

    vec3 pos = position;
    // time variable to be able to modify it
    float time = uTime * 4.;

    // Move left the whole object
    //pos.x -= 1.0;
    // Scale down the whole object
    //pos *= 0.5;
    // move with time
    // pos.x +=sin(uTime);
    // pos.y +=cos(uTime);

    // move random for each point
    pos.x += sin(time * aRandom.x) * 0.01;
    pos.y += cos(time * aRandom.y) * 0.01;
    pos.z += cos(time * aRandom.z) * 0.01;

    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 8.0 / -mvPosition.z;    
}