({
    init: function(component, event, helper) {
        console.log('CCL_DynamicFieldsetController.init');

        // Display  Spinner
        component.set("v.isLoading", true);
        
        var fieldSetName = component.get('v.fieldSetName');
        var sobjectName = component.get('v.sObjectName');
        var recordId = component.get('v.recordId');
        
        if (!fieldSetName) {
        	console.log('The field set is required.');
        	return;
        }
        
        var getFieldsAction = component.get('c.getFields');
        console.log("parameter sobjectName: "+sobjectName);
        console.log("parameter fieldSetName: "+fieldSetName);
        getFieldsAction.setParams({
            recordId: recordId,
            objectName: sobjectName,
            fieldSetName: fieldSetName
        });

        getFieldsAction.setCallback(this, 
            function(response) {
            	var state = response.getState();
            	console.log('FieldSetFormController getFieldsAction callback');
            	console.log("callback state: " + state);
            
            	if (component.isValid() && state === "SUCCESS") {
                    var fields = response.getReturnValue();
	                component.set('v.fields', fields);
                }
                else{
                    helper.logErrors(response);
                }
                // Hide  Spinner
                component.set("v.isLoading", false);
        
            }
        );
        $A.enqueueAction(getFieldsAction);
    },
    doSubmit: function(component, event, helper) {
        console.log('CCL_DynamicFieldsetController.doSubmit');
        var response = component.find("recordEditForm").submit();
        console.log(response);
    },
    saveSuccess: function(component, event, helper) {
        console.log('CCL_DynamicFieldsetController.saveSuccess');
        var response = event.getParams().response;
        console.log(response);
        var returnedRecordId = response.id;
        console.log(returnedRecordId);

        // TOAST notif using Application standard event
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: "Success!",
            message: "Congrats, it works!",
            type: "success"
        });
        toastEvent.fire();

        // Fire Next event
        var cmpEvent = component.getEvent("navigationEvent");
        cmpEvent.setParams({"navigateOriginComponent" : "Wizard_FieldSet",
                            "navigateAction" : "Next",
                            "recordId"       : returnedRecordId});
        cmpEvent.fire();
    },
    saveSubmit: function(component, event, helper) {
        console.log('CCL_DynamicFieldsetController.saveSubmit');
        console.log(component.find('fieldId'));
        // Error handling

        //only for test
        //component.find("fieldTest").set('v.validity', {valid:false, badInput :true});

        /* Get fields values */
        // get all fields from the form. Note that the Form have already gathered and parsed the fields
        // so we need to fix the wrongfully parsed values
        var eventFields = event.getParam("fields");
        var field = 'NumberOfEmployees';
        
        // check if the field exists
        if (eventFields.hasOwnProperty(field)) {
            // we know this should be Integer but instead its a String, so we parse it
            eventFields[field] = parseInt(eventFields.NumberOfEmployees);
            // assign the fields back to the event
            event.setParam("fields", eventFields);
        }
        /************************** */
        
        // Stores the error message
        let errorMessage = '';
        var allValid = component.find('fieldId').reduce(function (validSoFar, inputCmp) {
            // Custom validator
            let fieldValid = true;
            console.log(inputCmp.get("v.fieldName"));
            console.log(inputCmp.get("v.value"));
            console.log(inputCmp.get("v.validity"));

            // Custom validity check for field
            var reg = new RegExp('^\\d+$');
            if(inputCmp.get("v.fieldName") === 'Phone' && !reg.test(inputCmp.get("v.value"))){
                fieldValid = false;
                errorMessage += 'Phone is invalid';
                //inputCmp.set("v.errors", [{message:"Input not a Phone number: " + inputCmp.get("v.fieldName")}]);
                //inputCmp.set("v.validity", {valid:false, badInput :true});
            }
            //inputCmp.showHelpMessageIfInvalid();
            let finalValid = validSoFar && fieldValid;
            return finalValid;
        }, true);

        console.log('HOYYOU');

        if (!allValid) {
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": "Something has gone wrong!",
                "message": errorMessage
                // closeCallback: function() {
                //     console.log('You closed the alert!');
                // }
            });
            // IMPORTANT: prevent the form submition
            //event.preventDefault();
            event.stopPropagation();
        }
    },
    saveError: function(component, event, helper) {
        console.log('CCL_DynamicFieldsetController.saveError');
        console.log('Inside Error handling');
        var eventName = event.getName();
        var params = event.getParams();
        var fieldErrors = params.error.data.output.fieldErrors;

        console.log(fieldErrors);

        for (let key of Object.keys(fieldErrors)) {
            console.log(fieldErrors[key][0].field + ": "+fieldErrors[key][0].errorCode);
        }
        console.log("end of error");

        // component.find('notifLib').showNotice({
        //     "variant": "error",
        //     "header": "Something has gone wrong!",
        //     "message": "Unfortunately, there was a problem updating the record.",
        //     closeCallback: function() {
        //         console.log('You closed the alert!');
        //     }
        // });
    },
	clickPrevious: function(component, event) {
        console.log("CCL_PRFController:clickPrevious");
        
		// Fire Previous event
        var cmpEvent = component.getEvent("navigationEvent");
        cmpEvent.setParams({
                "navigateOriginComponent" : "Wizard_FieldSet",
                "navigateAction" : "Previous",});
        cmpEvent.fire();
	}
})
