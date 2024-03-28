import { useContext } from 'react';
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

interface AuthContextType {
    loginUser: () => void;
    loginError: { error: boolean, message: string } | null;
    loginInfo: object;
    updateLoginInfo: (info: object) => void;
    isLoginLoading: boolean;
}
const Login = () => {
    const {
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading
    }  = useContext(AuthContext) as AuthContextType;
    return (<>
        <Form onSubmit={loginUser}>
            <Row style={{
                height: '100vh',
                justifyContent: 'center',
                paddingTop: '7%'
            }}>
                <Col xs={6}>
                    <Stack gap={3}>
                        <h2>Login</h2>

                        <Form.Control type='email' placeholder='Email' onChange={(e) =>
                            updateLoginInfo({ ...loginInfo, email: e.target.value })}>
                        </Form.Control>
                        <Form.Control type='password' placeholder='Password' onChange={(e) =>
                            updateLoginInfo({ ...loginInfo, password: e.target.value })}>
                        </Form.Control>
                        <Button variant='primary' type='submit'>
                            {isLoginLoading ? "Getting you in..." : "Login"}
                        </Button>

                        {
                            loginError?.error && (
                                <Alert variant='danger'>
                                    <p>{loginError?.message}</p>
                                </Alert>)
                        }

                    </Stack>
                </Col>
            </Row>
        </Form>
    </>);
}

export default Login;