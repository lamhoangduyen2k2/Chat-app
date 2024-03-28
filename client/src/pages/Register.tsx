import { useContext } from 'react';
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

interface AuthContextType {
    registerInfo: object;
    updateRegisterInfo: (info: object) => void;
    registerUser: () => void;
    registerError: { error: boolean, message: string } | null;
    isRegisterLoading: boolean;
}
const Register = () => {
    const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext) as AuthContextType;
    return (<>
        <Form onSubmit={registerUser}>
            <Row style={{
                height: '100vh',
                justifyContent: 'center',
                paddingTop: '7%'
            }}>
                <Col xs={6}>
                    <Stack gap={3}>
                        <h2>Register</h2>

                        <Form.Control type='text' placeholder='Name' onChange={
                            (e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })}>
                        </Form.Control>
                        <Form.Control type='email' placeholder='Email' onChange={
                            (e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })}>
                        </Form.Control>
                        <Form.Control type='password' placeholder='Password' onChange={
                            (e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })}>
                        </Form.Control>
                        <Button variant='primary' type='submit'>
                            {isRegisterLoading ? 'Creating your account' : 'Register'}
                        </Button>
                        {
                            registerError?.error && (
                                <Alert variant='danger'>
                                    <p>{registerError?.message}</p>
                                </Alert>)
                        }

                    </Stack>
                </Col>
            </Row>
        </Form>
    </>);
}

export default Register;