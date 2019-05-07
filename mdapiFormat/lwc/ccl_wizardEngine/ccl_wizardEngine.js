import { LightningElement, api, track } from 'lwc';
import getStatus from '@salesforce/apex/CCL_WizardEngineController.getStatus';
import getFullConfigPRF from '@salesforce/apex/CCL_WizardEngineController.getFullConfigPRF';
import getFullConfigADF from '@salesforce/apex/CCL_WizardEngineController.getFullConfigADF';
import getFullConfigADFSubmit from '@salesforce/apex/CCL_WizardEngineController.getFullConfigADFSubmit';
import getAppointment from '@salesforce/apex/CCL_WizardEngineController.getAppointment';

/* Label Engine */

/* ADF */
import ccl_engine_ADF_Apheresis_Appointment_Summary from '@salesforce/label/c.ccl_engine_ADF_Apheresis_Appointment_Summary';
import ccl_engine_ADF_Cryobags from '@salesforce/label/c.ccl_engine_ADF_Cryobags';
import ccl_engine_ADF_Final_Step from '@salesforce/label/c.ccl_engine_ADF_Final_Step';
import ccl_engine_ADF_Shipment_Details from '@salesforce/label/c.ccl_engine_ADF_Shipment_Details';
import ccl_engine_ADF_Treatment_Summary from '@salesforce/label/c.ccl_engine_ADF_Treatment_Summary';

import ccl_engine_ADF_Apheresis_Appointment_Summary_section from '@salesforce/label/c.ccl_engine_ADF_Apheresis_Appointment_Summary_section';
import ccl_engine_ADF_Cryobags_section from '@salesforce/label/c.ccl_engine_ADF_Cryobags_section';
import ccl_engine_ADF_Final_Step_section from '@salesforce/label/c.ccl_engine_ADF_Final_Step_section';
import ccl_engine_ADF_Shipment_Details_section from '@salesforce/label/c.ccl_engine_ADF_Shipment_Details_section';
import ccl_engine_ADF_Treatment_Summary_section from '@salesforce/label/c.ccl_engine_ADF_Treatment_Summary_section';

/* PRF */
import ccl_engine_PRF_purpose from '@salesforce/label/c.ccl_engine_PRF_purpose';
import ccl_engine_PRF_purpose_section from '@salesforce/label/c.ccl_engine_PRF_purpose_section';
import ccl_engine_PRF_site from '@salesforce/label/c.ccl_engine_PRF_site';
import ccl_engine_PRF_site_section from '@salesforce/label/c.ccl_engine_PRF_site_section';
import ccl_engine_PRF_patient from '@salesforce/label/c.ccl_engine_PRF_patient';
import ccl_engine_PRF_patient_section from '@salesforce/label/c.ccl_engine_PRF_patient_section';
import ccl_engine_PRF_logistics from '@salesforce/label/c.ccl_engine_PRF_logistics';
import ccl_engine_PRF_logistics_section from '@salesforce/label/c.ccl_engine_PRF_logistics_section';
import ccl_engine_PRF_scheduling from '@salesforce/label/c.ccl_engine_PRF_scheduling';
import ccl_engine_PRF_scheduling_section from '@salesforce/label/c.ccl_engine_PRF_scheduling_section';
import ccl_engine_PRF_submit from '@salesforce/label/c.ccl_engine_PRF_submit';
import ccl_engine_PRF_submit_section from '@salesforce/label/c.ccl_engine_PRF_submit_section';

import ccl_wizard_title from '@salesforce/label/c.ccl_wizard_title';

