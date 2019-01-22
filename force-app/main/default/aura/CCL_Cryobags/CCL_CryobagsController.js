({
    init: function (component, event, helper) {
				console.log("CCL_CryobagsController:init");
				console.log("CCL_CryobagsController:recordId: "+component.get("v.recordId"));

				let cryobags ;
				if($A.util.isEmpty(component.get("v.cryobags"))){
					//  Initial AppointmentLineItem__c record
					cryobags = [{"sobjectType": "AppointmentLineItem__c",
											"Appointment__c": component.get("v.recordId"),
											"CryobagNumber__c": "1"}];
					component.set("v.cryobags", cryobags);
					console.log('init cryobag success DEFAULT');
				}
				
				component.set("v.partnercolumns", [{
					label: "Name",
					fieldName: "Name",
					type: "text"
			},
			{
					label: "Status",
					fieldName: "status__c",
					type: "text"
			},
			{
					label: "Created Date",
					fieldName: "createdate__c",
					type: "date"
			}
	]);
	component.set("v.partnerdata", [{
					Id: "a0319000001GtsjAAC",
					Name: "John Doe",
					status__c: "Active",
					createdate__c: "2005-01-01"
			},
			{
					Id: "a0319000001GtsjAAD",
					Name: "Mary Doe",
					status__c: "Active",
					createdate__c: "2005-02-10"
			}
	]);
    },
    addCryobag: function (component, event, helper) {
				console.log("CCL_CryobagsController:addCryobag");
				let cryobags = component.get("v.cryobags");
				
				//  Add a new AppointmentLineItem__c record to fill
				cryobags.push({"sobjectType": "AppointmentLineItem__c",
											"Appointment__c": component.get("v.recordId"),
											"CryobagNumber__c": (cryobags.length+1).toString()});
        component.set("v.cryobags", cryobags);
    },
    removeCryobag: function (component, event, helper) {
				console.log("CCL_CryobagsController:removeCryobag");
        let cryobags = component.get("v.cryobags");
        cryobags.pop();
        component.set("v.cryobags", cryobags);
    },
    clickNext: function (component, event, helper) {
			console.log("CCL_CryobagsController:clickNext");
			let cryobags = component.get("v.cryobags");
			console.log(cryobags);

			// Create records
			var action = component.get("c.insertCryobags");
			action.setParams({	
								"cryobags":    cryobags
							});
			
			action.setCallback(this, function(response) {
				var state = response.getState();
				if (state === "SUCCESS") {
						console.log('insertCryobags:callback SUCCESS');
						console.log(component.get("v.cryobags"));
						// Fire Next event 
						var cmpEvent = component.getEvent("navigationEvent");
						cmpEvent.setParams({
																"navigateOriginComponent" : "ADF_Cryobags",
																"navigateAction" 					: "Next",
																"cryobags"								:	component.get("v.cryobags")
																});
						cmpEvent.fire();
				} else if (state === "ERROR") {
						console.log('insertCryobags:callback ERROR');
						
						// Helper method to log error
						helper.logErrors(response);
				} else{
						console.error("Unknown error: "+state);
				}
			});
			$A.enqueueAction(action);
    },
})