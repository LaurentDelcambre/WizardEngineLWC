({
	doInit : function(component, event, helper) {
		console.log("CCL_PRF_LogisticsController:doInit");
		if(!component.get("v.selectedApheresisCenterId") || (component.get("v.reviewMode") == true)){
			helper.initApheresisAndInfusion(component);
		}
		else{
			console.log("before Promise init");
			helper.helperFunctionAsPromise(component, helper.initApheresisAndInfusion)
				.then($A.getCallback(function(){
					return helper.helperFunctionAsPromise(component, helper.filterPickUpLocations)
				}))
				.then($A.getCallback(function(){
					return helper.helperFunctionAsPromise(component, helper.filterShipToLocations)
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
	filterPickUpLocations: function(component, event, helper) {
		// Call the non-Promise version
		helper.filterPickUpLocations(component);
	},
	filterShipToLocations: function(component, event, helper) {
		// Call the non-Promise version
		helper.filterShipToLocations(component);
	},
	clickNext : function(component, event, helper) {
		console.log("CCL_PRF_LogisticsController:clickNext");
		
		// Validation
		let selectedApheresisCenterId = component.get("v.selectedApheresisCenterId");
		let selectedPickUpLocationId = component.get("v.selectedPickUpLocationId");
		let selectedInfusionCenterId = component.get("v.selectedInfusionCenterId");
		let selectedShipToLocationId = component.get("v.selectedShipToLocationId");

		let cmpApheresis = component.find("selectApheresisCenter");
		if(!cmpApheresis.get('v.validity').valid){
			cmpApheresis.showHelpMessageIfInvalid();
			return;
		}
		let cmpPickup = component.find("selectPickupLocation");
		if(!cmpPickup.get('v.validity').valid){
			cmpPickup.showHelpMessageIfInvalid();
			return;
		}
		let cmpInfusion = component.find("selectedInfusionCenter");
		if(!cmpInfusion.get('v.validity').valid){
			cmpInfusion.showHelpMessageIfInvalid();
			return;
		}
		let cmpShipTo = component.find("selectShipToLocation");
		if(!cmpShipTo.get('v.validity').valid){
			cmpShipTo.showHelpMessageIfInvalid();
			return;
		}

		// Create records
		var action = component.get("c.insertPRFLogisticsRecords");
		console.log("recordId before calling server insertPRFLogisticsRecords: "+component.get("v.recordId"));
		action.setParams({	
							"recordId":     component.get("v.recordId"),
							"apheresisCenterId": selectedApheresisCenterId,
							"pickUpLocationId": selectedPickUpLocationId,
							"infusionCenterId": selectedInfusionCenterId,
							"shipToLocationId": selectedShipToLocationId
						});
		
		action.setCallback(this, function(response) {
		var state = response.getState();
		if (state === "SUCCESS") {
			console.log('insertPRFLogisticsRecords:callback SUCCESS');
			// Fire Next event 
			var cmpEvent = component.getEvent("navigationEvent");
			cmpEvent.setParams({
								"navigateOriginComponent" : "PRF_Logistics",
								"navigateAction" : "Next",
								"selectedApheresisCenterId": 	selectedApheresisCenterId,
								"selectedPickUpLocationId": 	selectedPickUpLocationId,
								"selectedInfusionCenterId": 	selectedInfusionCenterId,
								"selectedShipToLocationId": 	selectedShipToLocationId
								});
			cmpEvent.fire();
		} else if (state === "ERROR") {
			console.log('insertPRFLogisticsRecords:callback ERROR');
			
			// Helper method to log error
			helper.logErrors(response.getError());
		} else{
			console.error("Unknown error: "+state);
		}
		});
		$A.enqueueAction(action);
	},
	clickPrevious: function(component, event) {
        console.log("CCL_LogisticsController:clickPrevious");
        
		// Fire Previous event
        var cmpEvent = component.getEvent("navigationEvent");
        cmpEvent.setParams({"navigateOriginComponent" : "PRF_Logistics",
														"navigateAction" : "Previous"});
        cmpEvent.fire();
	}
})
