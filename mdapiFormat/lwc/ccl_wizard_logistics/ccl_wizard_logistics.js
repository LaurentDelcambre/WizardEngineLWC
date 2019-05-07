import { LightningElement, api, track } from 'lwc';

import initApheresisCenters from '@salesforce/apex/CCL_WizardEngineController.initApheresisCenters';
import initInfusionCenters from '@salesforce/apex/CCL_WizardEngineController.initInfusionCenters';
import getPickUpLocations from '@salesforce/apex/CCL_WizardEngineController.getPickUpLocations';
import getShipToLocations from '@salesforce/apex/CCL_WizardEngineController.getShipToLocations';
import insertPRFLogisticsRecords from '@salesforce/apex/CCL_WizardEngineController.insertPRFLogisticsRecords';

/* Labels */
import ccl_wizard_aphCenter             from '@salesforce/label/c.ccl_wizard_aphCenter';
import ccl_wizard_pickupLocation        from '@salesforce/label/c.ccl_wizard_pickupLocation';
import ccl_wizard_infusionCenter        from '@salesforce/label/c.ccl_wizard_infusionCenter';
import ccl_wizard_shiptoLocation        from '@salesforce/label/c.ccl_wizard_shiptoLocation';
import ccl_wizard_next                  from '@salesforce/label/c.ccl_wizard_next';
import ccl_wizard_previous              from '@salesforce/label/c.ccl_wizard_previous';

export default class Ccl_wizard_logistics extends LightningElement {
    @api reviewMode;
    @api selectedPurposeId;
    @api selectedSiteId;
    @api recordId;
    @api objectName;
    @api selectedApheresisCenterId;
    @api selectedPickUpLocationId;
    @api selectedInfusionCenterId;
    @api selectedShipToLocationId;


    apheresisCenters;
    pickUpLocations;
    infusionCenters;
    shipToLocations;

    // Disable picklist
    @track isApheresisDisabled = true;
    @track isPickupDisabled    = true;
    @track isInfusionDisabled  = true;
    @track isShiptoDisabled    = true;

    // Validation
    @track isInvalid = true;

    // Expose the labels to use in the template.
    staticLabels = {
        ccl_wizard_aphCenter,
        ccl_wizard_pickupLocation,
        ccl_wizard_infusionCenter,
        ccl_wizard_shiptoLocation,
        ccl_wizard_next,
        ccl_wizard_previous
    };

    // Initialisation
    connectedCallback(){
        // Only init the available Logistic information if NOT in review mode
        if(!this.reviewMode){
            console.log('selectedSiteId passed by parent by attribute: '+this.selectedSiteId);
            this.initApheresis();
            this.initInfusion();
        }
    }

    // After loading DOM
    renderedCallback(){
        if(!this.reviewMode){
            this.checkValidity();
        }
    }

    // Check validity
    checkValidity(){
        this.isInvalid = ![...this.template.querySelectorAll('lightning-combobox')]
            .reduce((validSoFar, inputCmp) => {
                return validSoFar && inputCmp.checkValidity() && !(inputCmp.value==='Select an Option');
            }, true);
        console.log('this.isInvalid: '+this.isInvalid);
    }

    initApheresis(){
        initApheresisCenters({selectedPurposeId: this.selectedPurposeId,
                            selectedSiteId: this.selectedSiteId})
            .then(labelsAndApheresis => {
                console.log('return from initApheresisCenters: '+labelsAndApheresis);

                this.apheresisCenters = [];
                // Loop through the values to structure then for the combobox component
                for (let i = 0; i < labelsAndApheresis.apheresis.length; i++) {
                    this.apheresisCenters.push({ label: labelsAndApheresis.apheresis[i].Name, value: labelsAndApheresis.apheresis[i].Id });
                }

                // If only 1 result then pre-select it
                if (labelsAndApheresis.apheresis.length === 1) {
                    // Set the selected value
                    this.selectedApheresisCenterId = labelsAndApheresis.apheresis[0].Id;
                }

                // Enable the picklist
				if(this.reviewMode === false){
                    this.isApheresisDisabled = false;
                }

                // return the selected ApheresisCenter Id to feed the next filterPickUpLocations call
                return this.selectedApheresisCenterId;
            })
            .then( selectedApheresisCenterId => {
                console.log('selectedApheresisCenterId: '+selectedApheresisCenterId);
                // Only Chain Init if we have a Apheresis center selected (even through auto-select of a unique available value )
                // TODO: check reviewMode
                if (selectedApheresisCenterId ) {
                    console.log('chained: '+selectedApheresisCenterId);
                    this.filterPickUpLocations();
                }
            })
            .catch(error => {
                this.error = error;
            });
    }

