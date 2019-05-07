public with sharing class CCL_WizardEngineController {

    // JSon structure returned
    public class PurposesAndLabel{
		@AuraEnabled
		public String purposeLabel{get;set;}
		@AuraEnabled
		public List<Purpose__c> purposes{get;set;}
		public PurposesAndLabel(String label, List<Purpose__c> purposes){
			this.purposeLabel = label;
			this.purposes = purposes;
		}
	}

    // return Purpose label + list of available Purpose__c
    @AuraEnabled(Cacheable=true)
	public static PurposesAndLabel initPurposes() {
		//Getting field label
		Map<String, Schema.SObjectField> fieldsMap = Schema.getGlobalDescribe().get('PRF__C').getDescribe().fields.getMap();
		return new PurposesAndLabel(fieldsMap.get('Purpose__c').getDescribe().getLabel(), [SELECT Id, Name FROM Purpose__c ORDER BY Name]);
	}

    // Filter available Wizards by select Purpose__c
    @AuraEnabled(Cacheable=true)
	public static List<String> filterWizardsByPurpose(String purposeId, String type) {
		// Returns a list of the name of Wizards associated to that Purpose
		List<String> liWizardNames = new List<String>();
		for(PurposeTemplate__c pt: [SELECT Id, Name, Purpose__c, Type__c
              FROM PurposeTemplate__c WHERE Purpose__c =: purposeId and Type__c=:type]){
			liWizardNames.add(pt.Name);
		}
		return liWizardNames;
	}

    public class ObjectnameAndSteps{
		@AuraEnabled
		public String objectName{get;set;}
		@AuraEnabled
		public String recordTypeId{get;set;}
		@AuraEnabled
		public List<CCL_WizardStep__mdt> steps{get;set;}
        public ObjectnameAndSteps(String objectName, String recordTypeId, List<CCL_WizardStep__mdt> steps){
            this.objectName = objectName;
            this.recordTypeId = recordTypeId;
            this.steps = steps;
        }

    }
    // Gets Wizard Steps information
	@AuraEnabled(Cacheable=true)
	public static ObjectnameAndSteps getStepsFromMetadata(String selectedWizardName) {
        CCL_Wizard_Configuration__mdt mdt = [select Object_Name__c,Record_Type_Id__c from CCL_Wizard_Configuration__mdt where DeveloperName=:selectedWizardName limit 1];

		return new ObjectnameAndSteps(
            mdt.Object_Name__c,
            mdt.Record_Type_Id__c,
            [select id, Label, Component__C, FieldSet__c, ObjectType__c, Field_name__c, Order__c,
				SectionDescription__c, WizardConfiguration__c from CCL_WizardStep__mdt where WizardConfiguration__r.DeveloperName=:selectedWizardName and Active__c=true ORDER BY Order__c ASC]
        );
	}

    // Gets Wizard Step Fields information
	@AuraEnabled(Cacheable=true)
	public static List<CCL_WizardStepField__mdt> getFieldsFromStepMetadata(Id selectedWizardStepId) {
		return [select id, MasterLabel, Field_Name__c, Type__c,Order__c,Label,Required__c  from CCL_WizardStepField__mdt where Wizard_Step__c=:selectedWizardStepId ORDER BY Order__c ASC];
	}

    // JSON structure for Sites and Labels
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

    // Filter Available Sites by selected Purpose__c
    // + return labels for combobox
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

    // Filter available Teams by selected Site
	@AuraEnabled
	public static List<Account> filterTeamsBySite(String siteId) {
		return [
            SELECT Id, Name
              FROM Account
             WHERE parentId=:siteId AND RecordType.Name = 'Team' ORDER BY NAME];
	}

    // Filter available Hcps by either Site or Team
	@AuraEnabled
	public static List<Contact> filterHCPsByTeamOrSite(String teamId) {
		return [
            SELECT Id, Name
              FROM Contact
             WHERE Id IN (SELECT Contact__c from TeamMember__c WHERE Account__c =: teamId) ORDER BY NAME];
	}

    // Insert record after selecting Site, Team and Hcp
    @AuraEnabled
	public static Id insertPRFSiteTeamHcp(Id purposeId, String wizardName, Id siteId, Id teamId, Id HCPId, Id recordId) {
		System.debug('insertPRFSiteTeamHcp:recordId: '+recordId);
		System.debug('insertPRFSiteTeamHcp:HCPId: '+HCPId);

		Savepoint sp = Database.setSavepoint();
        Case caseRecord = new Case();
		try{
			System.debug('purposeId: '+purposeId);

		    // PRF__c PRFRecord = new PRF__c();
			// PRFRecord.Purpose__c = purposeId;
			// PRFRecord.Wizard__c = wizardName;
			// PRFRecord.Site__c = siteId;
			// PRFRecord.Team__c = teamId;
			// PRFRecord.HCP__c = HCPId;

			// // Upsert PRF Record
			// // In case we are coming back to the screen from clicking Previous button
			// if(recordId != null){
			// 	PRFRecord.Id = recordId;
			// }
			// upsert PRFRecord;

            caseRecord.Purpose__c   = purposeId;
			caseRecord.Wizard__c    = wizardName;
			caseRecord.Site__c      = siteId;
			caseRecord.Team__c      = teamId;
			caseRecord.HCP__c       = HCPId;
			caseRecord.Status_Plant_Appointment__c = 'Open';
			caseRecord.Status_Overall_Treatment__c = 'In Progress';
			//caseRecord.Patient__c = patient.Id;
			//caseRecord.ADF_Status__c = 'Draft';

			caseRecord.PRF_Status__c = 'Draft';
			caseRecord.RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Treatment').getRecordTypeId();

			// In case we are coming back to the screen from clicking Previous button
			if(recordId != null){
				caseRecord.Id = recordId;
			}
			upsert caseRecord;
		}
		catch(Exception e){
			Database.rollback(sp);
			System.debug(Logginglevel.ERROR, e.getMessage());
			throw new AuraHandledException(e.getMessage());
		}
		System.debug('caseRecord.Id: '+caseRecord.Id);
		return caseRecord.Id;
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

    // Return available Apheresis centers and Infusion centers
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

    // Return available Pickup locations
    @AuraEnabled
	public static List<Account> getPickUpLocations(Id selectedApheresisCenterId) {
		System.debug('CCL_PRFController:filterPickUpLocations:selectedApheresisCenterId: '+selectedApheresisCenterId);
		return [
            SELECT Id, Name
              FROM Account
             WHERE Id IN (SELECT AccountTo__c from AccountConnection__c WHERE AccountFrom__c =: selectedApheresisCenterId AND Type__c = 'Goods Supplier')
          ORDER BY NAME];
	}

    // Return available Infusion centers
	@AuraEnabled
	public static List<Account> initInfusionCenters(Id selectedPurposeId, Id selectedSiteId) {
		System.debug('CCL_PRFController:getInfusionCenters:selectedPurposeId: '+selectedPurposeId+' :selectedSiteId: '+selectedSiteId);
		return [
            SELECT Id, Name
              FROM Account
             WHERE Id IN (SELECT Account__c from AccountPurpose__c WHERE Purpose__c =: selectedPurposeId)
               AND Id IN (SELECT AccountTo__c from AccountConnection__c WHERE AccountFrom__c =: selectedSiteId)
               AND RecordType.Name = 'Infusion Center' ORDER BY NAME];
	}

    // Return available shipto locations
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
		//PRF__c PRFRecord = new PRF__C(Id=recordId);
        Case PRFRecord = new Case(Id=recordId);
		PRFRecord.ApheresisCenter__c = apheresisCenterId;
		PRFRecord.PickupLocation__c = pickUpLocationId;
		PRFRecord.InfusionCenter__c = infusionCenterId;
		PRFRecord.ShipToLocation__c = shipToLocationId;
		update PRFRecord;

        // Delete previously created CaseAccount records
        // List<CaseAccount__c> liOldCaseAccounts = [select id from CaseAccount__c where Case__c =:caseRecord.Id and Roles0];
        // delete liOldCaseAccounts;

        // // Insert Case Account records
        // CaseAccount__c[] cas = new CaseAccount__c[]{};
        // cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = siteId, Role__c = 'SITE'));
        // cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = teamId, Role__c = 'TEAM'));


        // cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = siteId, Role__c = 'PLANT'));
        // cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = aphId, Role__c = 'APH'));
        // cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = pickupId, Role__c = 'PICK'));
        // cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = infusionId, Role__c = 'INF'));
        // cas.add(new CaseAccount__c(Case__c = caseRecord.Id, Account__c = shipToId, Role__c = 'SHIP'));
        // insert cas;
		return;
	}

    // Insert Cryobags line Item
	// Return: void
	@AuraEnabled
	public static void insertCryobags(List<AppointmentLineItem__c> cryobags, String selectedPurposeId){
		System.debug('cryobags input: '+cryobags);
		System.debug('cryobags input Appointment__c: '+cryobags[0].Appointment__c);
		try{
            String materialAPH = [select id, Material__c from MaterialPurpose__c WHERE Purpose__c=:selectedPurposeId and Material__r.Type__c ='APH' limit 1].Material__c;
            for(AppointmentLineItem__c cryobag: cryobags){
                cryobag.Material__c = materialAPH;
            }
			insert cryobags;
		}
		catch(Exception e){
			System.debug(Logginglevel.ERROR, e.getMessage());
			throw new AuraHandledException(e.getMessage());
		}
	}

    // Get a field valued dynamically
    @AuraEnabled
    public static Date getDateValue(String recordId, String objectName, String fieldName){
        sObject s = Database.query('select ' + fieldName + ' from ' + objectName + ' where id=\'' + recordId + '\' ');
        System.debug(s.get(fieldName));
        return (Date)s.get(fieldName);
    }

    // Update the selectedDate
    @AuraEnabled
    public static void updateSelectedDate(String recordId, String selectedDate){
        System.debug('updateSelectedDate:selectedDate: '+selectedDate);
        try{
			Case PRFRecord = new Case(Id=recordId);
            PRFRecord.Estimated_Leukapheresis_Shipment_Date__c = Date.parse(selectedDate);
            update PRFRecord;
		}
		catch(Exception e){
			System.debug(Logginglevel.ERROR, e.getMessage());
			throw new AuraHandledException(e.getMessage());
		}
    }

    // Update the status to Submit
    @AuraEnabled
    public static void updateStatus(String recordId, String approverId, String objectName){
        System.debug('updateStatus:recordId: '+recordId);
        System.debug('updateStatus:approverId: '+approverId);
        System.debug('updateStatus:objectName : '+objectName);
        try{
            if(objectName == 'Case'){
                Case PRFRecord = new Case(Id=recordId);
                PRFRecord.Approver__c = approverId;
                PRFRecord.PRF_Status__c = 'Submit';
                PRFRecord.PRFSubmittedDate__c   = system.now();
                update PRFRecord;
            }
            else{
                Appointment__c ADFRecord = new Appointment__c(Id=recordId);
                ADFRecord.Approver__c = approverId;
                ADFRecord.ADF_Status__c = 'Submit';
                ADFRecord.ADFSubmittedDate__c   = system.now();
                update ADFRecord;

            }
		}
		catch(Exception e){
			System.debug(Logginglevel.ERROR, e.getMessage());
			throw new AuraHandledException(e.getMessage());
		}
    }

    // Approve: set status to Approved
    @AuraEnabled
    public static void approveRecord(String recordId, String objectName){
        System.debug('approveRecord: recordId: '+recordId);
        System.debug('approveRecord: objectName: '+objectName);
        try{
            if(objectName == 'Case'){
                Case PRFRecord = new Case(Id=recordId);
                PRFRecord.PRF_Status__c = 'Approve';
                update PRFRecord;
            }
            else{
                Appointment__c ADFRecord = new Appointment__c(Id=recordId);
                ADFRecord.ADF_Status__c = 'Approve';
                update ADFRecord;
            }
		}
		catch(Exception e){
			System.debug(Logginglevel.ERROR, e.getMessage());
			throw new AuraHandledException(e.getMessage());
		}
    }

    // Get the status
    @AuraEnabled
    public static String getStatus(String recordId, String objectName){
        System.debug('getStatus: recordId:'+recordId);
        System.debug('getStatus: objectName:'+objectName);
        String status;
        try{
            if(objectName == 'Case'){
                status = [select PRF_Status__c from Case where id=:recordId].PRF_Status__c;
            }
            else{
                status = [select ADF_Status__c from Appointment__c where id=:recordId].ADF_Status__c;
            }
		}
		catch(Exception e){
			System.debug(Logginglevel.ERROR, e.getMessage());
			throw new AuraHandledException(e.getMessage());
		}
        System.debug('getStatus: status:'+status);
        return status;
    }

    public class FullConfig{
		@AuraEnabled
		public Case record{get;set;}
		@AuraEnabled
		public List<CCL_WizardStep__mdt> listWizardSteps{get;set;}
		public FullConfig(Case record, List<CCL_WizardStep__mdt> listWizardSteps){
			this.record = record;
			this.listWizardSteps = listWizardSteps;
		}
	}

    // Get the full config information data from Server-side for a specific record
    @AuraEnabled(Cacheable=true)
    public static FullConfig getFullConfigPRF(String recordId){
        System.debug('getFullConfigPRF: recordId:'+recordId);
        Case record = [select Wizard__c, Purpose__c from Case where id=:recordId];

        return new FullConfig(
            record,
            [select id, Label, Component__C, FieldSet__c, ObjectType__c, Field_name__c, Order__c,
				SectionDescription__c, WizardConfiguration__c from CCL_WizardStep__mdt where WizardConfiguration__r.DeveloperName=:record.Wizard__c and Active__c=true ORDER BY Order__c ASC]
        );
    }

    // Get the full config information data from Server-side for a specific record
    @AuraEnabled(Cacheable=true)
    public static List<String> getLabelList(){
        List<String> liLabels = new List<String>();
        for(CCL_WizardStep__mdt step: [select Label, SectionDescription__c from CCL_WizardStep__mdt]){
            liLabels.add(step.SectionDescription__c);
        }
        return liLabels;
    }

    // Get the list of potential Approver
    @AuraEnabled(Cacheable=true)
    public static List<User> getApproverList(Id siteId, Id teamId){
        System.debug('getApproverList:siteId: '+siteId);
        System.debug('getApproverList:teamId: '+teamId);
        List<User> liUsers = new List<User>();
        Set<Id> setContactIds = new Set<Id>();

        // Find TeamMembers
        for(Contact cont: [SELECT Id, Name
                FROM Contact
                WHERE Id IN (SELECT Contact__c from TeamMember__c WHERE Account__c=:siteId OR Account__c =: teamId) ORDER BY NAME]){
            setContactIds.add(cont.Id);
        }

        // Find Users
        liUsers = [SELECT Id, Name FROM User WHERE Contact.Id in:setContactIds];
        System.debug('getApproverList: '+liUsers);
        return liUsers;
    }

    // Get the list of potential Approver for ADF
    @AuraEnabled(Cacheable=true)
    public static List<User> getApproverListADF(Id aphCenterId){
        System.debug('getApproverList:aphCenterId: '+aphCenterId);
        List<User> liUsers = new List<User>();
        Set<Id> setContactIds = new Set<Id>();

        // Find TeamMembers
        for(Contact cont: [SELECT Id, Name
                FROM Contact
                WHERE Id IN (SELECT Contact__c from TeamMember__c WHERE IsApprover__c = true
                            AND IsCellProcessing__c = true AND Account__c=:aphCenterId)
                            ORDER BY NAME]){
            setContactIds.add(cont.Id);
        }

        // Find Users
        liUsers = [SELECT Id, Name FROM User WHERE Contact.Id in:setContactIds];
        System.debug('getApproverList: '+liUsers);
        return liUsers;
    }


    // Get the full config information data from Server-side for a specific record
    @AuraEnabled(Cacheable=true)
    public static Case getFullConfigADF(String recordId){
        System.debug('getFullConfigADF: recordId:'+recordId);
        Case record = [select Wizard__c, Purpose__c,Site__c, Team__c, HCP__c,ApheresisCenter__c,PickupLocation__c,InfusionCenter__c, ShipToLocation__c from Case where id=:recordId];
        System.debug('getFullConfigADF: purpose:'+record.Purpose__c);
        return record;
    }

    public class FullConfigADF{
		@AuraEnabled
		public Appointment__c record{get;set;}
		@AuraEnabled
		public List<CCL_WizardStep__mdt> listWizardSteps{get;set;}
		public FullConfigADF(Appointment__c record, List<CCL_WizardStep__mdt> listWizardSteps){
			this.record = record;
			this.listWizardSteps = listWizardSteps;
		}
	}

    // Get the full config information data from Server-side for a specific record
    @AuraEnabled(Cacheable=true)
    public static FullConfigADF getFullConfigADFSubmit(String recordId){
        System.debug('getFullConfigADFSubmit: recordId:'+recordId);
        Appointment__c record = [select ADF_Status__c, Wizard__c, Purpose__c,Site__c, Team__c, HCP__c,Apheresis_Center__c,Pickup_Location__c,Infusion_Center__c, ShipToLocation__c from Appointment__c where id=:recordId];

        return new FullConfigADF(
            record,
            [select id, Label, Component__C, FieldSet__c, ObjectType__c, Field_name__c, Order__c,
				SectionDescription__c, WizardConfiguration__c from CCL_WizardStep__mdt where WizardConfiguration__r.DeveloperName=:record.Wizard__c and Active__c=true ORDER BY Order__c ASC]
        );
    }

    // Get the full config information data from Server-side for a specific record
    @AuraEnabled(Cacheable=true)
    public static CCLDocument__c getCCLDocument(String recordId){
        System.debug('getDocumentId: recordId:'+recordId);
        Id appointmetnLineItemId = [select Id from AppointmentLineItem__c where Appointment__c=:recordId limit 1].Id;

        return [SELECT Id, AttachmentId__c, ViewLink__c from CCLDocument__c where AppointmentLineItem__c=:appointmetnLineItemId limit 1];
    }

    // Get the Apointment__c id from PRF Case
    @AuraEnabled(Cacheable=false)
    public static List<Appointment__c> getAppointment(String recordId){
        System.debug('getAppointmentId: recordId:'+recordId);
        return [SELECT Id from Appointment__c WHERE Case__c =: recordId /*AND RecordType.DeveloperName = 'Apheresis'*/];
    }

}
