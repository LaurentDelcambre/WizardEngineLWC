public with sharing class CCL_PRFController {


	public class PurposesAndLabel{
		@AuraEnabled
		public List<String> labels{get;set;}
		@AuraEnabled
		public List<Purpose__c> purposes{get;set;}
		public PurposesAndLabel(List<String> labels, List<Purpose__c> purposes){
			this.labels = labels;
			this.purposes = purposes;
		}
	}

	@AuraEnabled
	public static PurposesAndLabel initPurposes() {
		//Getting field label
		Map<String, Schema.SObjectField> fieldsMap = Schema.getGlobalDescribe().get('PRF__C').getDescribe().fields.getMap();
		List<String> fieldLabels = new List<String>{
			fieldsMap.get('Purpose__c').getDescribe().getLabel(),
			fieldsMap.get('Site__c').getDescribe().getLabel(),
			fieldsMap.get('Team__c').getDescribe().getLabel(),
			fieldsMap.get('HCP__c').getDescribe().getLabel()
		};
		return new PurposesAndLabel(fieldLabels, [SELECT Id, Name FROM Purpose__c ORDER BY Name]);
	}

	@AuraEnabled
	public static List<String> filterWizardsByPurpose(String purposeId) {
		// Returns a list of the name of Wizards associated to that Purpose
		List<String> liWizardNames = new List<String>();
		for(PurposeTemplate__c pt: [SELECT Id, Name, Purpose__c, Type__c
              FROM PurposeTemplate__c WHERE Purpose__c =: purposeId]){
			liWizardNames.add(pt.Name);
		}
		return liWizardNames;
	}

	// Gets Wizard Steps information
	@AuraEnabled(Cacheable=true)
	public static List<CCL_WizardStep__mdt> getStepsFromMetadata(String selectedWizardName) {
		return [select id, Label, Component__C, FieldSet__c, ObjectType__c, Order__c,
				SectionDescription__c, WizardConfiguration__c from CCL_WizardStep__mdt where WizardConfiguration__r.DeveloperName=:selectedWizardName and Active__c=true ORDER BY Order__c ASC];
	}

    // Gets Wizard Step Fields information
	@AuraEnabled(Cacheable=true)
	public static List<CCL_WizardStepField__mdt> getFieldsFromStepMetadata(Id selectedWizardStepId) {
		return [select id, MasterLabel, Field_Name__c, Type__c,Order__c,Label  from CCL_WizardStepField__mdt where Wizard_Step__c=:selectedWizardStepId ORDER BY Order__c ASC];
	}

	public class SitesAndLabel{
		@AuraEnabled
		public List<String> labels{get;set;}
		@AuraEnabled
		public List<Account> sites{get;set;}
		public SitesAndLabel(List<String> labels, List<Account> sites){
			this.labels = labels;
			this.sites = sites;
		}
	}

  @AuraEnabled
	public static SitesAndLabel filterSitesByPurpose(String purposeId) {
		//Getting field label
		Map<String, Schema.SObjectField> fieldsMap = Schema.getGlobalDescribe().get('PRF__C').getDescribe().fields.getMap();
		List<String> fieldLabels = new List<String>{
			fieldsMap.get('Site__c').getDescribe().getLabel(),
			fieldsMap.get('Team__c').getDescribe().getLabel(),
			fieldsMap.get('HCP__c').getDescribe().getLabel()
		};
		return new SitesAndLabel(fieldLabels, [
            SELECT Id, Name
              FROM Account
             WHERE Id IN (SELECT Account__c from AccountPurpose__c WHERE Purpose__c =: purposeId) AND RecordType.Name = 'Site' ORDER BY NAME]);
	}

	@AuraEnabled
	public static List<Account> filterTeamsBySite(String siteId) {
		return [
            SELECT Id, Name
              FROM Account
             WHERE parentId=:siteId AND RecordType.Name = 'Team' ORDER BY NAME];
	}

	@AuraEnabled
	public static List<Contact> filterHCPsByTeam(String teamId) {
		return [
            SELECT Id, Name
              FROM Contact
             WHERE Id IN (SELECT Contact__c from TeamMember__c WHERE Account__c =: teamId) ORDER BY NAME];
	}

	@AuraEnabled
	public static Id insertPRFStep1Records(Id purposeId, String wizardName, Id siteId, Id teamId, Id HCPId, Id recordId) {
		System.debug('recordId: '+recordId);

		Savepoint sp = Database.setSavepoint();
		PRF__c PRFRecord = new PRF__c();
		try{
			System.debug('purposeId: '+purposeId);

			PRFRecord.Purpose__c = purposeId;
			PRFRecord.Wizard__c = wizardName;
			PRFRecord.Site__c = siteId;
			PRFRecord.Team__c = teamId;
			PRFRecord.HCP__c = HCPId;

			// Upsert PRF Record
			// In case we are coming back to the screen from clicking Previous button
			if(recordId != null){
				PRFRecord.Id = recordId;
			}
			upsert PRFRecord;

			// caseRecord.Status_Plant_Appointment__c = 'Open';
			// caseRecord.Status_Overall_Treatment__c = 'In Progress';
			// //caseRecord.Patient__c = patient.Id;
			// caseRecord.ADF_Status__c = 'Draft';
			// caseRecord.PRFSubmittedDate__c   = system.now();
			// caseRecord.PRF_Status__c = 'Draft';
			// caseRecord.RecordTypeId = [select id from RecordType where developerName = 'Treatment' limit 1].id;

			// // In case we are coming back to the screen from clicking Previous button
			// if(caseRecordId != null){
			// 	PRFRecord.Id = recordId;
			// }
			// upsert caseRecord;

			// // Delete previously created CaseAccount records
			// List<CaseAccount__c> liOldCaseAccounts = [select id from CaseAccount__c where Case__c =:caseRecord.Id];
			// delete liOldCaseAccounts;

			// // Insert Case Account records
			// CaseAccount__c[] cas = new CaseAccount__c[]{};
			// cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = siteId, Role__c = 'SITE'));
			// cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = teamId, Role__c = 'TEAM'));


			// cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = selectedSiteId, Role__c = 'PLANT'));
			// cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = aphId, Role__c = 'APH'));
			// cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = pickupId, Role__c = 'PICK'));
			// cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = infusionId, Role__c = 'INF'));
			// cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = shipToId, Role__c = 'SHIP'));
			//insert cas;
		}
		catch(Exception e){
			Database.rollback(sp);
			System.debug(Logginglevel.ERROR, e.getMessage());
			throw new AuraEXception(e.getMessage());
		}
		System.debug('PRFRecord.Id: '+PRFRecord.Id);
		return PRFRecord.Id;
	}

	public class LabelsAndApheresis{
		@AuraEnabled
		public List<String> labels{get;set;}
		@AuraEnabled
		public List<Account> apheresis{get;set;}
		public LabelsAndApheresis(List<String> labels, List<Account> apheresis){
			this.labels = labels;
			this.apheresis = apheresis;
		}
	}
	@AuraEnabled
	public static LabelsAndApheresis initApheresisCenters(Id selectedPurposeId, Id selectedSiteId) {
		System.debug('CCL_PRFController:initApheresisCenters:selectedPurposeId: '+selectedPurposeId+' :selectedSiteId: '+selectedSiteId);
		//Getting field label
		Map<String, Schema.SObjectField> fieldsMap = Schema.getGlobalDescribe().get('PRF__C').getDescribe().fields.getMap();
		List<String> fieldLabels = new List<String>{
			fieldsMap.get('ApheresisCenter__c').getDescribe().getLabel(),
			fieldsMap.get('PickupLocation__c').getDescribe().getLabel(),
			fieldsMap.get('InfusionCenter__c').getDescribe().getLabel(),
			fieldsMap.get('ShipToLocation__c').getDescribe().getLabel()
		};
		return new LabelsAndApheresis(fieldLabels, [
            SELECT Id, Name
              FROM Account
             WHERE Id IN (SELECT Account__c from AccountPurpose__c WHERE Purpose__c =: selectedPurposeId)
               AND Id IN (SELECT AccountTo__c from AccountConnection__c WHERE AccountFrom__c =: selectedSiteId)
               AND RecordType.Name = 'Apheresis Center' ORDER BY NAME]);
	}

	@AuraEnabled
	public static List<Account> getPickUpLocations(Id selectedApheresisCenterId) {
		System.debug('CCL_PRFController:filterPickUpLocations:selectedApheresisCenterId: '+selectedApheresisCenterId);
		return [
            SELECT Id, Name
              FROM Account
             WHERE Id IN (SELECT AccountTo__c from AccountConnection__c WHERE AccountFrom__c =: selectedApheresisCenterId AND Type__c = 'Goods Supplier')
          ORDER BY NAME];
	}

	@AuraEnabled
	public static List<Account> getInfusionCenters(Id selectedPurposeId, Id selectedSiteId) {
		System.debug('CCL_PRFController:getInfusionCenters:selectedPurposeId: '+selectedPurposeId+' :selectedSiteId: '+selectedSiteId);
		return [
            SELECT Id, Name
              FROM Account
             WHERE Id IN (SELECT Account__c from AccountPurpose__c WHERE Purpose__c =: selectedPurposeId)
               AND Id IN (SELECT AccountTo__c from AccountConnection__c WHERE AccountFrom__c =: selectedSiteId)
               AND RecordType.Name = 'Infusion Center' ORDER BY NAME];
	}

	@AuraEnabled
	public static List<Account> getShipToLocations(Id selectedInfusionCenterId) {
		System.debug('CCL_PRFController:filterPickUpLocations:selectedInfusionCenterId: '+selectedInfusionCenterId);
		return [
            SELECT Id, Name
              FROM Account
             WHERE Id IN (SELECT AccountTo__c from AccountConnection__c WHERE AccountFrom__c =: selectedInfusionCenterId AND Type__c = 'Ship-To')
          ORDER BY NAME];
	}

	// Update PRF__c record with Logistics information
	// Return: void
	@AuraEnabled
	public static void insertPRFLogisticsRecords(Id recordId, Id apheresisCenterId, Id pickUpLocationId,
												Id infusionCenterId, Id shipToLocationId) {
		System.debug('recordId: '+recordId);
		PRF__c PRFRecord = new PRF__C(Id=recordId);
		PRFRecord.ApheresisCenter__c = apheresisCenterId;
		PRFRecord.PickupLocation__c = pickUpLocationId;
		PRFRecord.InfusionCenter__c = infusionCenterId;
		PRFRecord.ShipToLocation__c = shipToLocationId;
		update PRFRecord;
		return;
	}

	// Call a Flow to creat Case and CaseAccount records
	// Returns: Id of created Case
	@AuraEnabled
	public static Id submitPRF(Id recordId){
		Savepoint sp = Database.setSavepoint();
		Case insertedCase;
		try{
			insertedCase = (Case)new CCL_FlowProcess().named('Create_Case_Record_from_PRF').with('recordId', recordId).returning('CaseToCreate');
			System.debug(insertedCase.id);
		}
		catch(Exception e){
			Database.rollback(sp);
			System.debug(Logginglevel.ERROR, e.getMessage());
			throw new AuraEXception(e.getMessage());
		}
		return insertedCase.id;
	}

	// Insert Cryobags line Item
	// Return: void
	@AuraEnabled
	public static void insertCryobags(List<AppointmentLineItem__c> cryobags){
		System.debug('cryobags input: '+cryobags);
		System.debug('cryobags input Appointment__c: '+cryobags[0].Appointment__c);
		try{
			insert cryobags;
		}
		catch(Exception e){
			System.debug(Logginglevel.ERROR, e.getMessage());
			throw new AuraHandledException(e.getMessage());
		}
	}
}
