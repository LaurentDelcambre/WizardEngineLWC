({
    doInit: function(component, event, helper) {
        //console.log('DEMO_DashboardCardAppointmentController:init');
      var myAppointment = component.get("v.appointment");
      //console.log('DEMO_DashboardCardAppointmentController:myAppointment: '+myAppointment);
      $A.util.addClass(component.find("order"), 'completed');
      $A.util.addClass(component.find("apheresis"), 'inProgress');
      $A.util.addClass(component.find("manufacturing"), 'notStarted');
      $A.util.addClass(component.find("delivery"), 'notStarted');


    //   switch (myAppointment.Status) {
    //     case 'New':
    //       $A.util.addClass(component.find("order"), 'inProgress');
    //       $A.util.addClass(component.find("apheresis"), 'notStarted');
    //       $A.util.addClass(component.find("manufacturing"), 'notStarted');
    //       $A.util.addClass(component.find("delivery"), 'notStarted');
    //       break;
    //     case 'Plant Appointment':
    //       $A.util.addClass(component.find("order"), 'inProgress');
    //       $A.util.addClass(component.find("apheresis"), 'notStarted');
    //       $A.util.addClass(component.find("manufacturing"), 'notStarted');
    //       $A.util.addClass(component.find("delivery"), 'notStarted');
    //       break;
    //     case 'Apheresis':
    //       $A.util.addClass(component.find("order"), 'completed');
    //       $A.util.addClass(component.find("apheresis"), 'inProgress');
    //       $A.util.addClass(component.find("manufacturing"), 'notStarted');
    //       $A.util.addClass(component.find("delivery"), 'notStarted');
    //       break;
    //     case 'Pickup':
    //       $A.util.addClass(component.find("order"), 'completed');
    //       $A.util.addClass(component.find("apheresis"), 'inProgress');
    //       $A.util.addClass(component.find("manufacturing"), 'notStarted');
    //       $A.util.addClass(component.find("delivery"), 'notStarted');
    //       break;
    //     case 'Cell Processing':
    //       $A.util.addClass(component.find("order"), 'completed');
    //       $A.util.addClass(component.find("apheresis"), 'completed');
    //       $A.util.addClass(component.find("manufacturing"), 'inProgress');
    //       $A.util.addClass(component.find("delivery"), 'notStarted');
    //       break;
    //     case 'Finished Material Delivery':
    //       $A.util.addClass(component.find("order"), 'completed');
    //       $A.util.addClass(component.find("apheresis"), 'completed');
    //       $A.util.addClass(component.find("manufacturing"), 'completed');
    //       $A.util.addClass(component.find("delivery"), 'inProgress');
    //       break;
    //     case 'Infusion':
    //       $A.util.addClass(component.find("order"), 'completed');
    //       $A.util.addClass(component.find("apheresis"), 'completed');
    //       $A.util.addClass(component.find("manufacturing"), 'completed');
    //       $A.util.addClass(component.find("delivery"), 'inProgress');
    //       break;
    //     case 'Closed':
    //       $A.util.addClass(component.find("order"), 'completed');
    //       $A.util.addClass(component.find("apheresis"), 'completed');
    //       $A.util.addClass(component.find("manufacturing"), 'completed');
    //       $A.util.addClass(component.find("delivery"), 'completed');
    //       break;
    //     default:
    //       $A.util.addClass(component.find("order"), 'notStarted');
    //       $A.util.addClass(component.find("apheresis"), 'notStarted');
    //       $A.util.addClass(component.find("manufacturing"), 'notStarted');
    //       $A.util.addClass(component.find("delivery"), 'notStarted');
    //    }
    //   switch (myAppointment.PRF_Status__c) {
    //     case 'Draft':
    //       $A.util.addClass(component.find("requestStatus"), 'slds-hide');
    //       break;
    //     case 'Submitted':
    //       $A.util.addClass(component.find("requestStatus"), 'slds-hide');
    //       break;
    //     case 'Approved':
    //       $A.util.addClass(component.find("requestStatus"), 'completed pointer');
    //       component.set("v.Action", "Create ADF");
    //       break;
    //     case 'Rejected':
    //       $A.util.addClass(component.find("requestStatus"), 'slds-hide');
    //       break;
    //     case 'Cancelled':
    //       $A.util.addClass(component.find("requestStatus"), 'slds-hide');
    //       break;
    //     default:
    //       $A.util.addClass(component.find("requestStatus"), 'notStarted');
    //   }

    },

    goToAppointmentRecord: function(component) {
      console.log('goToAppointmentRecord:selected id: '+component.get("v.appointment.Id"));
      console.log('goToAppointmentRecord:prfId: '+component.get("v.appointment.Case__r.Id"));
      var compEvent = component.getEvent("selectRecordEvent");
      compEvent.setParams({
                        "recordId": component.get("v.appointment.Id"),
                        "prfId": component.get("v.appointment.Case__r.Id"),
                        "objectName": "Appointment__c",
                        "wizardType": "ADF_Wizard"});
      compEvent.fire();
    },

  })
