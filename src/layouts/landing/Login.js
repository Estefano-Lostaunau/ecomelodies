import React from 'react'
import { Link } from 'react-router-dom'
import { filterInput } from 'utils/helpers'
// import { AuthContext } from 'utils/context/auth'
import { connect } from 'react-redux'
import { login } from 'store/authSlice'
import { Form, Col } from 'react-bootstrap'

class Login extends React.Component {
    // static contextType = AuthContext;
    state = {
        disabled: false,
        error: null,
        password: '',
        username: ''
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = async (e) => {
        e.preventDefault()
        if (this.state.disabled)
            return
        this.setState({ error: null, disabled: true })
        try {
            let form = e.target
            let username = filterInput(form.username.value, 'username', { min_length: 4 })
            let password = filterInput(form.password.value, 'password')
            let responce = await fetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // console.log(responce);
            if (responce.status >= 500) {
                throw Error('Something went wrong.')
            }
            else if (responce.status >= 400) {
                throw Error('Incorrect credentials')
            }
            else if (responce.ok) {
                let data = await responce.json()
                console.log(data.message)
                this.setState({ disabled: false })
                this.props.login(data.user)
            }
        } catch (error) {
            console.log(error.message)
            this.setState({ error: error.message, disabled: false })
        }
    }
    render() {
        let disabled = this.state.disabled
        return (
            <Col style={{ marginTop:"150px", maxWidth: "400px" }} className="mx-auto border px-3 pb-3">


                <fieldset disabled={disabled}>
                    <Form onSubmit={this.handleSubmit} >
                        <Form.Group controlId="username">
                            <Form.Label>Nombre de Usuario</Form.Label>
                            <Form.Control
                                onChange={this.handleChange}
                                value={this.state.username}
                                type="text"
                                name="username"
                                autoCapitalize="off"
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-0" controlId="password">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                onChange={this.handleChange}
                                value={this.state.password}
                                autoCorrect="off"
                                type="password"
                                name="password"
                            ></Form.Control>
                        </Form.Group>
                        <p>
                            {/* <small ><Link disabled to="/help">Forgot password?</Link></small>
                            <br /> */}
                            <small className="text-danger">{this.state.error}</small>
                        </p>
                        <div className="d-flex flex-column align-items-center">
                            <button type="submit" className="btn btn-outline-primary btn-block rounded-pill font-weight-bold">
                                Iniciar Sesión
                            </button>
                            <small className="text-muted m-2">or</small>
                            <Link
                                to="/signup"
                                className="btn btn-primary btn-block rounded-pill font-weight-bold"
                            >
                                Regístrate
                            </Link>
                        </div>
                    </Form>
                </fieldset>
            </Col>
        )
    }
}
export default connect(null, { login })(Login)
