import React, { Component } from 'react';
import GLStage from './Main';
import { WEBGL } from 'three/examples/jsm/WebGL.js';

class App extends Component {

    componentDidMount() {
    }

    render() {

        if (WEBGL.isWebGL2Available() === false) {
            const err = WEBGL.getWebGL2ErrorMessage();
            console.log(err)
            return <div>
                <h1>no webgl2 :(</h1>
                <pre>{JSON.stringify(err)}</pre>
            </div>
        }

        return (
            <div>
                <GLStage/>
            </div>
        );
    }
}

export default App;