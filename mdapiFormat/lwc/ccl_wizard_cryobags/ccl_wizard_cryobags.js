import { LightningElement, api, track } from 'lwc';
import insertCryobags from '@salesforce/apex/CCL_WizardEngineController.insertCryobags';

export default class Ccl_wizard_cryobags extends LightningElement {
    @api recordId;
    @api reviewMode = false;
    @api cryobags;
    @api selectedPurposeId;
    @track localCryobags;

    get options() {
        return [
            { value: 'true' },
        ];
    }

    // check array's length to disable the Remove button
    get isLengthOne(){
        return this.localCryobags.length === 1;
    }

    // Initialization
    connectedCallback(){
        if(this.cryobags){
            console.log('localCryobagsinput this.cryobags: '+this.cryobags);
            this.localCryobags = this.cryobags;
        }
        else{
            //  Initial AppointmentLineItem__c record
            this.localCryobags = [
                {'sobjectType': 'AppointmentLineItem__c',
                'Cryobag_ID__c':'cryo1',
                'Nucleated_Cell_Count__c':'120',
                'TotalVolumePerBag__c':'10',
                'DIN_Apheresis_ID__c':'DIN1',
                'Appointment__c': this.recordId,
                'CryobagNumber__c': '1',
                'To_Be_Shipped__c':'true'}];
        }

    }

    // Add a line to the table
    addCryobag(){
        console.log('CCL_CryobagsController:addCryobag');

        //  Add a new AppointmentLineItem__c record to fill
        this.localCryobags.push({'sobjectType': 'AppointmentLineItem__c',
                            'Appointment__c': this.recordId,
                            'CryobagNumber__c': (this.localCryobags.length+1).toString(),
                            'Cryobag_ID__c':'cryo1',
                            'Nucleated_Cell_Count__c':'120',
                            'TotalVolumePerBag__c':'0',
                            'DIN_Apheresis_ID__c':'DIN',
                            'To_Be_Shipped__c':'false'});
    }

    // Remove a line to the table
    removeCryobag(){
        console.log('CCL_CryobagsController:removeCryobag');
        this.localCryobags.pop();
    }

    // Call serv-side method to inser cryobags
    clickNext(){
        console.log('clickNext');
        insertCryobags({'cryobags': this.localCryobags, selectedPurposeId: this.selectedPurposeId})
            .then( ()=>{

                console.log('return from insertCryobags');
                // Construct the Previous event
                const navigationEvent = new CustomEvent('navigation', {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                    "navigateOriginComponent"   : "ADF_Cryobags",
                    "navigateAction"            : "Next",
                    "cryobags"		            : this.localCryobags
                    }
                });

                // Fire the event
                this.dispatchEvent(navigationEvent);
            })
            .catch(error => {
                console.error(error);
            });
    }

    clickPrevious(){
        // Fire the Next event
        const navigationEvent = new CustomEvent('navigation', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                "navigateOriginComponent" : "ADF_Cryobags",
				"navigateAction" : "Previous"
            }
        });

        // Fire the event
        this.dispatchEvent(navigationEvent);
    }
}
