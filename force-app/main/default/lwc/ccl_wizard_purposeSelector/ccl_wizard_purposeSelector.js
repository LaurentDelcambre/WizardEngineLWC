import { LightningElement, api, track } from 'lwc';
import initPurposes             from '@salesforce/apex/CCL_WizardEngineController.initPurposes';
import filterWizardsByPurpose   from '@salesforce/apex/CCL_WizardEngineController.filterWizardsByPurpose';
import getStepsFromMetadata     from '@salesforce/apex/CCL_WizardEngineController.getStepsFromMetadata';

/* Labels */
import ccl_wizard_wizard                from '@salesforce/label/c.ccl_wizard_wizard';
import ccl_wizard_purposeLabel          from '@salesforce/label/c.ccl_wizard_purposeLabel';
import ccl_wizard_next                  from '@salesforce/label/c.ccl_wizard_next';

export default class Ccl_wizard_purposeSelector extends LightningElement {
	// Public attribute
	@api reviewMode = false;
	@api selectedPurposeId;
    @api selectedWizardName;
    @api recordId;
    @api objectName = 'PRF__c';
    @api wizardType = 'PRF_Wizard';

	// Private attributes
	@track purposes;
    @track wizards;
    @track wizardComboboxDisabled = true;

    // Validation
    @track isInvalid = true;

	// Error handling
	@track error = '';

    // Expose the labels to use in the template.
    staticLabels = {
        ccl_wizard_wizard,
        ccl_wizard_purposeLabel,
        ccl_wizard_next
    };

    isPurposeAlreadySelected = false;

    get isPurposeDisabled(){
        return this.reviewMode || this.isPurposeAlreadySelected;
    }
	// Init
	connectedCallback() {
        // Only init the available Purpose__c if NOT in review mode
        if(!this.reviewMode){
            // Disable the Purpose picklsit if already select from PRF
            if(this.selectedPurposeId){
                this.isPurposeAlreadySelected = true;
            }
            initPurposes()
                .then(purposesAndLabels => {

                    let purposesServer = purposesAndLabels.purposes;

                    this.purposes = [];
                    // Loop through the values to structure then for the combobox component
                    for (let i = 0; i < purposesServer.length; i++) {
                        this.purposes.push({ label: purposesServer[i].Name, value: purposesServer[i].Id });
                    }

                    // If only 1 result then pre-select it
                    if (purposesServer.length === 1) {
                        // Set the selected value
                        this.selectedPurposeId = purposesServer[0].Id;
                    }

                    // return the selected Purpose__c id to feed the next filterWizard call
                    return this.selectedPurposeId;
                })
                .then( selectedPurposeId => {
                    console.log('selectedPurposeId: '+selectedPurposeId);
                    // Only Chain Init if we have a wizard selected (even through auto-select of a unique available value )
                    if (selectedPurposeId ) {
                        console.log('chained: '+selectedPurposeId);
                        this.filterWizards();
                    }
                })
                .catch(error => {
                    this.error = error;
                });
        }
    }

    // After loading DOM
    renderedCallback(){
        // Check Validity
        this.checkValidity();
    }

    filterWizards(){
        console.log('filterWizards');
        console.log('selectedPurposeId: '+this.selectedPurposeId);
        // Call the server-side method with the selected Purpose__c as a parameter
        filterWizardsByPurpose({purposeId: this.selectedPurposeId,
                                type: this.wizardType})
            .then( liWizardNames => {
                console.log('return from filterWizardsByPurpose');

                // Populate the list of available wizards filtered by Purpose__c
                this.wizards = [];
                console.log(liWizardNames);

                // Loop through the values to structure then for the combobox component
                for (let i = 0; i < liWizardNames.length; i++) {
                    this.wizards.push({ label: liWizardNames[i], value: liWizardNames[i] });
                }

                // If only 1 result then pre-select it
                if (liWizardNames.length === 1) {
                    //console.log('only 1 available Wizard');
                    // Set the selected value
                    this.selectedWizardName = liWizardNames[0];
                }

                // Enable the picklist
                this.wizardComboboxDisabled = false;
            })
            .catch(error => {
                console.error(error);
                this.error = error;
            });
    }

    // Filter the available Wizards depending on the selected Purpose__c
    filterWizardsFromEvent(event){
        console.log('start of filterWizards');

        if(event){
            console.log('event not null :'+event);
            this.selectedPurposeId = event.detail.value;
            console.log('selected by event: '+event.detail.value);
        }
        console.log('selectedPurposeId: '+this.selectedPurposeId);
        this.filterWizards();
    }

    // Handle change event on Combobox
    handleChange(event) {
        // Manually getting the selected value
        this.selectedWizardName = event.detail.value;

        // Check Validity
        this.checkValidity();
    }

	// User clicked Next button
	clickNext() {
        console.log("ccl_wizard_purposeSelector:clickNext");

        // Get the selected Wizard metadata from server-side
        getStepsFromMetadata( {selectedWizardName: this.selectedWizardName,} )
            .then( objectnameAndSteps => {
                console.log('return from getStepsFromMetadata')
                let liWizardSteps = objectnameAndSteps.steps;
                let objectName = objectnameAndSteps.objectName;
                let recordTypeId = objectnameAndSteps.recordTypeId;
                console.log('objectName: '+objectName);
                console.log('recordTypeId: '+recordTypeId);

                // Fire the Next event
                const navigationEvent = new CustomEvent('navigation', {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: {
                        "navigateOriginComponent" : "Purpose_Selector",
                        "navigateAction" : "Next",
                        "selectedPurposeId": 	this.selectedPurposeId,
                        "selectedWizardName": 	this.selectedWizardName,
                        "objectName"        :   objectName,
                        "recordTypeId"      :   recordTypeId,
                        "listWizardSteps": 		liWizardSteps
                    }
                });

                // Fire the event
                this.dispatchEvent(navigationEvent);
            })
            .catch(error => {
                console.error(error);
                this.error = error;
            });
    }

    // Check validity
    checkValidity(){
        console.log('length: '+this.template.querySelectorAll('lightning-combobox').length);
        this.isInvalid = ![...this.template.querySelectorAll('lightning-combobox')]
            .reduce((validSoFar, inputCmp) => {
                //inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity() && !(inputCmp.value==='Select an Option');
            }, true);
        console.log('this.isInvalid: '+this.isInvalid);
    }
}
