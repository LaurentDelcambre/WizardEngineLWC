import { LightningElement, api, track } from 'lwc';
/* Getting the Approval Status */
import getStatus from '@salesforce/apex/CCL_WizardEngineController.getStatus';
/* Business logic to update the status */
import updateStatus from '@salesforce/apex/CCL_WizardEngineController.updateStatus';
/* Business logic to approve the PRF */
//import approvePRF from '@salesforce/apex/CCL_WizardEngineController.approvePRF';
/* Business logic to get list of Approvers */
import getApproverList from '@salesforce/apex/CCL_WizardEngineController.getApproverList';
/* Business logic to get list of Approvers */
import getApproverListADF from '@salesforce/apex/CCL_WizardEngineController.getApproverListADF';
/* Business logic to get the Document URL */
import getCCLDocument from '@salesforce/apex/CCL_WizardEngineController.getCCLDocument';
/* Toast to display error message */
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

/* Labels */
import ccl_wizard_submit                    from '@salesforce/label/c.ccl_wizard_submit';
import ccl_wizard_previous                  from '@salesforce/label/c.ccl_wizard_previous';
import ccl_wizard_approve                    from '@salesforce/label/c.ccl_wizard_approve';
import ccl_wizard_reject                  from '@salesforce/label/c.ccl_wizard_reject';
import ccl_wizard_approvalStatus            from '@salesforce/label/c.ccl_wizard_approvalStatus';
import ccl_wizard_purposeLabel            from '@salesforce/label/c.ccl_wizard_purposeLabel';
import ccl_wizard_prfScheduling            from '@salesforce/label/c.ccl_wizard_prfScheduling';
import ccl_wizard_adfCryobags            from '@salesforce/label/c.ccl_wizard_adfCryobags';
import ccl_wizard_approver            from '@salesforce/label/c.ccl_wizard_approver';

