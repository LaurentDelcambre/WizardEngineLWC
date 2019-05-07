public with sharing class DashboardController {

    public class CaseAppointmentWrapper{
        @AuraEnabled
        public String type{get;set;}
        @AuraEnabled
        public Case myCase{get;set;}
        @AuraEnabled
        public Appointment__c appointment{get;set;}
        public CaseAppointmentWrapper(){
        }
    }

    @AuraEnabled
    public static List<CaseAppointmentWrapper> loadCasesAppointment() {
        List<CaseAppointmentWrapper> liWrapper = new List<CaseAppointmentWrapper>();
        for(Case lCase: [SELECT
                    DEMO_Patient_DOB_NVS__c
                    , DEMOPatientNamecalc__c
                    , Priority, Purpose__r.Name, Purpose__r.Id, Id, Contact.Name, Subject, Status, CaseNumber, Patient__r.FirstName__c,
                    Patient__r.LastName__c, Patient__r.DateOfBirth__c, GroupBatchNumber__c, PRF_Status__c, Status_Apheresis_Procedure__c,
                    Status_Apheresis_Pickup__c, Status_Finished_Product_Delivery__c FROM Case WHERE RecordType.Name = 'Treatment' ORDER BY CaseNumber DESC]){
            CaseAppointmentWrapper wrap = new CaseAppointmentWrapper();
            wrap.type='Case';
            wrap.myCase = lCase;
            liWrapper.add(wrap);
        }
        // for(Appointment__c lAppointment: [select Id,ADF_Status__c, Account__c,ADFSubmittedDate__c,Name,AppointmentDate__c,Approver__c,Case__c,Case__r.Id,Site__c,Status_Finished_Product_Delivery__c,Status_Apheresis_Pickup__c,Status_Apheresis_Procedure__c from Appointment__c]){
        //     CaseAppointmentWrapper wrap = new CaseAppointmentWrapper();
        //     wrap.type='Appointment';
        //     wrap.appointment=lAppointment;
        //     liWrapper.add(wrap);
        // }
        system.debug('liWrapper:size(): '+liWrapper.size());
        return liWrapper;
    }

  @AuraEnabled
  public static Case updateCaseStatus(String caseId) {
    Case myCase = [SELECT Id, PRF_Status__c FROM Case WHERE Id =: caseId];
    myCase.PRF_Status__c = 'Submitted';
    update myCase;
    return myCase;
  }

  @AuraEnabled
  public static Case loadThisCase(String caseId) {
    return [SELECT Id, Patient__r.Name, Purpose__r.Name, Account.Name, Priority, Subject, PRF_Status__c,   ADF_Status__c, PRFSubmittedDate__c, PRFApprovedDate__c FROM Case WHERE Id =: caseId];
  }
}