export default class Ccl_wizardEngine extends LightningElement {
    /* Label Engine */
    computedLabels =
    [
        { labelName: 'ccl_engine_ADF_Apheresis_Appointment_Summary',value: ccl_engine_ADF_Apheresis_Appointment_Summary },
        { labelName: 'ccl_engine_ADF_Apheresis_Appointment_Summary_section',value: ccl_engine_ADF_Apheresis_Appointment_Summary_section },
        { labelName: 'ccl_engine_ADF_Cryobags',value: ccl_engine_ADF_Cryobags },
        { labelName: 'ccl_engine_ADF_Cryobags_section',value: ccl_engine_ADF_Cryobags_section },
        { labelName: 'ccl_engine_ADF_Final_Step',value: ccl_engine_ADF_Final_Step },
        { labelName: 'ccl_engine_ADF_Final_Step_section',value: ccl_engine_ADF_Final_Step_section },
        { labelName: 'ccl_engine_ADF_Shipment_Details',value: ccl_engine_ADF_Shipment_Details },
        { labelName: 'ccl_engine_ADF_Shipment_Details_section',value: ccl_engine_ADF_Shipment_Details_section },
        { labelName: 'ccl_engine_ADF_Treatment_Summary',value: ccl_engine_ADF_Treatment_Summary },
        { labelName: 'ccl_engine_ADF_Treatment_Summary_section',value: ccl_engine_ADF_Treatment_Summary_section },
        { labelName: 'ccl_engine_PRF_purpose',value: ccl_engine_PRF_purpose },
        { labelName: 'ccl_engine_PRF_purpose_section',value: ccl_engine_PRF_purpose_section },
        { labelName: 'ccl_engine_PRF_site',value: ccl_engine_PRF_site },
        { labelName: 'ccl_engine_PRF_site_section',value: ccl_engine_PRF_site_section },
        { labelName: 'ccl_engine_PRF_patient',value: ccl_engine_PRF_patient },
        { labelName: 'ccl_engine_PRF_patient_section',value: ccl_engine_PRF_patient_section },
        { labelName: 'ccl_engine_PRF_logistics',value: ccl_engine_PRF_logistics },
        { labelName: 'ccl_engine_PRF_logistics_section',value: ccl_engine_PRF_logistics_section },
        { labelName: 'ccl_engine_PRF_scheduling',value: ccl_engine_PRF_scheduling },
        { labelName: 'ccl_engine_PRF_scheduling_section',value: ccl_engine_PRF_scheduling_section },
        { labelName: 'ccl_engine_PRF_submit',value: ccl_engine_PRF_submit },
        { labelName: 'ccl_engine_PRF_submit_section',value: ccl_engine_PRF_submit_section },
    ];

    // Utility method to get the translated labels
    getLabelValue = (labelName) =>{
        console.log('getLabelValue('+labelName + '): ');
        let returnLabel = this.computedLabels.find( v => v.labelName === labelName);
        if(!returnLabel){
            returnLabel = 'ERROR: Could not find the label: '+labelName;
            console.error('ERROR: Could not find the label: '+labelName);
        }
        else{
            returnLabel = returnLabel.value;
        }
        console.log('result: '+returnLabel);
        return returnLabel ;
    }

    // Expose the labels to use in the template.
    staticLabels = {
        ccl_wizard_title,
    };

    // Public attributes
    @api selectedRecordId;
    @api labels;
    @api labelValues;
    @api wizardType;

	// Boolean to control display of relevant components
	@track isProgressIndicatorDisplayed     = false;
	@track isPurposeCmpDisplayed            = true;
	@track isSiteCmpDisplayed               = false;
	@track isDynamicFormDisplayed           = false;
	@track isLogisticsDisplayed             = false;
	@track isReviewSubmitDisplayed          = false;
	@track isCryobagsDisplayed              = false;
	@track isSchedulingDisplayed            = false;
    @track isLoading                        = false;

    @track wizardTitle;
    @track sectionDescription;
    @track recordId;
    @track recordStatus;
    @track stepToDisplay;

    // Private non-reactive
    isReviewMode             = false;
    selectedPurposeId;
    selectedWizardName;
    selectedSiteId;
    selectedTeamId;
    selectedHcpId;
    listWizardSteps;
    @api objectName;
    @api prfId;
    @track appointmentId;
    recordTypeId;
    indicatorSteps;
    @track selectedPrfId;
    @track currentStep = 0;
    @track currentStepString = '';

