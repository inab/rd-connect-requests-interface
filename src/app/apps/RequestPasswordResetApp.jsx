import React from 'react';
//import './App.css';
import { Glyphicon, Modal, Grid, Row, Col, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

import RequestHandler from './shared/RequestHandler.jsx';

class RequestPasswordResetApp extends React.Component {
	componentWillMount() {
		this.request = new RequestHandler();
		
		this.setState({
			usernameOrEmail: '',
			requestInitialized: false,
			modalTitle: null,
			error: null,
			showModal: false,
			loadingError: false,
			finished: false
		});
	}
	
	// We fetch the request data, which should be the user fullname and username
	componentDidMount() {
		let errHandler = (err) => {
			this.setState({
				...err,
				loadingError: true,
				showModal: true
			});
		};
		
		this.request.getRequestPayload()
			.then(() => {
				this.setState({
					requestInitialized: true
				});
			},errHandler);
	}
	
	close() {
		if(this.state.modalTitle === 'Error' || this.state.loadingError){
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false,finished: true});
		}
	}
	
	open() {
		this.setState({showModal: true, modalTitle: this.state.modalTitle});
	}
	
	handleChange(e) {
		this.setState({ usernameOrEmail: e.target.value });
	}
		
	requestChangePassword() {
		let errHandler = (err) => {
			this.setState({
					...err,
					//loadingError: true,
					showModal: true
			});
		};
		
		this.request.submitResponse({usernameOrEmail: this.state.usernameOrEmail})
			.then(() => {
				this.setState({
					showModal: true,
					modalTitle: 'Request submitted',
					error: 'Password reset request for RD-Connect user ' + this.state.usernameOrEmail + ' has been submitted'
				});
			},errHandler);
	}
	
	desistRequest() {
		this.request.desist()
			.then(() => {
				this.setState({
					showModal: true,
					modalTitle: 'Request is dismissed',
					error: 'No password reset request has been sent to RD-Connect'
				});
			});
	}
	
	render() {
		if(this.state.loadingError) {
			return (
				<div>
					<h3>Sorry, there was an error managing the request data. You can now close this window</h3>
					<Modal show={this.state.showModal} onHide={() => this.close()} error={this.state.error}>
						<Modal.Header closeButton>
							<Modal.Title>{this.state.modalTitle}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<h4>{this.state.error}</h4>
						</Modal.Body>
						<Modal.Footer>
							<Button bsStyle="info" onClick={() => this.close()}><Glyphicon glyph="step-backward" />&nbsp;Close</Button>
						</Modal.Footer>
					</Modal>
				</div>
			);
		}
		
		if(this.state.finished) {
			return (
				<div>
					<h3>You can now close this window</h3>
				</div>
			);
		}
		
		if(!this.state.requestInitialized) {
			return (
				<div>
					<h3>Intializing, please wait ...</h3>
					<Modal show={this.state.showModal} onHide={() => this.close()} error={this.state.error}>
						<Modal.Header closeButton>
							<Modal.Title>{this.state.modalTitle}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<h4>{this.state.error}</h4>
						</Modal.Body>
						<Modal.Footer>
							<Button bsStyle="info" onClick={() => this.close()}><Glyphicon glyph="step-backward" />&nbsp;Close</Button>
						</Modal.Footer>
					</Modal>
				</div>
			);
		}
		
		const onSubmit = () => {
			this.requestChangePassword();
			return false;
		};
		return (
			<div>
				<h3>Request password reset for RD-Connect user</h3>
				<Modal show={this.state.showModal} onHide={() => this.close()} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="info" onClick={() => this.close()}><Glyphicon glyph="step-backward" />&nbsp;Close</Button>
					</Modal.Footer>
				</Modal>
				<form onSubmit={onSubmit}>
					<Grid>
						<Row>
							<Col sm={12}>
								<FormGroup
								controlId="formBasicText"
								>
								<ControlLabel>Write your RD-Connect username or the e-mail address associated</ControlLabel>
								<FormControl
									type="text"
									value={this.state.usernameOrEmail}
									placeholder="Username or e-mail"
									onChange={(e) => this.handleChange(e)}
								/>
								<FormControl.Feedback />
								<HelpBlock>You will receive an e-mail with the instructions to change your password once the username is validated</HelpBlock>
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs={12} sm={6}>
								<Button bsStyle="info" onClick={()=>this.desistRequest()} className="submitCancelButtons" ><Glyphicon glyph="trash" />&nbsp;Cancel request</Button>
							</Col>
							<Col xs={12} sm={6} style={{textAlign: 'right'}}>
								<Button bsStyle="danger" onClick={onSubmit}  className="submitCancelButtons" disabled={this.state.usernameOrEmail.length === 0}>Request password change&nbsp;<Glyphicon glyph="pencil" /></Button>
							</Col>
						</Row>
					</Grid>
				</form>
			</div>
		);
	}
}

export default RequestPasswordResetApp;
