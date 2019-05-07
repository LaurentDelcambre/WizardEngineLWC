({
	hideModal : function(component, event, helper) {
		$A.get('e.force:refreshView').fire();
		var cmpEvent = component.getEvent("hideModalEvent");
		cmpEvent.fire();
    },
    forceRerender : function(component, event, helper) {
        component.set("v.isDisplayEngine", false);
        console.log('dashboardModal:forceRerender');
        console.log('dashboardModal:wizardType:'+component.get("v.wizardType"));
        console.log('dashboardModal:objectName:'+component.get("v.objectName"));
        //component.set("v.wizardType", "ADF_Wizard");
        component.set("v.isDisplayEngine", true);
    },
})
