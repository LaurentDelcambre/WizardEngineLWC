({
    clickPrevious: function(component, event) {
        console.log("CCL_PRF_ReviewSubmitController:clickPrevious");
        
		// Fire Previous event
        var cmpEvent = component.getEvent("navigationEvent");
        cmpEvent.setParams({
            "navigateOriginComponent" : "SUBMIT",
            "navigateAction" : "Previous",});
        cmpEvent.fire();
    },
    submit: function(component, event) {
        console.log("CCL_PRF_ReviewSubmitController:submit");

        // Create records
		var action = component.get("c.submitPRF");
		console.log("recordId before calling server submitPRF: "+component.get("v.recordId"));
		action.setParams({	
							"recordId":     component.get("v.recordId")
						});
		
		action.setCallback(this, function(response) {
		var state = response.getState();
		if (state === "SUCCESS") {
            console.log('submitPRF:callback SUCCESS');
            
            // Get inserted Case Id
            let caseRecordId = response.getReturnValue();
            console.log('caseRecordId: '+caseRecordId);

			// TOAST notif using Application standard event
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Success!",
                message: "Case inserted: " + caseRecordId,
                type: "success"
            });
            toastEvent.fire();
		} else if (state === "ERROR") {
			console.log('submitPRF:callback ERROR');
			
			// Helper method to log error
			logError(response.getError());
		} else{
			console.error("Unknown error: "+state);
		}
		});
		$A.enqueueAction(action);
    }
})
