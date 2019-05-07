({
	// Create dynamically a progressIndicator component
	createProgressBar : function(component, stepsData) {
		console.log("createProgressBar:start");
        // List of components to create, starting with the father itself
        var stepsPreComponents = [[
            "lightning:progressIndicator",
            {
				"aura:id": "progressIndicator",
				"currentStep" : "1",
				"type":"path",
				"title":"PRF steps"
            }
        ]];

        // Add the steps
        for (var index in stepsData) {
            var step = stepsData[index];
            let stepIndex = parseInt(index)+1;
            stepsPreComponents.push([
                "lightning:progressStep",
                {
                    "label":step.Label,
                    "value":stepIndex
                }
            ]);
        }

		console.log("createProgressBar:before dynamic creation");
        $A.createComponents(
            stepsPreComponents,
            function(createdComponent, status, errorMessage){
                if (status === "SUCCESS") {
                    console.log("createProgressBar:after dynamic creation");
                    // Remove the father
                    var progressIndicator = createdComponent.shift();
                    // Add the rest to the father
                    progressIndicator.set('v.body',createdComponent);
                    // Assign it to the view Attribute
                    component.set("v.progressIndicator",progressIndicator);
                } else {
                    alert('Error creating the Progress Bar');
                }
            }
        );
    },
    // Create dynamically a DynamicFieldSet component
	createDynamicFieldSet : function(component, objectName, selectedWizardStepId, recordId) {
        console.log("createDynamicFieldSet:start");

        // Setup of paramteres
        let parameters = {
            "aura:id": "dynamicFieldSetCmp",
            "objectName": objectName,
            "selectedWizardStepId": selectedWizardStepId,
            "onnavigationEvent": component.getReference("c.handleNavigationEvent")
        }

        // If existing record
        if(recordId){
            parameters["recordId"] = recordId;
        }

        $A.createComponent(
            //"c:CCL_DynamicFieldset",
            "c:ccl_dynamic_form",
            parameters,
            function(createdComponent, status, errorMessage){
                if (status === "SUCCESS") {
                    console.log("createDynamicFieldSet:after dynamic creation of Dynamic Field Set");

                    // Init called when dynamicCOmponent is set
                    component.set("v.dynamicFieldSetCmp", createdComponent);

                    // Display it
                    $A.util.removeClass(component.find("patientContainer"), "hidden");
                } else {
                    alert('Error creating the Dynamic Field Set: '+errorMessage);
                }
            }
        );
	}
})
