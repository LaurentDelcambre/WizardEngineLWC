({
  filterResults: function(component, event, helper) {
    var hcpId = component.find("hcp").get("v.value");
    var purpose = component.find("purpose").get("v.value");
    var priority = component.find("priority").get("v.value");
    if (hcpId || purpose || priority) {
      var compEvent = component.getEvent("filteredCasesEvent");
			compEvent.setParams({
        "hcpId" : hcpId,
        "purpose" : purpose,
        "priority" : priority
     });
      compEvent.fire();
    } else {
			var compEvent = component.getEvent("resetFilter");
      compEvent.fire();
		}
  },

	clear: function(component, event, helper) {
		component.find("hcp").set("v.value", "");
    component.find("purpose").set("v.value","")
    component.find("priority").set("v.value","")
		var compEvent = component.getEvent("resetFilter");
		compEvent.fire();
	}
})