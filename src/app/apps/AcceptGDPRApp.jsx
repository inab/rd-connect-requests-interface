import React from 'react';
//import './App.css';
import { Glyphicon, Modal, Grid, Row, Col, Button } from 'react-bootstrap';

import RequestHandler from './shared/RequestHandler.jsx';

class AcceptGDPRApp extends React.Component {
	componentWillMount() {
		this.request = new RequestHandler();
		
		this.setState({
			user: null,
			modalTitle: null,
			error: null,
			showModal: false,
			loadingError: false,
			finished: false
		});
	}
	
	componentDidMount() {
		let errHandler = (err) => {
			this.setState({
				...err,
				loadingError: true,
				showModal: true
			});
		};
		
		this.request.getRequestPayload()
			.then((payload) => {
				this.setState({
					user: payload
				});
			},errHandler);
	}
	
	close() {
		if(this.state.modalTitle === 'Error' || this.state.loadingError) {
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false,finished: true});
		}
	}
	
	open() {
		this.setState({showModal: true, modalTitle: this.state.modalTitle});
	}
	
	requestAcceptGDPR() {
		let errHandler = (err) => {
			this.setState({
					...err,
					loadingError: true,
					showModal: true
			});
		};
		
		this.request.submitResponse({GDPRtoken: this.state.user.GDPRtoken})
			.then(() => {
				this.setState({
					showModal: true,
					modalTitle: 'Request submitted',
					error: 'RD-Connect user ' + this.state.user.username + ' has confirmed her/his acceptance of GDPR terms'
				});
			},errHandler);
	}
	
	desistRequest() {
		this.request.desist()
			.then(() => {
				this.setState({
					showModal: true,
					modalTitle: 'Request is dismissed',
					error: 'RD-Connect user ' + this.state.user.username + ' has NOT accepted GDPR terms'
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
		
		if(this.state.user === null) {
			return (
				<div>
					<h3>Fetching GDPR acceptance data...</h3>
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
		
		return (
			<div>
				<h3>GDPR terms acceptance for user {this.state.user.username}</h3>
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
				<Grid>
					<Row>
						<div dangerouslySetInnerHTML={{__html: this.state.user.GDPRtext}} />
						<hr />
						<h4>Do you, {this.state.user.cn}, RD-Connect user {this.state.user.username}, accept GDPR terms, as you received in the e-mail from RD-Connect?</h4>
					</Row>
					<Row>
						<Col sm={12} md={6}>
							<Button bsStyle="info" onClick={()=>this.desistRequest()} className="submitCancelButtons" ><Glyphicon glyph="trash" />&nbsp;Cancel request</Button>
						</Col>
						<Col sm={12} md={6} style={{textAlign: 'right'}}>
							<Button bsStyle="danger" onClick={() => this.requestAcceptGDPR()} className="submitCancelButtons" >Accept GDPR&nbsp;<Glyphicon glyph="pencil" /></Button>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}

export default AcceptGDPRApp;
