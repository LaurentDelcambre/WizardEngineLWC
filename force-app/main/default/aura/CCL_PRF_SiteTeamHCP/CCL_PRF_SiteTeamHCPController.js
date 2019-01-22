({
  doInit : function(component, event, helper) {
		if(!component.get("v.selectedSiteId") || (component.get("v.reviewMode") == true)){
			helper.filterSites(component);
		}
		else{
			console.log("before Promise init");
			helper.helperFunctionAsPromise(component, helper.filterSites)
				.then($A.getCallback(function(){
					return helper.helperFunctionAsPromise(component, helper.filterTeams)
				}))
				.then($A.getCallback(function(){
					return helper.helperFunctionAsPromise(component, helper.filterHCPs)
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
	filterSites: function(component, event, helper){
		// Call the non-Promise version
		helper.filterSites(component);
	},
	filterTeams: function(component, event, helper){
		// Call the non-Promise version
		helper.filterTeams(component);
	},
	filterHCPs: function(component, event, helper){
		// Call the non-Promise version
		helper.filterHCPs(component);
	},
  clickNext : function(component, event, helper) {
		console.log("CCL_PRF_PurposeSiteController:clickNext");
		console.log("CCL_PRF_PurposeSiteController:selectedSiteId: "+component.get("v.selectedSiteId"));
		
		// Validation
		let selectedPurposeId = component.get("v.selectedPurposeId");
		let selectedWizardName = component.get("v.selectedWizardName");
		console.log("selectedWizardName: "+selectedWizardName);
		let selectedSiteId = component.get("v.selectedSiteId");
		let selectedTeamId = component.get("v.selectedTeamId");
		let selectedHCPId = component.get("v.selectedHCPId");


		let cmpSite = component.find("selectSite");
		if(!cmpSite.get('v.validity').valid){
			cmpSite.showHelpMessageIfInvalid();
			return;
		}
		let cmpTeam = component.find("selectTeam");
		if(!cmpTeam.get('v.validity').valid){
			cmpTeam.showHelpMessageIfInvalid();
			return;
		}
		let cmpCHP = component.find("selectHCP");
		if(!cmpCHP.get('v.validity').valid){
			cmpCHP.showHelpMessageIfInvalid();
			return;
		}

		// Create records
		var action = component.get("c.insertPRFStep1Records");
		action.setParams({	
							purposeId: selectedPurposeId,
							wizardName: selectedWizardName,
							siteId: selectedSiteId,
							teamId: selectedTeamId,
							HCPId: selectedHCPId,
							recordId: component.get("v.recordId")
						});
		console.log("before set callback");
    	action.setCallback(this, function(response) {
			var state = response.getState();
			console.log("state: "+state);
			if (state === "SUCCESS") {
				console.log('insertPRFStep1Records:callback SUCCESS');

				// Returned Ids
				let recordId = response.getReturnValue();
				console.log('recordId returned form Server call: '+recordId);

				// Fire Next event with recordId
				var cmpEvent = component.getEvent("navigationEvent");
				cmpEvent.setParams({
									"navigateOriginComponent" : "PRF_START",
									"navigateAction" : "Next",
									"recordId" : 		recordId,
									"selectedPurposeId": 	selectedPurposeId,
									"selectedSiteId": 		selectedSiteId,
									"selectedTeamId": 		selectedTeamId,
									"selectedHCPId": 		selectedHCPId
									});
				cmpEvent.fire();
			} else if (state === "ERROR") {
				console.log('insertPRFStep1Records:callback ERROR');
				helper.logErrors(response);
			} else{
				console.error("Unknown error: "+state);
			}
		});
		$A.enqueueAction(action);
	},
	clickPrevious: function(component, event) {
    console.log("CCL_PRFController:clickPrevious");
        
		// Fire Previous event
		var cmpEvent = component.getEvent("navigationEvent");
		cmpEvent.setParams({
						"navigateOriginComponent" : "PRF_START",
						"navigateAction" : "Previous",});
		cmpEvent.fire();
	}
})
