import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler';
import vertex from './shader/vertexShader.glsl'; 
import fragment from './shader/fragmentShader.glsl';


class Model {
    constructor(obj){
         console.log(obj);
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.placeOnLoad = obj.placeOnLoad
        this.color1 = obj.color1
        this.color2 = obj.color2

        this.isActive = false;

        this.loader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/')
        this.loader.setDRACOLoader(this.dracoLoader)

        this.init()
    }

    init(){
        this.loader.load(this.file, (response) => {
            // console.log(response)

            /**
             * Original mesh
             */
            this.mesh = response.scene.children[0]

            /**
             * Material
             */

            // this.material = new THREE.MeshBasicMaterial({
            //     color: 'green',
            //     wireframe: true
            // })
            // this.mesh.material = this.material
            
            /**
             * Geometry
             */

            this.geometry = this.mesh.geometry

            /**
             * Particle material
             */

            // this.particlesMaterial = new THREE.PointsMaterial({
            //     color: 'green',
            //     size: 0.02
            // })
            
            this.particlesMaterial = new THREE.ShaderMaterial({
                uniforms:{
                    uColor1: {value: new THREE.Color(this.color1)},
                    uColor2: {value: new THREE.Color(this.color2)},
                    uTime: {value: 0}
                },
                vertexShader: vertex,
                fragmentShader: fragment,
                transparent: true,
                depthTest: false,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })

            /**
             * Particles geometry -- Basically, we create particles along the vertices
             */

            const sampler = new MeshSurfaceSampler(this.mesh).build()
            const numParticles = 20000
            this.particlesGeometry = new THREE.BufferGeometry()
            const particlesPosition = new Float32Array(numParticles * 3)

            // We had particle randomness to be able to move them each one by one in a direction with uTime
            const particlesRandomness = new Float32Array(numParticles * 3)

            for (let i = 0; i<numParticles; i++){
                const newPosition = new THREE.Vector3()
                sampler.sample(newPosition)
                particlesPosition.set([
                    newPosition.x,
                    newPosition.y,
                    newPosition.z,
                ], i * 3 )


                particlesRandomness.set([
                    // Number from -1 to 1
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                ], i * 3)
            }

            this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))
            
            this.particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(particlesRandomness, 3))
            console.log(this.particlesGeometry)
            /**
             * Particles
             */

            this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)

            /**
             * Place on load
             */

            if(this.placeOnLoad){
                this.add()
            }
        })
    }

    add(){
        this.scene.add(this.particles)
        this.isActive = true
    }

    remove(){
        this.scene.remove(this.particles)
        this.isActive = false
    }
}

export default Model; 