public with sharing class DashboardController {
	@AuraEnabled
	public static List<Case> loadCases() {
		return [SELECT Priority, Purpose__r.Name, Purpose__r.Id, Id, Contact.Name, Subject, Status, CaseNumber, Patient__r.FirstName__c, Patient__r.LastName__c, Patient__r.DateOfBirth__c, GroupBatchNumber__c, PRF_Status__c, Status_Apheresis_Procedure__c, Status_Apheresis_Pickup__c, Status_Finished_Product_Delivery__c FROM Case WHERE RecordType.Name = 'Treatment' ORDER BY CaseNumber DESC];
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
		return [SELECT Id, Patient__r.Name, Purpose__r.Name, Account.Name, Priority, Subject, PRF_Status__c, 	ADF_Status__c, PRFSubmittedDate__c, PRFApprovedDate__c FROM Case WHERE Id =: caseId];
	}
}