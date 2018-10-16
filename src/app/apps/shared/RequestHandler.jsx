import jQuery from 'jquery';

const CSRF_HEADER = 'X-RDConnect-UserManagement-Request';

class RequestHandler {
	constructor() {
		this.payload = null;
		this.csrfToken = null;
		this.cacheId = null;
	}
	
	getRequestPayload(label = 'payload') {
		return new Promise((resolve,reject) => {
			this.cacheId = (new Date()).getTime();
			let query = {
				url: 'details?_=' + this.cacheId,
				type: 'GET',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				}
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
				url: 'details?_=' + this.cacheId,
				headers: headers,
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(answer),
				xhrFields: {
					withCredentials: true
				}
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to ' + label +  '. ';
				console.log(jqXhr);
				switch(jqXhr.status) {
					case 0:
						responseText += 'Not connect: Verify Network.';
						break;
					case 404:
						responseText += 'Not found [404]';
						break;
					case 409:
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
		return new Promise((resolve,reject) => {
			const cacheId = (new Date()).getTime();
			let errHandler = (jqXhr, textStatus, errorThrown) => {
				//cHnsole.log('Failed to retrieve user Information',jqXhr);
				let responseText = 'Failed to desist ' + label + '. ';
				switch(jqXhr.status) {
					case 0:
						responseText += 'Not connect: Verify Network.';
						break;
					case 404:
						responseText += 'Requested User not found [404]';
						break;
					case 409:
						responseText += 'You should reload the page and try again';
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
			};
			
			let desistURL = 'desist/' + this.payload.desistCode + '/details?_=' + cacheId;
			
			let query = {
				url: desistURL,
				type: 'GET',
				cache: false,
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				}
			};
			
			jQuery.ajax(query)
			.done((data, textStatus, jqXHR) => {
				const headers = {};
				headers[CSRF_HEADER] = jqXHR.getResponseHeader(CSRF_HEADER);
				
				// This is needed in order to get a proper desist header
				jQuery.ajax({
					type: 'POST',
					url: desistURL,
					headers: headers,
					contentType: 'application/json',
					dataType: 'json',
					data: JSON.stringify([]),
					xhrFields: {
						withCredentials: true
					}
				})
				.done(resolve)
				.fail(errHandler);
			})
			.fail(errHandler);
		});
	}
}

export default RequestHandler;
