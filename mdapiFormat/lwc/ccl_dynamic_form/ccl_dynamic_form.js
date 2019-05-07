import { LightningElement, api, track } from 'lwc';
import getFieldsFromStepMetadata from '@salesforce/apex/CCL_WizardEngineController.getFieldsFromStepMetadata';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

/* Labels */
import ccl_wizard_next                  from '@salesforce/label/c.ccl_wizard_next';
import ccl_wizard_previous              from '@salesforce/label/c.ccl_wizard_previous';
import initApheresisCenters from '@salesforce/apex/CCL_PRFController.initApheresisCenters';

export default class ccl_dynamic_form extends LightningElement {

    @api objectName;
    @api recordId;
    @api recordTypeId;
    @api reviewMode = false;
    @api selectedPrfId;
    @api selectedPurposeId;
	@api selectedWizardName;
    @api selectedSiteId;
    @api selectedTeamId;
    @api selectedHcpId;
    @api selectedApheresisCenterId;
    @api selectedPickupLocationId;
    @api selectedInfusionCenterId;
    @api selectedShiptoLocationId;

    // Logging
    @track logtext = 'Logs: ';
    // Loading Spinner
    @track isLoading = true;
    // Lits fo fields to display
    @track listCustomFields =[];

    // Expose the labels to use in the template.
    staticLabels = {
        ccl_wizard_next,
        ccl_wizard_previous
    };

    // Validation
    @track isInvalid = true;

    connectedCallback(){
       this.init();
    }

    renderedCallback(){
       // this.init();
    }

    @api
    get selectedWizardStepId(){
        return this._selectedWizardStepId;
    }

    set selectedWizardStepId(value){
        this._selectedWizardStepId = value;
        this.init();
    }

    @api
    init(){
        console.log('INIT DYNAMIC FORM');
        if(!this.objectName){
            console.error('Please pass an Object name to the dynamic form component');
        }
        console.log('selectedPrfId: ' + this.selectedPrfId);
        console.log('selectedWizardStepId: '+this.selectedWizardStepId);
        getFieldsFromStepMetadata({selectedWizardStepId: this.selectedWizardStepId})
            .then(data => {
                console.log('return from getFieldsFromStepMetadata: ');
                //console.log(data.length);
                this.listCustomFields = [];
                for(let i = 0; i < data.length; i += 1){
                    //console.log(data[i]);
                    //console.log('required: '+data[i].Required__c);
                    //console.log('required: '+data[i].Required__c === 'True');
                    this.listCustomFields.push(
                        {idStandard: 'id'+i,
                        idCustom: 'key'+i,
                        originalField: data[i].Field_Name__c,
                        customField: undefined,
                        hasCustomField: (data[i].Type__c === 'Date of birth'),
                        isSection:(data[i].Type__c === 'Section'),
                        label:data[i].Label,
                        isRequired:data[i].Required__c}
                    );

                    //this.logtext = this.logtext + ' | FieldName: '+data[i].Field_Name__c + ' | Type__c: '+ data[i].Type__c + ' | hasCustomField: '+ (data[i].Type__c === 'Date of birth');
                    console.log( 'FieldName: '+data[i].Field_Name__c + ' | Type__c: '+ data[i].Type__c + ' | hasCustomField: '+ (data[i].Type__c === 'Date of birth') );
                }

                // Hides the Spinner
                this.isLoading = false;
                console.log('ccl_dynamic_form:init:this.listCustomFields.lenght: '+this.listCustomFields,length);
                console.log('{recordId}: '+this.recordId);
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Check validity
    checkValidity(){
        console.log('TODO: check validity');
        return true;
        // console.log('length: '+this.template.querySelectorAll('lightning-input-field').length);
        // this.isInvalid = ![...this.template.querySelectorAll('lightning-input-field')]
        //     .reduce((validSoFar, inputCmp) => {
        //         return validSoFar && inputCmp.checkValidity();
        //     }, true);
        // console.log('this.isInvalid: '+this.isInvalid);
    }

    // Called when the clicking Submit. Move the input data from the custom component to the standard field
    handleSubmit(event){
        console.log('event standard field: '+event.target.dataset);
    }

    // Called when the RecordEditForms creates/updated the record with success
    // Generate a Next event for the Engine to capture
    handleSuccess(event){
        const payload = event.detail;
        const returnedRecordId = payload.id;
        console.log('Id of record created: '+returnedRecordId);

        // Prepare Next event
        const navigationEvent = new CustomEvent('navigation', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {"navigateOriginComponent" : "Wizard_FieldSet",
                    "navigateAction" : "Next",
                    "recordId"       : returnedRecordId
            }
        });

        // Fire the event
        this.dispatchEvent(navigationEvent);
    }

    handleModified(event){
        console.log('id standard field: '+event.target.dataset.standard);
        console.log('Parent received value from child '+ event.detail.value);

        // Finding the standard field with its Id
        let indexTxt = '[data-standard="' + event.target.dataset.standard +'"]';
        console.log('selector: '+indexTxt );

        if(this.template.querySelector(indexTxt)){
            const inputName = this.template.querySelector(indexTxt);
            inputName.value = event.detail.value;
            console.log('updated field value: '+inputName.value)
        }
        else{
            console.error('cannot find the input with name: '+event.target.dataset.standard);
        }

    }
    // Fire Previous event
    clickPrevious(){
        const navigationEvent = new CustomEvent('navigation', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {"navigateOriginComponent" : "Wizard_FieldSet",
            "navigateAction" : "Previous"}
        });

        // Fire the event
        this.dispatchEvent(navigationEvent);
    }

    /** Displays an error. */
    showError({ title, message }) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
        });
        this.dispatchEvent(event);
    }
}
