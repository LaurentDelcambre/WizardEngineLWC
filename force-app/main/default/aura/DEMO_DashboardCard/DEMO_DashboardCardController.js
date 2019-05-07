({
    doInit: function(component, event, helper) {
      var myCase = component.get("v.Case");
      switch (myCase.Status) {
        case 'New':
          $A.util.addClass(component.find("order"), 'inProgress');
          $A.util.addClass(component.find("apheresis"), 'notStarted');
          $A.util.addClass(component.find("manufacturing"), 'notStarted');
          $A.util.addClass(component.find("delivery"), 'notStarted');
          break;
        case 'Plant Appointment':
          $A.util.addClass(component.find("order"), 'inProgress');
          $A.util.addClass(component.find("apheresis"), 'notStarted');
          $A.util.addClass(component.find("manufacturing"), 'notStarted');
          $A.util.addClass(component.find("delivery"), 'notStarted');
          break;
        case 'Apheresis':
          $A.util.addClass(component.find("order"), 'completed');
          $A.util.addClass(component.find("apheresis"), 'inProgress');
          $A.util.addClass(component.find("manufacturing"), 'notStarted');
          $A.util.addClass(component.find("delivery"), 'notStarted');
          break;
        case 'Pickup':
          $A.util.addClass(component.find("order"), 'completed');
          $A.util.addClass(component.find("apheresis"), 'inProgress');
          $A.util.addClass(component.find("manufacturing"), 'notStarted');
          $A.util.addClass(component.find("delivery"), 'notStarted');
          break;
        case 'Cell Processing':
          $A.util.addClass(component.find("order"), 'completed');
          $A.util.addClass(component.find("apheresis"), 'completed');
          $A.util.addClass(component.find("manufacturing"), 'inProgress');
          $A.util.addClass(component.find("delivery"), 'notStarted');
          break;
        case 'Finished Material Delivery':
          $A.util.addClass(component.find("order"), 'completed');
          $A.util.addClass(component.find("apheresis"), 'completed');
          $A.util.addClass(component.find("manufacturing"), 'completed');
          $A.util.addClass(component.find("delivery"), 'inProgress');
          break;
        case 'Infusion':
          $A.util.addClass(component.find("order"), 'completed');
          $A.util.addClass(component.find("apheresis"), 'completed');
          $A.util.addClass(component.find("manufacturing"), 'completed');
          $A.util.addClass(component.find("delivery"), 'inProgress');
          break;
        case 'Closed':
          $A.util.addClass(component.find("order"), 'completed');
          $A.util.addClass(component.find("apheresis"), 'completed');
          $A.util.addClass(component.find("manufacturing"), 'completed');
          $A.util.addClass(component.find("delivery"), 'completed');
          break;
        default:
          $A.util.addClass(component.find("order"), 'notStarted');
          $A.util.addClass(component.find("apheresis"), 'notStarted');
          $A.util.addClass(component.find("manufacturing"), 'notStarted');
          $A.util.addClass(component.find("delivery"), 'notStarted');
      }
      switch (myCase.PRF_Status__c) {
        case 'Draft':
          $A.util.addClass(component.find("requestStatus"), 'slds-hide');
          break;
        case 'Submitted':
          $A.util.addClass(component.find("requestStatus"), 'slds-hide');
          break;
        case 'Approved':
          $A.util.addClass(component.find("requestStatus"), 'completed pointer');
          component.set("v.Action", "Create ADF");
          break;
        case 'Rejected':
          $A.util.addClass(component.find("requestStatus"), 'slds-hide');
          break;
        case 'Cancelled':
          $A.util.addClass(component.find("requestStatus"), 'slds-hide');
          break;
        default:
          $A.util.addClass(component.find("requestStatus"), 'notStarted');
      }

    },

    goToRecord: function(component) {
      // var navEvt = $A.get("e.force:navigateToSObject");
      // navEvt.setParams({
      //   "recordId": component.get("v.Case.Id"),
      //   "slideDevName": "detail"
      // });
      // navEvt.fire();
      console.log('selected id: '+component.get("v.Case.Id"));
      var compEvent = component.getEvent("selectRecordEvent");
      compEvent.setParams({"recordId": component.get("v.Case.Id"),
                        "objectName": "Case",
                        "wizardType": "PRF_Wizard"
                        });
      compEvent.fire();
    },

    createADF: function(component) {
      console.log('dashboardCard:createADF');
      var compEvent = component.getEvent("createADFEvent");
      console.log('dashboardCard:case Id :'+component.get("v.Case.Id"));
      compEvent.setParams({"recordId": component.get("v.Case.Id"),
                            "prfId": component.get("v.Case.Id")});
      compEvent.fire();
    },

    submitDraft: function(component) {
      var action = component.get("c.updateCaseStatus");
      action.setParams({caseId: component.get("v.Case").Id});
      action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === "SUCCESS") {
          $A.get('e.force:refreshView').fire();
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
    }
  })
