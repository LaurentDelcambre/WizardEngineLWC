import { LightningElement, track, api } from 'lwc';
/* Wire adapter to fetch record data */
import getDateValue from '@salesforce/apex/CCL_WizardEngineController.getDateValue';
/* Toast to display error message */
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
/* Business logic to update the selected Date */
import updateSelectedDate from '@salesforce/apex/CCL_WizardEngineController.updateSelectedDate';

export default class Ccl_wizard_dateofbirth extends LightningElement {
    @api reviewMode = false;
    @api recordId;
    @api objectName;
    @api fieldName;
    @track selectedDate = '2019-01-01';
    @track returnedDate;
    stringDay = '01';
    stringMonth = '01';
    stringYear = '2019';
    @track hasError = false;

    /* Load the field value dynamically for custom rendering */
    connectedCallback(){
        if(this.reviewMode){
            getDateValue({ recordId: this.recordId, objectName: this.objectName, fieldName: this.fieldName})
                .then( data => {
                    this.returnedDate = data;
                    console.log('field value in wizard_dateofbirth: '+this.returnedDate);
                })
                .catch(error =>{
                    console.error(error);
                })
        }
    }
    // Validate the date entry
    validateDate(dateString){
        let dateFormat = new Date(dateString);
        return dateFormat instanceof Date && !isNaN(dateFormat.getTime());
    }

    // Show a toast
    showNotification(errorMessage) {
        const evt = new ShowToastEvent({
            title: 'Error',
            message: errorMessage,
            variant: 'error',
        });
        this.dispatchEvent(evt);
    }

    handleChange(evt){
        const field = evt.target.name;
        console.log('selected value: '+evt.target.value);
        if (field === 'day') {
            this.stringDay = evt.target.value;
        }
        else if(field === 'month'){
            this.stringMonth = evt.target.value;
        }
        else if(field === 'year'){
            this.stringYear = evt.target.value;
        }

        this.selectedDate = this.stringYear + '-' + this.stringMonth + '-' + this.stringDay;

        // Date validation and error message
        if(!this.validateDate(this.selectedDate)){
            this.hasError = true;
            //this.showNotification('Please select a valid Date');
        }
        else{
            this.hasError = false;
        }

        // Prepare modified Event with full date of birth
        const changeEvent = new CustomEvent('modified', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {"value"       : this.selectedDate}
        });

        // Fire the event
        this.dispatchEvent(changeEvent);
    }

    get monthOptions() {
		return [
				{ label: 'January', 	value: '01' },
				{ label: 'February', 	value: '02' },
				{ label: 'Mars', 		value: '03' },
				{ label: 'Avril', 		value: '04' },
				{ label: 'May', 		value: '05' },
				{ label: 'June', 		value: '06' },
				{ label: 'July', 		value: '07' },
				{ label: 'August', 		value: '08' },
				{ label: 'September',   value: '09' },
				{ label: 'October', 	value: '10' },
				{ label: 'November', 	value: '11' },
				{ label: 'December', 	value: '12' },
		];
    }

    // Call serv-side method to inser cryobags
    clickNext(){
        console.log('clickNext');
        updateSelectedDate({'selectedDate': this.selectedDate})
            .then( ()=>{

                console.log('return from updateSelectedDate');
                // Construct the Next event
                const navigationEvent = new CustomEvent('navigation', {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                    "navigateOriginComponent"   : "Calendar",
                    "navigateAction"            : "Next",
                    "selectedDate"		        : this.selectedDate
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
        // Fire the Previous event
        const navigationEvent = new CustomEvent('navigation', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                "navigateOriginComponent" : "Calendar",
				"navigateAction" : "Previous"
            }
        });

        // Fire the event
        this.dispatchEvent(navigationEvent);
    }
}
