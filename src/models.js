import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler';
 
class Model {
    constructor(obj){
         console.log(obj);
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.placeOnLoad = obj.placeOnLoad

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

            this.material = new THREE.MeshBasicMaterial({
                color: 'red',
                wireframe: true
            })
            this.mesh.material = this.material
            
            /**
             * Geometry
             */

            this.geometry = this.mesh.geometry

            /**
             * Particle material
             */

            this.particlesMaterial = new THREE.PointsMaterial({
                color: 'red',
                size: 0.02
            })

            /**
             * Particles geometry
             */

            const sampler = new MeshSurfaceSampler(this.mesh).build()
            const numParticles = 20000
            this.particlesGeometry = new THREE.BufferGeometry()
            const particlesPosition = new Float32Array(numParticles * 3)

            for (let i = 0; i<numParticles; i++){
                const newPosition = new THREE.Vector3()
                sampler.sample(newPosition)
                particlesPosition.set([
                    newPosition.x,
                    newPosition.y,
                    newPosition.z,
                ], i * 3 )
            }

            this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))
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
    }

    remove(){
        this.scene.remove(this.particles)
    }
}

export default Model; 