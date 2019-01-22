({
    // Wraps up any call to a helper function in a Promise. 
    // Make sure that the helper function you use calls resolve and reject in the right places. 
    // Contains Lightning-specific $A.getCallback() to make sure that the callback is run properly within the Lightning framework
    helperFunctionAsPromise : function(component, helperFunction) {
        return new Promise($A.getCallback(function(resolve, reject) {
            helperFunction(component, resolve, reject);
        }));
    },
    // Promise-ready initialization function: can be called normally
    initPurposes: function(component, resolve, reject) {
		console.log("CCL_PRF_PurposeSiteController:initPurposes");
		var action = component.get("c.initPurposes");
    	action.setCallback(this, function(response) {
			var state = response.getState();
			if (state === "SUCCESS") {
                let purposesAndLabels = response.getReturnValue();
                console.log(purposesAndLabels);
				component.set("v.purposesLabels", purposesAndLabels.labels);
                component.set("v.purposes", purposesAndLabels.purposes);
                
                // If only 1 result then pre-select it
				if(purposesAndLabels.purposes.length == 1){
					console.log("auto-selected Purpose: "+purposesAndLabels.purposes[0].Id);
					// Set the selected value
					component.set("v.selectedPurposeId", purposesAndLabels.purposes[0].Id);
                }
                
				// Promise resolved
				if(resolve) {
                    console.log('resolving initPurposes');
                    resolve('initPurposes succeeded');
                }
			} 
			else if (state === "ERROR") {
                console.error(response.getError()[0].message);
				// Promise rejected
				if(reject) {
                    console.log('rejecting initPurposes');
                    reject(Error(response.getError()[0].message));
                }
			}
		});
		$A.enqueueAction(action);
	},
	filterWizards : function(component, resolve, reject) {
		var action = component.get("c.filterWizardsByPurpose");
    	action.setParams({purposeId: component.get("v.selectedPurposeId")});
    	action.setCallback(this, function(response) {
			var state = response.getState();
			if (state === "SUCCESS") {
				// Populate the list of available wizards filtered by Purpose__c
				component.set("v.wizards", response.getReturnValue());
				
                // Enable the picklist
                if(component.get("v.reviewMode") == false){
                    component.find("selectWizard").set("v.disabled", false); 
                }
                
                // Promise resolved
				if(resolve) {
                    console.log('resolving filterWizards');
                    resolve('filterSites succeeded');
                }
			} else if (state === "ERROR") {
                console.error(response.getError()[0].message);
                // Promise rejected
				if(reject) {
                    console.log('rejecting filterWizards');
                    reject(Error(response.getError()[0].message));
                }
			}
		});
		$A.enqueueAction(action);
	}
})