    get engineTitle(){
        return this.staticLabels.ccl_wizard_title + ' : ' + this.wizardType;
    }
    // Constructor
    connectedCallback(){
        this.isLoading = true;
        this.isPurposeCmpDisplayed = false;
        this.sectionDescription = this.getLabelValue('ccl_engine_PRF_purpose_section');

        console.log('connectedCallback:selectedRecordId: '+this.selectedRecordId);
        console.log('connectedCallback:wizardType: '+this.wizardType);
        console.log('connectedCallback:objectName: '+this.objectName);

        /* PRF Initialization*/
        if(this.wizardType === 'PRF_Wizard'){
            if(this.selectedRecordId){

                // Get the status of the Case
                getStatus({recordId: this.selectedRecordId, objectName: this.objectName})
                    .then( status => {
                        console.log('connectedCallback:PRF status: '+status);
                        this.recordStatus = status;

                        /* If PRF_status == 'Approved' then redirect to ADF */
                        if(status === 'Approved'){

                            console.log('connectedCallback:before getAppointment:');
                            // Find the relevant Appointment__c record
                            getAppointment( {recordId: this.selectedRecordId,} )
                                .then( appointmentList => {
                                    console.log('connectedCallback:appointmentList: '+appointmentList);

                                    /* We are not sure yet that there si an Available ADF Appointment__c */
                                    if(appointmentList && appointmentList.length > 0){
                                        this.appointmentId = appointmentList[0].Id;
                                        this.recordId = appointmentList[0].Id;

                                        getFullConfigADFSubmit( {recordId: this.appointmentId} )
                                        .then( fullConfig => {

                                            // Ge the ADF Appointment__c status
                                            this.recordStatus = fullConfig.record.ADF_Status__c;
                                            console.log('getFullConfigADF:ADF_Status__c: '+ this.recordStatus);


                                            console.log('getFullConfigADF:purpose: '+ fullConfig.record.Purpose__c);
                                            this.selectedPurposeId  = fullConfig.record.Purpose__c;
                                            this.selectedSiteId = fullConfig.record.Site__c;
                                            this.selectedTeamId = fullConfig.record.Team__c;
                                            this.selectedHcpId = fullConfig.record.HCP__c;
                                            // Set the Id of Logistics records
                                            this.selectedApheresisCenterId = fullConfig.record.ApheresisCenter__c;
                                            this.selectedPickUpLocationId = fullConfig.record.PickupLocation__c;
                                            this.selectedInfusionCenterId = fullConfig.record.InfusionCenter__c;
                                            this.selectedShipToLocationId = fullConfig.record.ShipToLocation__c;
                                            this.isPurposeCmpDisplayed = true;
                                            this.listWizardSteps    = fullConfig.listWizardSteps;
                                            this.objectName         = 'Appointment__c';
                                            this.wizardType = 'ADF_Wizard';
                                            this.wizardTitle = this.selectedWizardName;

                                            // Prepare the steps
                                            this.indicatorSteps = [];
                                            for (let i=0;i<this.listWizardSteps.length;i++) {
                                                this.indicatorSteps.push({
                                                        "label":this.getLabelValue(this.listWizardSteps[i].Label),
                                                        "value": 'step' + (i+1)
                                                    }
                                                );
                                            }

                                            // Only available for Submitted and Approved
                                            if(this.recordStatus === 'Submitted' || this.recordStatus === 'Approved'){
                                                // 2: Select the Submit and review step (the last one)
                                                this.stepToDisplay = this.listWizardSteps[this.listWizardSteps.length -1];
                                                this.currentStep = this.listWizardSteps.length;
                                                this.currentStepString = 'step' + this.currentStep;

                                                // Manage the display of the components
                                                this.isProgressIndicatorDisplayed   = true;
                                                this.isPurposeCmpDisplayed          = false;
                                                this.isReviewSubmitDisplayed        = true;
                                            }
                                            else{
                                                console.error('Do not click on Draft ADF');
                                            }

                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                    }




                                })

                        }
                        else{
                            // This SELECTS the record for the Engine
                            this.recordId = this.selectedRecordId;

                            // 1: get steps configuration metadata from server-side
                            getFullConfigPRF( {recordId: this.recordId,} )
                                .then( fullConfig => {
                                    console.log('Fullconfig:purpose: '+fullConfig.record.Purpose__c);
                                    this.selectedPurposeId  = fullConfig.record.Purpose__c;
                                    this.selectedWizardName = fullConfig.record.Wizard__c;
                                    this.listWizardSteps    = fullConfig.listWizardSteps;
                                    this.objectName         = 'Case';
                                    this.wizardTitle = this.selectedWizardName;

                                    // Prepare the steps
                                    this.indicatorSteps = [];
                                    for (let i=0;i<this.listWizardSteps.length;i++) {
                                        this.indicatorSteps.push({
                                                "label":this.getLabelValue(this.listWizardSteps[i].Label),
                                                "value": 'step' + (i+1)
                                            }
                                        );
                                    }

                                if(this.recordStatus === 'Submitted' || this.recordStatus === 'Approved'){
                                    // 2: Select the Submit and review step (the last one)
                                    this.stepToDisplay = this.listWizardSteps[this.listWizardSteps.length -1];
                                    this.currentStep = this.listWizardSteps.length;
                                    this.currentStepString = 'step' + this.currentStep;

                                    // Manage the display of the components
                                    this.isProgressIndicatorDisplayed   = true;
                                    this.isPurposeCmpDisplayed          = false;
                                    this.isReviewSubmitDisplayed        = true;
                                }
                            })
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
            else{
                console.log('Show Purpose');
                this.isPurposeCmpDisplayed = true;
            }
        }
        else if(this.wizardType === 'ADF_Wizard'){
            /* Id of the PRF record selected */
            if(this.selectedRecordId){

                //!!!!!!!!!!!!
                this.selectedPrfId = this.prfId;




                // Get the status of the Case
                getStatus({recordId: this.selectedRecordId, objectName: this.objectName})
                    .then( status => {
                        console.log('connectedCallback:status: '+status);
                        console.log('connectedCallback:objectName: '+this.objectName);
                        console.log('connectedCallback:prfId: '+this.prfId);
                        //this.recordStatus = status;

                        if(this.objectName === 'Case'){
                            //this.selectedPrfId = this.recordId;
                            // 1: get steps configuration metadata from server-side
                            getFullConfigADF( {recordId: this.selectedPrfId} )
                                .then( record => {
                                    console.log('getFullConfigADF:purpose: '+ record.Purpose__c);
                                    this.selectedPurposeId  = record.Purpose__c;
                                    this.selectedSiteId = record.Site__c;
                                    this.selectedTeamId = record.Team__c;
                                    this.selectedHcpId = record.HCP__c;
                                    // Set the Id of Logistics records
                                    this.selectedApheresisCenterId = record.ApheresisCenter__c;
                                    this.selectedPickUpLocationId = record.PickupLocation__c;
                                    this.selectedInfusionCenterId = record.InfusionCenter__c;
                                    this.selectedShipToLocationId = record.ShipToLocation__c;
                                    this.isPurposeCmpDisplayed = true;
                                    //this.listWizardSteps    = record.listWizardSteps;
                                    this.objectName         = 'Appointment__c';
                                    this.wizardTitle = this.selectedWizardName;
                                })
                                .catch(error => {
                                    console.error(error);
                                });
                        }
                        else if(status === 'Submitted' || status === 'Approved'){
                            this.recordId = this.selectedRecordId;
                                // 1: get steps configuration metadata from server-side
                                getFullConfigADFSubmit( {recordId: this.selectedRecordId} )
                                .then( fullConfig => {
                                    console.log('getFullConfigADF:purpose: '+ fullConfig.record.Purpose__c);
                                    this.selectedPurposeId  = fullConfig.record.Purpose__c;
                                    this.selectedSiteId = fullConfig.record.Site__c;
                                    this.selectedTeamId = fullConfig.record.Team__c;
                                    this.selectedHcpId = fullConfig.record.HCP__c;
                                    // Set the Id of Logistics records
                                    this.selectedApheresisCenterId = fullConfig.record.ApheresisCenter__c;
                                    this.selectedPickUpLocationId = fullConfig.record.PickupLocation__c;
                                    this.selectedInfusionCenterId = fullConfig.record.InfusionCenter__c;
                                    this.selectedShipToLocationId = fullConfig.record.ShipToLocation__c;
                                    this.isPurposeCmpDisplayed = true;
                                    this.listWizardSteps    = fullConfig.listWizardSteps;
                                    this.objectName         = 'Appointment__c';
                                    this.wizardTitle = this.selectedWizardName;

                                    // Prepare the steps
                                    this.indicatorSteps = [];
                                    for (let i=0;i<this.listWizardSteps.length;i++) {
                                        this.indicatorSteps.push({
                                                "label":this.getLabelValue(this.listWizardSteps[i].Label),
                                                "value": 'step' + (i+1)
                                            }
                                        );
                                    }

                                    // 2: Select the Submit and review step (the last one)
                                    this.stepToDisplay = this.listWizardSteps[this.listWizardSteps.length -1];
                                    this.currentStepString = 'step' + this.currentStep;

                                    // Manage the display of the components
                                    this.isProgressIndicatorDisplayed   = true;
                                    this.isPurposeCmpDisplayed          = false;
                                    this.isReviewSubmitDisplayed        = true;

                                })
                                .catch(error => {
                                    console.error(error);
                                });
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
        else{
            console.error('Cannot find configuration for wizard type: '+this.wizardType);
        }

        this.isLoading = false;
    }

    handleNavigationEvent(event){
		// Display Spinner
        this.isLoading = true;
        //this.isDynamicFormDisplayed = false;

        // Get navigatioj information from the Event
		let navigateAction =            event.detail.navigateAction;
        let navigateOriginComponent =   event.detail.navigateOriginComponent;
        console.log('navigateAction: '+navigateAction);
        console.log('navigateOriginComponent: '+navigateOriginComponent);

        // created Record Id
        if(!this.recordId){
            this.recordId = event.detail.recordId;
        }

        switch (navigateOriginComponent){
			case "Purpose_Selector":
				console.log("Event:navigateAction:Purpose_Selector:Next");

				// Selected records:
				this.selectedPurposeId  = event.detail.selectedPurposeId;
				this.selectedWizardName = event.detail.selectedWizardName;
                this.listWizardSteps    = event.detail.listWizardSteps;
                this.objectName         = event.detail.objectName;
                this.recordTypeId         = event.detail.recordTypeId;
				console.log("this.objectName: "+this.objectName);
				console.log("this.recordTypeId: "+this.recordTypeId);
                this.wizardTitle = this.selectedWizardName;

				console.log("this.selectedPurposeId: "+this.selectedPurposeId);
				console.log("this.selectedWizardName: "+this.selectedWizardName);
				console.log(this.listWizardSteps);

                // Prepare the steps
                this.indicatorSteps = [];
                for (let i=0;i<this.listWizardSteps.length;i++) {
                    this.indicatorSteps.push({
                            "label":this.getLabelValue(this.listWizardSteps[i].Label),
                            "value": 'step' + (i+1)
                        }
                    );
                }

                console.log('Number of steps on StepIndicator: '+this.indicatorSteps.length);
                console.log('StepIndicator 1st value: '+this.indicatorSteps[0].value);
                console.log('StepIndicator 2nd value: '+this.indicatorSteps[1].value);


                break;
            case "PRF_START":
				if(navigateAction === "Next"){
					console.log("Event:navigateAction:PRF_START:Next");
					// Selected records:
					this.selectedSiteId = event.detail.selectedSiteId;
					this.selectedTeamId = event.detail.selectedTeamId;
					this.selectedHCPId = event.detail.selectedHCPId;
                    console.log('site id selected in SiteTemHcp component from Event: '+this.selectedSiteId);
				}
				break;
            case "Wizard_FieldSet":
				console.log("Event:navigateAction:Wizard_FieldSet");

                // Set the recordId received from recordEditform
                this.recordId = event.detail.recordId;
                console.log('this.recordId: '+this.recordId);

				console.log("Event:navigateAction:Wizard_FieldSet END");
                break;
            case "PRF_Logistics":
				if(navigateAction === "Next"){
					console.log("Event:navigateAction:PRF_Logistics:Next");

					// Set the Id of the newly created records
					this.selectedApheresisCenterId = event.detail.selectedApheresisCenterId;
					this.selectedPickUpLocationId = event.detail.selectedPickUpLocationId;
					this.selectedInfusionCenterId = event.detail.selectedInfusionCenterId;
					this.selectedShipToLocationId = event.detail.selectedShipToLocationId;
				}
				break;
            case "ADF_Cryobags":
				if(navigateAction === "Next"){
					console.log("Event:navigateAction:ADF_Cryobags:Next");

					// Set the cryobags
                    this.cryobags = event.detail.cryobags;
                    console.log('cryoabgs: ');
                    console.log(event.detail.cryobags.length);
                    console.log('DIN_Apheresis_ID__c: '+event.detail.cryobags[0].DIN_Apheresis_ID__c);
                    console.log('this.recordId: '+this.recordId);

				}
				break;
            default:
                console.error('Cannot find a matching component for: '+navigateOriginComponent);
        }

        // Managing the current and next step
		switch(navigateAction){
			case "Previous":
				this.currentStep--;
				break;
			case "Next":
                this.currentStep++;
                break;
            default:
                console.error('Cannot find a matching navigateAction for: '+navigateAction);
        }
        // Convert to String for stepIndicator
        this.currentStepString = 'step' + this.currentStep;
		console.log('Next step to display: Index: '+ this.currentStep);
		console.log('Next step to pass to stepIndicator: currentStepString: '+ this.currentStepString);


		if(this.currentStep === 0){
			this.isProgressIndicatorDisplayed = false;
			this.isPurposeCmpDisplayed = true;
			this.isSiteCmpDisplayed = false;
		}
		else{
			// step 0 is PurposeSelector
			this.stepToDisplay = this.listWizardSteps[this.currentStep-1];
			console.log('Next step to display: Component:'+this.stepToDisplay.Component__c);
			console.log('Next step to display: Id:'+this.stepToDisplay.Id);

			// Set the Section Descripion text container
			//console.log('Next step to display: SectionDescription__c:'+ this.stepToDisplay.SectionDescription__c + 'result: '+$A.getReference("$Label.c."+this.stepToDisplay.SectionDescription__c));


            // TODO: get translated Section
            //this.sectionDescription = $A.getReference("$Label.c."+this.stepToDisplay.SectionDescription__c);
            this.sectionDescription = this.getLabelValue(this.stepToDisplay.SectionDescription__c);
            console.log('sectionDescription: '+this.sectionDescription);
			this.isProgressIndicatorDisplayed = true;
			this.isPurposeCmpDisplayed = false;

			// Render the relevant component
			this.isSiteCmpDisplayed = false;
			this.isDynamicFormDisplayed = false;
			this.isLogisticsDisplayed = false;
			this.isReviewSubmitDisplayed = false;
            this.isCryobagsDisplayed = false;
            this.isSchedulingDisplayed = false;


			if(this.stepToDisplay.Component__c === "PRF_START"){
                console.log('site id from Parent controller: '+this.selectedSiteId);
				this.isSiteCmpDisplayed = true;
			}
			else if(this.stepToDisplay.Component__c === "Wizard_Fieldset"){
				console.log("step = Wizard_FieldSet");
				console.log("fieldset: "+this.stepToDisplay.FieldSet__c);
                console.log('recordId before dynamic FieldSet: '+this.recordId);
                console.log('stepToDisplay.ObjectType__c: '+this.stepToDisplay.ObjectType__c);
                this.isDynamicFormDisplayed = true;
                const formCpt = this.template.querySelector('[data-name="dynamic"]');
                // the player might not be in the DOM just yet
                if (formCpt) {
                    formCpt.init();
                }

			}
			else if(this.stepToDisplay.Component__c === "PRF_Logistics"){
				this.isLogisticsDisplayed = true;
			}
			else if(this.stepToDisplay.Component__c === "ADF_Cryobags"){
				this.isCryobagsDisplayed = true;
            }
            else if(this.stepToDisplay.Component__c === "PRF_Scheduling"){
				this.isSchedulingDisplayed = true;
			}
			else if(this.stepToDisplay.Component__c === "PRF_END"){

				this.isReviewSubmitDisplayed = true;
			}
        }

        // Set the Progress Indicator's current step
        // AFTER we initialize the StepIndicator component
        // if(this.template.querySelector('c-ccl_wizard_progress-indicator')){
        //     this.template.querySelector('c-ccl_wizard_progress-indicator').currentStep = this.currentStep;
        // }
        // else{
        //     console.error('could not find c-ccl_wizard_progress-indicator');
        // }

		// Display Spinner
        this.isLoading = false;
    }
}
