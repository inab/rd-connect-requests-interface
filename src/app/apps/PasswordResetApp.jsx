import React from 'react';
//import './App.css';
import { Glyphicon, Modal, Grid, Row, Col, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import zxcvbn from 'zxcvbn';
import ReactMustache from 'react-mustache';

import RequestHandler from './shared/RequestHandler.jsx';

class PasswordResetApp extends React.Component {
	componentWillMount() {
		let template = '<table class=""> \
        <tr>\
            <td colspan="3">guess times:</td>\
        </tr>\
        <tr>\
            <td>100 / hour:</td>\
            <td>{{crack_times_display.online_throttling_100_per_hour}} ({{crack_times_seconds.online_throttling_100_per_hour}} secs.)</td>\
            <td> (throttled online attack)</td>\
        </tr>\
        <tr>\
            <td>10&nbsp; / second:</td>\
            <td>{{crack_times_display.online_no_throttling_10_per_second}} ({{crack_times_seconds.offline_slow_hashing_1e4_per_second}} secs.)</td>\
            <td> (unthrottled online attack)</td>\
        </tr>\
        <tr>\
            <td>10k / second:</td>\
            <td>{{crack_times_display.offline_slow_hashing_1e4_per_second}} ({{crack_times_seconds.offline_slow_hashing_1e4_per_second}})</td>\
            <td> (offline attack, slow hash, many cores)</td>\
        </tr>\
        <tr>\
            <td>10B / second:</td>\
            <td>{{crack_times_display.offline_fast_hashing_1e10_per_second}} ({{crack_times_seconds.offline_fast_hashing_1e10_per_second}})</td>\
            <td> (offline attack, fast hash, many cores)</td>\
        </tr>\
    </tbody>\
</table>';
		
		this.request = new RequestHandler();
		
		this.setState({
			user: null,
			modalTitle: null,
			error: null,
			showModal: false,
			valuePassword1: '',
			valuePassword2: '',
			mustachePassword1:'',
			mustachePassword2:'',
			template: template,
			suggestionsMessage: 'Password strength estimator based on zxcvbn',
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
		if(this.state.modalTitle === 'Error' || this.state.loadingError){
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false,finished: true});
		}
	}
	
	open() {
		this.setState({showModal: true, modalTitle: this.state.modalTitle});
	}
	
	getValidationPassword1() {
		let zxcv = zxcvbn(this.state.valuePassword1);
		//console.log(zxcv);
		//console.log(zxcv.sequence);
		//var mustachePassword1 = Mustache.render(template, zxcv);
		//this.state.mustachePassword1 = mustachePassword1;
		//console.log(mustachePassword1);
		const score = zxcv.score;
		if(score > 3) {
			return 'success';
		} else if(score > 2) {
			return 'warning';
		} else if(score > 1) {
			return 'warning';
		} else if(score > 0) {
			return 'error';
		} else if(score === 0) {
			return 'error';
		}

	}
	
	getValidationPassword2() {
		if(this.state.valuePassword1 === this.state.valuePassword2) {
			return this.getValidationPassword1();
		} else {
			return 'error';
		}
	}
	
	handleChange1(e) {
		this.setState({ valuePassword1: e.target.value });
	}
	
	handleChange2(e) {
		this.setState({ valuePassword2: e.target.value });
	}
	
	changePassword(){
		let errHandler = (err) => {
			this.setState({
					...err,
					loadingError: true,
					showModal: true
			});
		};
		
		this.request.submitResponse({password: this.state.valuePassword1})
			.then(() => {
				this.setState({
					showModal: true,
					modalTitle: 'Request submitted',
					error: 'Password reset request for RD-Connect user ' + this.state.user.username + ' has been submitted'
				});
			},errHandler);
	}
	
	desistRequest() {
		this.request.desist()
			.then(() => {
				this.setState({
					showModal: true,
					modalTitle: 'Request is dismissed',
					error: 'Requested RD-Connect password reset for user ' + this.state.user.username + ' has been dismissed'
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
					<h3>Fetching password reset data...</h3>
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
		
		var suggestions = this.state.suggestionsMessage;
		const onSubmit = () => this.changePassword();
		return (
			<div>
				<h3>Password change for user {this.state.user.cn} ({this.state.user.username})</h3>
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
							<Col sm={12} md={6}>
								<FormGroup
								controlId="formBasicText"
								validationState={this.getValidationPassword1()}
								>
								<ControlLabel>Write new password</ControlLabel>
								<FormControl
									type="password"
									value={this.state.valuePassword1}
									placeholder="New password"
									onChange={(e) => this.handleChange1(e)}
								/>
								<FormControl.Feedback />
								<HelpBlock>{suggestions}</HelpBlock>
								</FormGroup>
							</Col>
							<Col sm={12} md={6}>
								<FormGroup
								controlId="formBasicText"
								validationState={this.getValidationPassword2()}
								>
									<ControlLabel>Repeat password</ControlLabel>
									<FormControl
										type="password"
										value={this.state.valuePassword2}
										placeholder="Repeat password"
										onChange={(e) => this.handleChange2(e)}
									/>
									<FormControl.Feedback />
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col xs={12} sm={6}>
								<Button bsStyle="info" onClick={()=>this.desistRequest()} className="submitCancelButtons" ><Glyphicon glyph="trash" />&nbsp;Cancel request</Button>
							</Col>
							<Col xs={12} sm={6} style={{textAlign: 'right'}}>
								<Button bsStyle="danger" onClick={onSubmit} className="submitCancelButtons" disabled={this.getValidationPassword2() !== 'success'}>Change password&nbsp;<Glyphicon glyph="pencil" /></Button>
							</Col>
						</Row>
					</Grid>
				</form>
				<ReactMustache template={this.state.template} data={zxcvbn(this.state.valuePassword1)} />
			</div>
		);
	}
}

export default PasswordResetApp;
