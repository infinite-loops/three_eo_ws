import {Face3, Geometry, Matrix4, Vector3} from "three";

export class PortalsGeometry extends Geometry {
    
    constructor(width, height ) {

        super();

        this.width = width;
        this.halfWidth = width * 0.5;
        this.height = height;
        this.halfHeight = height * 0.5;
        this.sizeMatrix = new Matrix4();

        for (let i = 0; i < 8; i++) {
            this.vertices.push(new Vector3());
        }

        // front is front facing
        // volume is back facing
        // material index from PortalMaterial
        this.faces.push(
            // front
            new Face3(0, 1, 2),
            new Face3(1, 3, 2),
            // volume
            new Face3(1, 3, 5, null, null, 1),
            new Face3(7, 5, 3, null, null, 1),
            new Face3(3, 6, 7, null, null, 1),
            new Face3(2, 6, 3, null, null, 1),
            new Face3(0, 4, 6, null, null, 1),
            new Face3(0, 6, 2, null, null, 1),
            new Face3(0, 5, 4, null, null, 1),
            new Face3(1, 5, 0, null, null, 1),
            new Face3(4, 5, 6, null, null, 1),
            new Face3(5, 7, 6, null, null, 1)
        );


    }

    setVolume = function(fov, aspect, near) {
        // volumetric portal technique from http://en.wikibooks.org/wiki/OpenGL_Programming/Mini-Portal_Smooth
        const fovX = fov * (Math.PI / 180),
            fovY = fovX / aspect,
            dz = Math.max(near / Math.cos(fovX), near / Math.cos(fovY)),
            dx = Math.tan(fovX) * dz / this.width,
            dy = Math.tan(fovY) * dz / this.height;

        this.vertices[0].set(-1, -1, 0.01);
        this.vertices[1].set( 1, -1, 0.01);
        this.vertices[2].set(-1,  1, 0.01);
        this.vertices[3].set( 1,  1, 0.01);
        this.vertices[4].set(-(1 + dx), -(1 + dy), -dz); //-(1 + dy)
        this.vertices[5].set( (1 + dx), -(1 + dy), -dz); //-(1 + dy)
        this.vertices[6].set(-(1 + dx),  (1 + dy), -dz);
        this.vertices[7].set( (1 + dx),  (1 + dy), -dz);

        this.sizeMatrix.identity();
        this.sizeMatrix.makeScale(this.halfWidth, this.halfHeight, 1);
        this.applyMatrix(this.sizeMatrix);
    };
}


