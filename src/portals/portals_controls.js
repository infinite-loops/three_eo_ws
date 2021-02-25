import {Euler, Object3D, Vector3} from "three";

export default function PortalsControls ( camera ) {

    let scope = this;

    camera.rotation.set( 0, 0, 0 );

    let pitchObject = new Object3D();
    pitchObject.add( camera );

    let yawObject = new Object3D();
    yawObject.position.y = 10;
    yawObject.add( pitchObject );

    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;

    let isOnObject = false;
    let canJump = false;

    let velocity = new Vector3();

    let PI_2 = Math.PI / 2;

    let onMouseMove = function ( event ) {

        if ( scope.enabled === false ) return;
        let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;
        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

    };

    let onKeyDown = function ( event ) {
        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ) velocity.y += 10;
                canJump = false;
                break;

        }

    };

    let onKeyUp = function ( event ) {

        switch( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    this.enabled = true;

    this.getObject = function () {

        return yawObject;

    };

    this.isOnObject = function ( boolean ) {

        isOnObject = boolean;
        canJump = boolean;

    };

    this.getDirection = function() {

        // assumes the camera itself is not rotated

        let direction = new Vector3( 0, 0, -1 );
        let rotation = new Euler( 0, 0, 0, "YXZ" );

        return function( v ) {

            rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

            v.copy( direction ).applyEuler( rotation );

            return v;

        }

    }();

    this.setDirection = function(euler) {
        pitchObject.rotation.x = euler.x;
        yawObject.rotation.y = euler.y;
    };

    this.getVelocity = function(v) {
        return v.copy(velocity);
    };

    this.getPosition = function(v) {
        return v.copy(yawObject.position);
    };

    this.updateVelocity = function ( delta ) {

        if ( scope.enabled === false ) return;

        delta *= 0.1;

        velocity.x += ( - velocity.x ) * 0.08 * delta;
        velocity.z += ( - velocity.z ) * 0.08 * delta;

        velocity.y -= 0.25 * delta;

        if ( moveForward ) velocity.z -= 0.12 * delta;
        if ( moveBackward ) velocity.z += 0.12 * delta;

        if ( moveLeft ) velocity.x -= 0.12 * delta;
        if ( moveRight ) velocity.x += 0.12 * delta;

        if ( isOnObject === true ) {

            velocity.y = Math.max( 0, velocity.y );

        }
    };

    this.updatePosition = function() {
        yawObject.translateX( velocity.x );
        yawObject.translateY( velocity.y );
        yawObject.translateZ( velocity.z );

        if ( yawObject.position.y < 10 ) {

            velocity.y = 0;
            yawObject.position.y = 10;

            canJump = true;

        }
    }
};