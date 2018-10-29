import React from 'react';
//import './App.css';
import { Glyphicon, Modal, Grid, Row, Col, Button } from 'react-bootstrap';

import RequestHandler from './shared/RequestHandler.jsx';

class DesistRequestApp extends React.Component {
	componentWillMount() {
		this.request = new RequestHandler();
		let pathnameRequestURI = window.location.pathname;
		let reqIndex = pathnameRequestURI.lastIndexOf('/desist/', pathnameRequestURI.length - 1);
		
		this.setState({
			publicPayload: null,
			partialRequestURI: pathnameRequestURI.substr(0,reqIndex + 1),
			confirmEmail: false,
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
					publicPayload: payload
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
	
	desistDesist() {
		this.setState({
			showModal: true,
			modalTitle: 'Request ' + this.state.partialRequestURI + ' is NOT dismissed',
			error: 'Dismissal of request ' + this.state.partialRequestURI + ' has NOT been done'
		});
	}
	
	desistRequest() {
		let errHandler = (err) => {
			this.setState({
					...err,
					loadingError: true,
					showModal: true
			});
		};
		
		this.request.submitResponse({desistCode: this.state.publicPayload.desistCode},'desist request')
			.then(() => {
				this.setState({
					showModal: true,
					modalTitle: 'Desist code submitted',
					error: 'Desist code ' + this.state.publicPayload.desistCode + ' has been submitted for request ' + this.state.partialRequestURI + '. It should just be removed'
				});
			},errHandler);
	}
	
	render() {
		if(this.state.loadingError) {
			return (
				<div>
					<h3>Sorry, there was an error transferring the desisting request data. You can now close this window</h3>
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
					<h3>The request {this.state.partialRequestURI} with desist code {this.state.publicPayload.desistCode} has been desisted. You can now close this window</h3>
				</div>
			);
		}
		
		if(this.state.user === null) {
			return (
				<div>
					<h3>Fetching request {this.state.partialRequestURI} to be desisted and its data...</h3>
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
				<h3>Desisting request {this.state.partialRequestURI}</h3>
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
						<p>Are you sure you want to desist request {this.state.partialRequestURI}?</p>
					</Row>
					<Row>
						<Col sm={12} md={6}>
							<Button bsStyle="info" onClick={()=>this.desistDesist()} className="submitCancelButtons" ><Glyphicon glyph="trash" />&nbsp;Cancel desist request</Button>
						</Col>
						<Col sm={12} md={6} style={{textAlign: 'right'}}>
							<Button bsStyle="danger" onClick={() => this.desistRequest()} className="submitCancelButtons" >Confirm desist&nbsp;<Glyphicon glyph="pencil" /></Button>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}

export default DesistRequestApp;
