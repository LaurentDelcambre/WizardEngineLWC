({
    doInit: function(component, event, helper) {
        console.log("CCL_LabelManager:doInit");
        // Get the list of labels
		var action = component.get("c.getLabelList");

		action.setCallback(this, function(response) {
			var state = response.getState();
			console.log("state: "+state);
			if (state === "SUCCESS") {
				console.log('getLabelList:callback SUCCESS');

				// Returned Labels
                let liLabels = response.getReturnValue();
                console.log('returned liLabels: '+liLabels);
                let labelValues = [];
                for(var i=0;i<liLabels.length;i++){
                    let tempValue = $A.getReference("$Label.c." + liLabels[i]);
                    component.set("v.trial", tempValue);
                    labelValues[i] = component.get("v.trial");
                }
                console.log(labelValues);


                // Set the attribute to pass it to the engine
                component.set("v.labels", liLabels);
                component.set("v.labelValues", labelValues);
                // Tells the engine to load
                component.set("v.isInitDone", true);
                var str = component.get("v.trial");
                console.log('computed?: '+str);

            }
		});
		$A.enqueueAction(action);
	},
})
