({
  doInit : function(component, event, helper) {
		if(!component.get("v.selectedPurposeId") || (component.get("v.reviewMode") == true)){
			helper.initPurposes(component);
		}
		else{
			console.log("before Promise init");
			helper.helperFunctionAsPromise(component, helper.initPurposes)
				.then($A.getCallback(function(){
					return helper.helperFunctionAsPromise(component, helper.filterWizards)
				}))
				.catch($A.getCallback(function(err) {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Error',
                        type: 'error',
                        message: err.message
                    });
                    toastEvent.fire();
                }));
		}
	},
	filterWizards: function(component, event, helper){
		// Call the non-Promise version
		helper.filterWizards(component);
    },
  clickNext : function(component, event, helper) {
		console.log("CCL_PRF_PurposeSiteController:clickNext");
		console.log("CCL_PRF_PurposeSiteController:selectedWizardName: "+component.get("v.selectedWizardName"));
		
		// Validation
		let selectedPurposeId = component.get("v.selectedPurposeId");
		let selectedWizardName = component.get("v.selectedWizardName");

		let cmpPurpose = component.find("selectPurpose");
		if(!cmpPurpose.get('v.validity').valid){
			cmpPurpose.showHelpMessageIfInvalid();
			return;
		}
		let cmpWizard = component.find("selectWizard");
		if(!cmpWizard.get('v.validity').valid){
			cmpWizard.showHelpMessageIfInvalid();
			return;
		}

		// Create records
		var action = component.get("c.getStepsFromMetadata");
		action.setParams({	selectedWizardName: selectedWizardName});

		console.log("before set callback");
		action.setCallback(this, function(response) {
			var state = response.getState();
			console.log("state: "+state);
			if (state === "SUCCESS") {
				console.log('getStepsFromMetadata:callback SUCCESS');

				// Returned Ids
				let listWizardSteps = response.getReturnValue();
				console.log(listWizardSteps);

				// Fire Next event 
				var cmpEvent = component.getEvent("navigationEvent");
				cmpEvent.setParams({
									"navigateOriginComponent" : "Purpose_Selector",
									"navigateAction" : "Next",
									"selectedPurposeId": 	selectedPurposeId,
									"selectedWizardName": 	selectedWizardName,
									"listWizardSteps": 		listWizardSteps
									});
				cmpEvent.fire();
			} else if (state === "ERROR") {
				console.log('getStepsFromMetadata:callback ERROR');
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
			} else{
				console.error("Unknown error: "+state);
			}
		});
		$A.enqueueAction(action);
	}
})
