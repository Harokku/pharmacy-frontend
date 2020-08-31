import React from 'react';
import './App.css';
import {defaultTheme} from "@adobe/react-spectrum";
import {Provider} from "@react-spectrum/provider";
import Login from "./login/Login";

function App() {
    return (
        <Provider theme={defaultTheme} colorScheme={"light"}>
            <Login>
            </Login>
        </Provider>
    );
}

export default App;
