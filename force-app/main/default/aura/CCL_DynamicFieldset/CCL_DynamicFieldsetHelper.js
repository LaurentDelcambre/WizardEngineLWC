({
  logErrors: function(response){
		let errors = response.getError();
		let message = "Unknown error: ";
		if (errors && Array.isArray(errors) && errors.length > 0) {
			errors.forEach(function(error){
				console.log(error);
				if(error.message){
					message = error.message;
				}
				else if(error.fieldErrors && Array.isArray(error.fieldErrors) && error.fieldErrors.length > 0){
					error.fieldErrors.forEach(function(fieldError){
						message = fieldError.message;
					});
				} 
				else if(error.pageErrors && Array.isArray(error.pageErrors) && error.pageErrors.length > 0){
					console.log("inside page error");
					error.pageErrors.forEach(function(pageError){
						message = pageError.message;
					});
				}
				else{
					console.error("error not recognized");
				}
			});
		}
		console.error(message);
	}
})
