import jQuery from 'jquery';

const CSRF_HEADER = 'X-RDConnect-UserManagement-Request';

class RequestHandler {
	constructor() {
		this.payload = null;
		this.csrfToken = null;
	}
	
	getRequestPayload(label = 'payload') {
		return new Promise((resolve,reject) => {
			let query = {
				url: 'details',
				type: 'GET',
				cache: false,
				dataType: 'json',
			};
			
			jQuery.ajax(query)
			.done((data, textStatus, jqXHR) => {
				this.csrfToken = jqXHR.getResponseHeader(CSRF_HEADER);
				this.payload = data;
				
				resolve(data);
			})
			.fail((jqXhr, textStatus, errorThrown) => {
				//console.log('Failed to retrieve user Information',jqXhr);
				let responseText = 'Failed to retrieve ' + label + ' Information. ';
				switch(jqXhr.status) {
					case 0:
						responseText += 'Not connect: Verify Network.';
						break;
					case 404:
						responseText += 'Requested User not found [404]';
						break;
					case 500:
						responseText += 'Internal Server Error [500].';
						break;
					case 'parsererror':
						responseText += 'Requested JSON parse failed.';
						break;
					case 'timeout':
						responseText += 'Time out error.';
						break;
					case 'abort':
						responseText += 'Ajax request aborted.';
						break;
					default:
						responseText += 'Uncaught Error (' + jqXhr.status + '): ' + jqXhr.responseText;
						break;
				}
				console.error('ERROR',errorThrown,responseText);
				
				this.csrfToken = null;
				this.payload = null;
				
				reject({label: label, modalTitle: 'Error', error: responseText, status: jqXhr.status});
			});
		});
	}
	
	submitResponse(answer,label = 'resolve request') {
		const headers = {};
		headers[CSRF_HEADER] = this.csrfToken;
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: 'resolution',
				headers: headers,
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(answer)
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to ' + label +  '. ';
				switch(jqXhr.status) {
					case 0:
						responseText += 'Not connect: Verify Network.';
						break;
					case 404:
						responseText += 'Not found [404]';
						break;
					case 408:
						responseText += 'You should reload the page and try again';
						break;
					case 500:
						responseText += 'Internal Server Error [500].';
						break;
					case 'parsererror':
						responseText += 'Sent JSON parse failed.';
						break;
					case 'timeout':
						responseText += 'Time out error.';
						break;
					case 'abort':
						responseText = 'Ajax request aborted.';
						break;
					default:
						responseText = 'Uncaught Error: ' + jqXhr.responseText;
						break;
				}
				
				reject({ modalTitle: 'Error', error: responseText, status: jqXhr.status});
			});
		});
	}
	
	desist(label = 'request') {
		const headers = {};
		headers[CSRF_HEADER] = this.csrfToken;
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: 'desist/' + this.payload.desistCode + '/resolution',
				headers: headers,
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify([])
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to desist ' + label +  '. ';
				switch(jqXhr.status) {
					case 0:
						responseText += 'Not connect: Verify Network.';
						break;
					case 404:
						responseText += 'Not found [404]';
						break;
					case 408:
						responseText += 'You should reload the page and try again';
						break;
					case 500:
						responseText += 'Internal Server Error [500].';
						break;
					case 'parsererror':
						responseText += 'Sent JSON parse failed.';
						break;
					case 'timeout':
						responseText += 'Time out error.';
						break;
					case 'abort':
						responseText = 'Ajax request aborted.';
						break;
					default:
						responseText = 'Uncaught Error: ' + jqXhr.responseText;
						break;
				}
				
				reject({ modalTitle: 'Error', error: responseText, status: jqXhr.status});
			});
		});
	}
}

export default RequestHandler;
