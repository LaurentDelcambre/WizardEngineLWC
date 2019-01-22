import { LightningElement, api, track, wire } from 'lwc';
import getFieldsFromStepMetadata from '@salesforce/apex/CCL_PRFController.getFieldsFromStepMetadata';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class ccl_dynamic_form extends LightningElement {

    @api sObjectName;
    @api selectedWizardStepId;
    @api recordId;
    @api recordTypeId;
    @api reviewMode = false;

    // Logging
    @track logtext = 'Logs: ';
    // Loading Spinner
    @track isLoading = true;
    // Lits fo fields to display
    @track listCustomFields =[];

    // List of Config for fields to display
    @wire(getFieldsFromStepMetadata, {selectedWizardStepId: '$selectedWizardStepId'})
    wiredFields({ error, data }){
        if (error) {
            this.logtext =  this.logtext + 'Error Loading Order'+ error.message ;

        } else if (data) {

            this.logtext = this.logtext + ' | '+  data;

            for(let i = 0; i < data.length; i += 1){
                this.listCustomFields.push(
                    {idStandard: 'id'+i, idCustom: 'key'+i, originalField: data[i].Field_Name__c,    customField: undefined,  hasCustomField: (data[i].Type__c === 'Color Picker'), isSection:(data[i].Type__c === 'Section'), label:data[i].Label}
                );

                this.logtext = this.logtext + ' | FieldName: '+data[i].Field_Name__c + ' | Type__c: '+ data[i].Type__c + ' | hasCustomField: '+ (data[i].Type__c === 'Color Picker');
            }

            // Hides the Spinner
            this.isLoading = false;
        }
    }

    // connectedCallback(){

    //     // Call Apex method to get list of fields

    //     this.listCustomFields = [
    //         {idStandard: "id1", idCustom: "key1", originalField: 'Name',    customField: undefined,                 hasCustomField: false},
    //         {idStandard: "id2", idCustom: "key2", originalField: 'Website', customField: this.websiteFieldCustom,   hasCustomField: true}
    //     ];

    //
    // }

    // Called when the clicking Submit. Move the input data from the custom component to the standard field
    handleSubmit(event){
        this.log('event standard field: '+event.target.dataset);
    }

    // Called when the RecordEditForms creates/updated the record with success
    // Generate a Next event for the Engine to capture
    handleSuccess(event){
        const payload = event.detail;
        const returnedRecordId = payload.id;
        this.log('Id of record created: '+returnedRecordId);

        // Prepare Next event
        const navigationEvent = new CustomEvent('navigationEvent', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {"navigateOriginComponent" : "Wizard_FieldSet",
            "navigateAction" : "Next",
            "recordId"       : returnedRecordId}
        });

        // Fire the event
        this.dispatchEvent(navigationEvent);
    }

    handleModified(event){
        this.log('id standard field: '+event.target.dataset['standard']);
        this.log('Parent received value from child '+ event.detail.value);
        // Finding the standard field with its Id
        let indexTxt = '[id="' + event.target.dataset['standard'] +'"]';
        this.log('selector: '+indexTxt );

        const inputName = this.template.querySelector(indexTxt);
        inputName.value = event.detail.value;

        // const standardField = this.template.querySelector( '[id="' +  + '"]');
        // // Passing the value received from teh child custom component
        // standardField.value = event.detail.value
    }
    // Fire Previous event
    clickPrevious(){
        const navigationEvent = new CustomEvent('navigationEvent', {
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

    // Logging function
    log(text){
        this.logtext = this.logtext + ' | '+text ;
    }
}
