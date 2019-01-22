({
    // Wraps up any call to a helper function in a Promise. 
    // Make sure that the helper function you use calls resolve and reject in the right places. 
    // Contains Lightning-specific $A.getCallback() to make sure that the callback is run properly within the Lightning framework
    helperFunctionAsPromise : function(component, helperFunction) {
        return new Promise($A.getCallback(function(resolve, reject) {
            helperFunction(component, resolve, reject);
        }));
    },
    logErrors: function(errors) {
        console.log('logError:');
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
    },
    // Get the valid values for both picklist from Apex
    // Because we don't need to chain them we use enqueueAction instead of Promises
    initApheresisAndInfusion: function(component, resolve, reject){
        var action = component.get("c.initApheresisCenters");
        action.setParams({"selectedPurposeId": component.get("v.selectedPurposeId"),
                        "selectedSiteId": component.get("v.selectedSiteId")});
    	action.setCallback(this, function(response) {
		    var state = response.getState();
			if (state === "SUCCESS") {
                console.log('doInit:callback SUCCESS');
                let labelsAndApheresis = response.getReturnValue();
				component.set("v.logisticsLabels", labelsAndApheresis.labels);
                component.set("v.apheresisCenters", labelsAndApheresis.apheresis);

                // If only 1 result then pre-select it
				if(labelsAndApheresis.apheresis.length == 1){
					console.log("auto-selected Apheresis Center: " + labelsAndApheresis.apheresis[0].Id);
					// Set the selected value
                    component.set("v.selectedApheresisCenterId", labelsAndApheresis.apheresis[0].Id);
                    // Force-call the onchange method associated with the select
					this.filterPickUpLocations(component);
                }

                // Promise resolved
				if(resolve) {
                    console.log('resolving filterSites');
                    resolve('filterSites succeeded');
                }
			} 
			else if (state === "ERROR") {
				// Helper method to log error
                logError(response.getError());
                // Promise rejected
				if(reject) {
                    console.log('rejecting filterSites');
                    reject(Error(response.getError()[0].message));
                }
			} else{
				console.error("Unknown error: "+state);
			}
		});
        $A.enqueueAction(action);
        
        // filterInfusionCenters
		var action = component.get("c.getInfusionCenters");
        action.setParams({"selectedPurposeId": component.get("v.selectedPurposeId"),
                        "selectedSiteId": component.get("v.selectedSiteId")});
    	action.setCallback(this, function(response) {
			var state = response.getState();
			if (state === "SUCCESS") {
                console.log("filterInfusionCenters:callback:SUCCESS");
                let infusionCenters = response.getReturnValue();
                console.log("return: "+infusionCenters);
				// Populate the list of available PickUp Locations filtered by the selected Apheresis Center
				component.set("v.infusionCenters", infusionCenters);

                // If only 1 result then pre-select it
				if(infusionCenters.length == 1){
					console.log("auto-selected Infusion Center: "+infusionCenters[0].Id);
					// Set the selected value
                    component.set("v.selectedInfusionCenterId", infusionCenters[0].Id);
                    // Force-call the onchange method associated with the select
					this.filterShipToLocations(component);
                }

                // Promise resolved
				if(resolve) {
                    console.log('resolving filterSites');
                    resolve('filterSites succeeded');
                }
			} else if (state === "ERROR") {
				// Helper method to log error
                logError(response.getError());
                // Promise rejected
				if(reject) {
                    console.log('rejecting filterSites');
                    reject(Error(response.getError()[0].message));
                }
            }
            else{
				console.error("Unknown error: "+state);
			}
		});
		$A.enqueueAction(action);
    },
    filterPickUpLocations: function(component, resolve, reject) {
		var action = component.get("c.getPickUpLocations");
    	action.setParams({"selectedApheresisCenterId": component.get("v.selectedApheresisCenterId")});
    	action.setCallback(this, function(response) {
			var state = response.getState();
			if (state === "SUCCESS") {
                console.log("filterPickUpLocations:callback:SUCCESS");
                console.log("return: "+response.getReturnValue());
				// Populate the list of available PickUp Locations filtered by the selected Apheresis Center
				component.set("v.pickUpLocations", response.getReturnValue());
				
				// Enable the picklist
                component.find("selectPickupLocation").set("v.disabled", false); 

                // Promise resolved
				if(resolve) {
                    console.log('resolving filterSites');
                    resolve('filterSites succeeded');
                }
			} else if (state === "ERROR") {
				console.log('filterPickUpLocations:callback ERROR');
				// Helper method to log error
                logError(response.getError());
                // Promise rejected
				if(reject) {
                    console.log('rejecting filterSites');
                    reject(Error(response.getError()[0].message));
                }
            }
            else{
				console.error("Unknown error: "+state);
			}
		});
		$A.enqueueAction(action);
    },
    filterShipToLocations: function(component, resolve, reject) {
		var action = component.get("c.getShipToLocations");
    	action.setParams({"selectedInfusionCenterId": component.get("v.selectedInfusionCenterId")});
    	action.setCallback(this, function(response) {
			var state = response.getState();
			if (state === "SUCCESS") {
                console.log("filterShipToLocations:callback:SUCCESS");
                console.log("return: "+response.getReturnValue());
				// Populate the list of available ShipTo Locations filtered by the selected Apheresis Center
				component.set("v.shipToLocations", response.getReturnValue());
				
				// Enable the picklist
                component.find("selectShipToLocation").set("v.disabled", false); 
			} else if (state === "ERROR") {
				console.log('filterShipToLocations:callback ERROR');
				// Helper method to log error
                logError(response.getError());
                // Promise rejected
				if(reject) {
                    console.log('rejecting filterSites');
                    reject(Error(response.getError()[0].message));
                }
            }
            else{
				console.error("Unknown error: "+state);
			}
		});
		$A.enqueueAction(action);
    }
})