export default class Ccl_wizard_reviewSubmit extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectName = 'PRF__c';
    @api inputRecordStatus;
    @api selectedPurposeId;
    @api selectedWizardName;
    @api selectedSiteId;
    @api selectedTeamId;
    @api selectedHCPId;
    @api selectedApheresisCenterId;
    @api selectedPickUpLocationId;
    @api selectedInfusionCenterId;
    @api selectedShipToLocationId;

    @api listWizardSteps;
    @api cryobags;
    dynamicFieldSetMap;

    @track recordStatus;
    @track listWizardStepsWithGetter;

    selectedApproverId;
    @track availableApprovers;
    @track attachmentId;

    @track errors;
    // Approval Buttons
    get displaySubmitButton(){
        return this.recordStatus === 'Draft';
    }

    get displayApproveRejectButtons(){
        return this.recordStatus === 'Submitted';
    }

    get displayDocumentLink(){
        return this.objectName ==='Appointment__c' && this.recordStatus === 'Approved';
    }

    // Expose the labels to use in the template.
    staticLabels = {
        ccl_wizard_purposeLabel,
        ccl_wizard_approvalStatus,
        ccl_wizard_prfScheduling,
        ccl_wizard_adfCryobags,
        ccl_wizard_submit,
        ccl_wizard_previous,
        ccl_wizard_reject,
        ccl_wizard_approve,
        ccl_wizard_approver
    };

    // Constructor to add a getter for the Boolean value test
    connectedCallback(){
        console.log('Ccl_wizard_reviewSubmit:recordId: '+this.recordId);
        this.listWizardStepsWithGetter = [];
        for(let i=0;i<this.listWizardSteps.length;i++){
            this.listWizardStepsWithGetter.push({
                isPrfStart: this.listWizardSteps[i].Component__c === 'PRF_START',
                isFieldset: this.listWizardSteps[i].Component__c === 'Wizard_Fieldset',
                isPrfLogistics: this.listWizardSteps[i].Component__c === 'PRF_Logistics',
                isAdfCryobags: this.listWizardSteps[i].Component__c === 'ADF_Cryobags',
                isPrfScheduling: this.listWizardSteps[i].Component__c === 'PRF_Scheduling',
                step: this.listWizardSteps[i]
            })
        }

        // We received the Status from the parent Engine component
        console.log(':inputRecordStatus: '+this.inputRecordStatus);
        if(this.inputRecordStatus){
            this.recordStatus = this.inputRecordStatus;
        }
        else{
            // Get the status of the Case
            console.log('before getStatus:recordId: '+this.recordId);
            console.log('before getStatus:objectName: '+this.objectName);
            getStatus({recordId: this.recordId, objectName: this.objectName})
                .then( status => {
                    this.recordStatus = status;
                })
                .catch(error => {
                    console.error(error);
                });

            // Get list of Approvers
            if(this.objectName === 'Case'){
                console.log('before getApproverList:siteId: '+this.selectedSiteId);
                getApproverList({siteId: this.selectedSiteId,teamId:this.selectedTeamId})
                    .then( listUsers => {
                        console.log('return from getApproverList: '+listUsers.length);
                        // Populate the list of available wizards filtered by Purpose__c
                        this.availableApprovers = [];
                        console.log(listUsers);

                        // Loop through the values to structure then for the combobox component
                        for (let i = 0; i < listUsers.length; i++) {
                            this.availableApprovers.push({ label: listUsers[i].Name, value: listUsers[i].Id });
                        }

                        // If only 1 result then pre-select it
                        if (this.availableApprovers.length === 1) {
                            // Set the selected value
                            this.selectedApproverId = this.availableApprovers[0].value;
                        }
                        console.log('this.availableApprovers.length: '+this.availableApprovers.length);
                        //console.log('this.availableApprovers[0]: '+this.availableApprovers[0].label);
                    })
                    .catch(receivedErrors => {
                        console.error(receivedErrors);
                        this.errors = receivedErrors;
                    });
            }
            else{
                getApproverListADF({aphCenterId: this.selectedApheresisCenterId})
                    .then( listUsers => {
                        console.log('return from getApproverList: '+listUsers.length);
                        // Populate the list of available wizards filtered by Purpose__c
                        this.availableApprovers = [];
                        console.log(listUsers);

                        // Loop through the values to structure then for the combobox component
                        for (let i = 0; i < listUsers.length; i++) {
                            this.availableApprovers.push({ label: listUsers[i].Name, value: listUsers[i].Id });
                        }

                        // If only 1 result then pre-select it
                        if (this.availableApprovers.length === 1) {
                            // Set the selected value
                            this.selectedApproverId = this.availableApprovers[0].value;
                        }
                        console.log('this.availableApprovers.length: '+this.availableApprovers.length);
                        //console.log('this.availableApprovers[0]: '+this.availableApprovers[0].label);
                    })
                    .catch(receivedErrors => {
                        console.error(receivedErrors);
                        this.errors = receivedErrors;
                    });
            }
        }
    }

    // Select an Approver
    selectApprover(event){
        if(event){
            this.selectedApproverId = event.detail.value;
            console.log('selected by event: '+event.detail.value);
        }
    }

    submitForApproval(){
        console.log('submitForApproval');
        updateStatus({recordId: this.recordId,
                    approverId:this.selectedApproverId,
                    objectName: this.objectName})
            .then( () => {
                const evt = new ShowToastEvent({
                    title: 'Success',
                    message: 'The Case has been submitted for approval',
                });
                this.dispatchEvent(evt);
            }
            )
            .catch(error => {
                console.error(error);
            });
    }

    // Click on Approve
    approve(){
        console.log('approve');
        const el = this.template.querySelector('[data-field="PRF_Status__c"]');
        if(el){
            el.value = 'Approve';
        }
        const elADF = this.template.querySelector('[data-field="ADF_Status__c"]');
        if(elADF){
            elADF.value = 'Approve';
        }

        const recordForm = this.template.querySelector('[data-field="recordForm"]');
        recordForm.submit();
    }
    // Click on Reject
    reject(){
        console.log('reject');
        const recordForm = this.template.querySelector('[data-field="recordForm"]');
        recordForm.submit();
    }

    success(){
        const evt = new ShowToastEvent({
                        title: 'Success',
                        message: 'The Case has been ' + this.template.querySelector('[data-field="PRF_Status__c"]').value,
                    });
        this.dispatchEvent(evt);
    }

    clickPrevious(){
        // Fire the Next event
        const navigationEvent = new CustomEvent('navigation', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                "navigateOriginComponent" : "SUBMIT",
				"navigateAction" : "Previous"
            }
        });

        // Fire the event
        this.dispatchEvent(navigationEvent);
    }

    navigateToFiles2(){
        getCCLDocument({recordId: this.recordId})
            .then( CCLDocument => {
                this.attachmentUrl = CCLDocument.ViewLink__c;
                console.log('attachmentId: '+this.attachmentId);

                // Open in a new tab
                window.open(this.attachmentUrl, '_blank');
                //window.location = this.attachmentUrl;
            })
            .catch(receivedErrors => {
                console.error(receivedErrors);
                this.errors = receivedErrors;
            });

    }
}