    initInfusion(){
        initInfusionCenters({selectedPurposeId: this.selectedPurposeId,
                            selectedSiteId: this.selectedSiteId})
            .then(returnedInfusionCenters => {
                console.log('return from initInfusionCenters: '+returnedInfusionCenters);

                this.infusionCenters = [];
                // Loop through the values to structure then for the combobox component
                for (let i = 0; i < returnedInfusionCenters.length; i++) {
                    this.infusionCenters.push({ label: returnedInfusionCenters[i].Name, value: returnedInfusionCenters[i].Id });
                }

                // If only 1 result then pre-select it
                if (returnedInfusionCenters.length === 1) {
                    // Set the selected value
                    this.selectedInfusionCenterId = returnedInfusionCenters[0].Id;
                }

                // Enable the picklist
				if(this.reviewMode === false){
                    this.isInfusionDisabled = false;
                }

                // return the selected InfusionCenter Id to feed the next filterShipToLocations call
                return this.selectedInfusionCenterId;
            })
            .then( selectedInfusionCenterId => {
                console.log('selectedInfusionCenterId: '+selectedInfusionCenterId);
                // Only Chain Init if we have a Apheresis center selected (even through auto-select of a unique available value )
                // TODO: check reviewMode
                if (selectedInfusionCenterId ) {
                    console.log('chained: '+selectedInfusionCenterId);
                    this.filterShipToLocations();
                }
            })
    }

    filterPickUpLocationsFromEvent(event){
        console.log('start of filterWizards');

        if(event){
            console.log('evnet not null :'+event);
            this.selectedApheresisCenterId = event.detail.value;
            console.log('selected by event: '+event.detail.value);
        }
        console.log('selectedApheresisCenterId: '+this.selectedApheresisCenterId);
        this.filterPickUpLocations();
    }

    filterPickUpLocations(){
        getPickUpLocations({selectedApheresisCenterId: this.selectedApheresisCenterId})
            .then(returnedPickupLocations => {
                console.log('return from getPickUpLocations: '+returnedPickupLocations);

                this.pickUpLocations = [];
                // Loop through the values to structure then for the combobox component
                for (let i = 0; i < returnedPickupLocations.length; i++) {
                    this.pickUpLocations.push({ label: returnedPickupLocations[i].Name, value: returnedPickupLocations[i].Id });
                }

                // If only 1 result then pre-select it
                if (returnedPickupLocations.length === 1) {
                    // Set the selected value
                    this.selectedPickUpLocationId = returnedPickupLocations[0].Id;
                }

                // Enable the picklist
                if(this.reviewMode === false){
                    this.isPickupDisabled = false;
                }
            })
    }

    filterShipToLocationsFromEvent(event){
        console.log('start of filterPickUpLocations');

        if(event){
            console.log('evnet not null :'+event);
            this.selectedInfusionCenterId = event.detail.value;
            console.log('selected by event: '+event.detail.value);
        }
        console.log('selectedInfusionCenterId: '+this.selectedInfusionCenterId);
        this.filterPickUpLocations();
    }

    filterShipToLocations(){
        getShipToLocations({selectedInfusionCenterId: this.selectedInfusionCenterId})
            .then(returnedShiptos => {
                console.log('return from getShipToLocations: '+returnedShiptos);

                this.shipToLocations = [];
                // Loop through the values to structure then for the combobox component
                for (let i = 0; i < returnedShiptos.length; i++) {
                    this.shipToLocations.push({ label: returnedShiptos[i].Name, value: returnedShiptos[i].Id });
                }

                // If only 1 result then pre-select it
                if (returnedShiptos.length === 1) {
                    // Set the selected value
                    this.selectedShipToLocationId = returnedShiptos[0].Id;
                }

                // Enable the picklist
                if(this.reviewMode === false){
                    this.isShiptoDisabled = false;
                }
            })
    }

    // Called when onchange event is triggered by the combobox
    handleShiptoSelect(event){
        // Store the selected value manually
        this.selectedShipToLocationId = event.detail.value;
    }

    clickNext(){
		console.log("recordId before calling server insertPRFLogisticsRecords: "+ this.recordId);
        insertPRFLogisticsRecords({
            recordId:     this.recordId,
            apheresisCenterId: this.selectedApheresisCenterId,
            pickUpLocationId: this.selectedPickUpLocationId,
            infusionCenterId: this.selectedInfusionCenterId,
            shipToLocationId: this.selectedShipToLocationId
        })
            .then(() => {
                console.log('insertPRFLogisticsRecords:callback SUCCESS');
                // Fire the Next event
                const navigationEvent = new CustomEvent('navigation', {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: {
                        "navigateOriginComponent" : "PRF_Logistics",
                        "navigateAction" : "Next",
                        "selectedApheresisCenterId": 	this.selectedApheresisCenterId,
                        "selectedPickUpLocationId": 	this.selectedPickUpLocationId,
                        "selectedInfusionCenterId": 	this.selectedInfusionCenterId,
                        "selectedShipToLocationId": 	this.selectedShipToLocationId
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

    clickPrevious(){
        // Fire the Next event
        const navigationEvent = new CustomEvent('navigation', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                "navigateOriginComponent" : "PRF_Logistics",
				"navigateAction" : "Previous"
            }
        });

        // Fire the event
        this.dispatchEvent(navigationEvent);
    }
}
