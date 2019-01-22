({
  doInit: function(component, event, helper) {
    var action = component.get("c.loadCases");
    action.setCallback(this, function(response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        component.set("v.Cases", response.getReturnValue());
        component.set("v.AllCases", response.getReturnValue());
        var cases = component.get("v.Cases");
        var hcps = [];
        var purposes = [];
        for (var i = 0; i < cases.length; i++) {
          var counter = 0;
          var counter2 = 0;
          if (cases[i].Contact != null) {
            for (var j = 0; j < hcps.length; j++) {
              if (cases[i].Contact.Id == hcps[j].Id) {
                counter = + 1;
              }
            }
            if (counter < 1) {
              hcps.push({Id: cases[i].Contact.Id, Name: cases[i].Contact.Name});
            }
          }
          if (cases[i].Purpose__r != null) {
            for (var j = 0; j < purposes.length; j++) {
              if (cases[i].Purpose__r.Id == purposes[j].Id) {
                counter2 = + 1;
              }
            }
            if (counter2 < 1) {
              purposes.push({Id: cases[i].Purpose__r.Id, Name: cases[i].Purpose__r.Name});
            }
          }
        }
        component.set("v.HCPS", hcps);
        component.set("v.Purposes", purposes);
      } else if (state === "ERROR") {
        var errors = response.getError();
        if (errors) {
          if (errors[0] && errors[0].message) {
            console.log("Error message: " + errors[0].message);
          }
        } else {
          console.log("Unknown error");
        }
      }
    });
    $A.enqueueAction(action);
  },

  filterCases: function(component, event, helper) {
    component.set("v.Cases", component.get("v.AllCases"));
    var cases = component.get("v.Cases");
    var filteredCases = [];
    var hcpId = event.getParam("hcpId");
    var purpose = event.getParam("purpose");
    var priority = event.getParam("priority");
    console.log(purpose);
    console.log(hcpId);
    console.log(priority);
    if (hcpId != "" && purpose == "" && priority == "") {
      for (var i = 0; i < cases.length; i++) {
        if (cases[i].Contact != null) {
          if (cases[i].Contact.Id == hcpId) {
            filteredCases.push(cases[i]);
          }
        }
      }
    } else if (hcpId == "" && purpose != "" && priority == "") {
      for (var i = 0; i < cases.length; i++) {
        if (cases[i].Purpose__r != null) {
          if (cases[i].Purpose__r.Id == purpose) {
            filteredCases.push(cases[i]);
          }
        }
      }
    } else if (hcpId == "" && purpose == "" && priority != "") {
      for (var i = 0; i < cases.length; i++) {
        if (cases[i].Priority != null) {
          if (cases[i].Priority == priority) {
            filteredCases.push(cases[i]);
          }
        }
      }
    } else if (hcpId != "" && purpose != "" && priority == "") {
      for (var i = 0; i < cases.length; i++) {
        if (cases[i].Purpose__r != null && cases[i].Contact != null) {
          if (cases[i].Purpose__r.Id == purpose && cases[i].Contact.Id == hcpId) {
            filteredCases.push(cases[i]);
          }
        }
      }
    } else if (hcpId != "" && purpose == "" && priority != "") {
      for (var i = 0; i < cases.length; i++) {
        if (cases[i].Priority != null && cases[i].Contact != null) {
          if (cases[i].Priority == priority && cases[i].Contact.Id == hcpId) {
            filteredCases.push(cases[i]);
          }
        }
      }
    } else if (hcpId == "" && purpose != "" && priority != "") {
      for (var i = 0; i < cases.length; i++) {
        if (cases[i].Priority != null && cases[i].Purpose__r != null) {
          if (cases[i].Priority == priority && cases[i].Purpose__r.Id == purpose) {
            filteredCases.push(cases[i]);
          }
        }
      }
    } else if (hcpId != "" && purpose != "" && priority != "") {
      for (var i = 0; i < cases.length; i++) {
        if (cases[i].Priority != null && cases[i].Purpose__r != null && cases[i].Contact != null) {
          if (cases[i].Priority == priority && cases[i].Purpose__r.Id == purpose && cases[i].Contact.Id == hcpId) {
            filteredCases.push(cases[i]);
          }
        }
      }
    }
    component.set("v.Cases", filteredCases);
  },

  toggleModal: function(component, event, helper) {
    $A.util.toggleClass(component.find("modal"), 'slds-hide');
  }
})