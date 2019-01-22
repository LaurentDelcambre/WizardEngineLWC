({
	hideModal : function(component, event, helper) {
		$A.get('e.force:refreshView').fire();
		var cmpEvent = component.getEvent("hideModalEvent");
		cmpEvent.fire();
	}
})