import React, {useEffect, useMemo, useState} from 'react';
import {ActionButton, Flex, Form, Heading, Text, TextField, View} from '@adobe/react-spectrum'
import LoginIco from '@spectrum-icons/workflow/Login'
import axios from "axios";
import {StatusLight, Footer} from '@adobe/react-spectrum'


const Login = () => {
    const [serverStatus, setserverStatus] = useState(null);
    const [loginStatus, setLoginStatus] = useState({result: null, error: null, inFlight: false});
    const [formData, setformData] = useState({user: "", pass: ""});
    const validationState = useMemo(
        () => formData.user !== "" && formData.pass !== "",
        [formData.user, formData.pass]
    )

    useEffect(() => {
        axios.get(
            `${process.env.REACT_APP_BACKEND}/ping`
        ).then(
            () => {
                setserverStatus({
                    online: true
                })
            },
            () => {
                setserverStatus({
                    online: false
                })
            }
        )
    }, [loginStatus])

    const postLogin = async (username, password) => {
        setLoginStatus({...loginStatus, inFlight: true})
        await axios.post(
            `${process.env.REACT_APP_BACKEND}/login`,
            {
                user_name: username,
                password: password
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            res => {
                setLoginStatus({
                    result: res.data,
                    error: null,
                    inFlight: true
                })
            },
            err => {
                setLoginStatus({
                    result: null,
                    error: err,
                    inFlight: false
                })
                setserverStatus(null)
                setformData({
                    ...formData,
                    pass: ""
                })
            }
        )
    };

    return (
        <>
            <Flex direction="column" gap="size-100" alignItems="center">
                <View marginBottom={"size-500"} borderWidth={"thin"} borderRadius={"medium"} padding={"size-250"}
                      backgroundColor={"gray-75"}>
                    <Heading level={1}>Login</Heading>
                    <Form maxWidth="size-3600" isDisabled={loginStatus.inFlight}>
                        <TextField label="Username" placeholder="n.cognome" value={formData.user}
                                   isRequired validationState={formData.user !== "" ? "valid" : "invalid"}
                                   onChange={(value => setformData({...formData, user: value}))}/>
                        <TextField label="Password" placeholder="1234" type={"password"} value={formData.pass}
                                   isRequired validationState={formData.pass !== "" ? "valid" : "invalid"}
                                   onChange={value => setformData({...formData, pass: value})}/>
                        <Text isHidden={loginStatus.error === null}>Username o password errate</Text>
                        <ActionButton isDisabled={!validationState || loginStatus.result || loginStatus.inFlight}
                                      onPress={() => postLogin(formData.user, formData.pass)}>
                            <LoginIco/>
                            <Text>Login</Text>
                        </ActionButton>
                    </Form>
                </View>

                <View borderRadius={"medium"} width={"90%"} backgroundColor={"gray-100"} position={"fixed"}
                      bottom={"size-0"}>
                    <Footer>
                        <StatusLight
                            variant={serverStatus === null ? "notice" : serverStatus.online ? "positive" : "negative"}>
                            Server status:
                            {serverStatus === null ? "Pending" : serverStatus.online ? "Online" : "Offline"}
                        </StatusLight>
                    </Footer>
                </View>
            </Flex>
        </>
    );
};

export default Login;