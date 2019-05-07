import { LightningElement, api, track } from 'lwc';
import filterSitesByPurpose from '@salesforce/apex/CCL_WizardEngineController.filterSitesByPurpose';
import filterTeamsBySite from '@salesforce/apex/CCL_WizardEngineController.filterTeamsBySite';
import filterHCPsByTeamOrSite from '@salesforce/apex/CCL_WizardEngineController.filterHCPsByTeamOrSite';
import insertPRFSiteTeamHcp from '@salesforce/apex/CCL_WizardEngineController.insertPRFSiteTeamHcp';
// Error handling
import { reduceErrors } from 'c/ldsUtils';

/* Labels */
import ccl_wizard_treatmentCenter       from '@salesforce/label/c.ccl_wizard_treatmentCenter';
import ccl_wizard_team                  from '@salesforce/label/c.ccl_wizard_team';
import ccl_wizard_hcp                   from '@salesforce/label/c.ccl_wizard_hcp';
import ccl_wizard_next                  from '@salesforce/label/c.ccl_wizard_next';
import ccl_wizard_previous              from '@salesforce/label/c.ccl_wizard_previous';
export default class Ccl_wizard_siteTeamHcp extends LightningElement {
    @api reviewMode = false;
    @api recordId;
    @api objectName;
    @api selectedPurposeId;
	@api selectedWizardName;
    @api selectedSiteId;
    @api selectedTeamId;
    @api selectedHcpId;

    @track isSiteDisabled = true;
    @track isTeamDisabled = true;
    @track isHcpDisabled = true;

    labelSite;
    labelTeam;
    labelHcp;
    availableSites;
    availableTeams;
    availableHcps;

    // Validation
    @track isInvalid = true;
    @track errors = [];
    @track error;
    // Expose the labels to use in the template.
    staticLabels = {
        ccl_wizard_treatmentCenter,
        ccl_wizard_team,
        ccl_wizard_hcp,
        ccl_wizard_next,
        ccl_wizard_previous
    };

    // Initialisation
    connectedCallback(){
        // Only init the available Sites if NOT in review mode
        if(!this.reviewMode){
            console.log('selectedSiteId passed by parent by attribute: '+this.selectedSiteId);
            this.filterSites();
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
        console.log('length: '+this.template.querySelectorAll('lightning-combobox').length);
        this.isInvalid = ![...this.template.querySelectorAll('lightning-combobox')]
            .reduce((validSoFar, inputCmp) => {
                return validSoFar && inputCmp.checkValidity() && !(inputCmp.value==='Select an Option');
            }, true);
        console.log('this.isInvalid: '+this.isInvalid);
    }

    filterSites(){
        filterSitesByPurpose({purposeId: this.selectedPurposeId})
            .then(sitesAndLabel => {
                console.log('return from filterSitesByPurpose: '+sitesAndLabel);
                this.labelSite = sitesAndLabel.labels[0];
                this.labelTeam = sitesAndLabel.labels[1];
                this.labelHcp = sitesAndLabel.labels[2];

                this.availableSites = [];
                // Loop through the values to structure then for the combobox component
                for (let i = 0; i < sitesAndLabel.sites.length; i++) {
                    this.availableSites.push({ label: sitesAndLabel.sites[i].Name, value: sitesAndLabel.sites[i].Id });
                }

                // If only 1 result then pre-select it
                if (sitesAndLabel.sites.length === 1) {
                    // Set the selected value
                    this.selectedSiteId = sitesAndLabel.sites[0].Id;

                    // Manually call the next filter method
                    this.filterTeams();
                }

                // Enable the picklist
				if(this.reviewMode === false){
                    this.isSiteDisabled = false;
                }
            })
            .catch(receivedErrors => {
                console.error(receivedErrors);
                this.errors = receivedErrors;
            });
    }

    // onChange on Site combox = filter available teams
    filterTeams(event){
        if(event){
            // Store the selected value manually
            this.selectedSiteId = event.detail.value;
        }
        filterTeamsBySite({siteId: this.selectedSiteId})
            .then(listTeams => {
                console.log('return from filterTeamsBySite: '+listTeams);

                this.availableTeams = [];
                // Loop through the values to structure then for the combobox component
                for (let i = 0; i < listTeams.length; i++) {
                    this.availableTeams.push({ label: listTeams[i].Name, value: listTeams[i].Id });
                }

                // If only 1 result then pre-select it
                if (listTeams.length === 1) {
                    console.log('only 1 available Team');
                    // Set the selected value
                    this.selectedTeamId = listTeams[0].Id;

                    // Manually call the next filter method
                    this.filterHcps();
                }

                // Enable the picklist
                if(this.reviewMode === false){
                    this.isTeamDisabled = false;
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    // onChange on Site combox = filter available teams
    filterHcps(event){
        console.log('filterHcps');
        if(event){
            // Store the selected value manually
            this.selectedTeamId = event.detail.value;
        }
		filterHCPsByTeamOrSite({teamId: this.selectedTeamId})
            .then(listHcps => {
                console.log('return from filterHCPsByTeamOrSite: '+listHcps);

                this.availableHcps = [];
                // Loop through the values to structure then for the combobox component
                for (let i = 0; i < listHcps.length; i++) {
                    this.availableHcps.push({ label: listHcps[i].Name, value: listHcps[i].Id });
                }

                // If only 1 result then pre-select it
                if (listHcps.length === 1) {
                    // Set the selected value
                    this.selectedHcpId = listHcps[0].Id;
                }
                // Enable the picklist
                if(this.reviewMode === false){
                    this.isHcpDisabled = false;
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Called when onchange event is triggered by the combobox
    handleHcpSelect(event){
        // Store the selected value manually
        this.selectedHcpId = event.detail.value;

        // Check Validity
        this.checkValidity();
    }

    // User clicked on previous button
    clickPrevious(){
        console.log('ccl_wizard_siteTeamHcp:clickPrevious');
        // Construct the Previous event
        const navigationEvent = new CustomEvent('navigation', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                "navigateOriginComponent" : "PRF_START",
                "navigateAction" : "Previous"
            }
        });

        // Fire the event
        this.dispatchEvent(navigationEvent);
    }

    // User clicked on next button: Insert the record in the Database and throw a navigation event
    clickNext(){
        console.log('ccl_wizard_siteTeamHcp:clickNext');
        console.log('ccl_wizard_siteTeamHcp:selectedHcpId: '+this.selectedHcpId);

        insertPRFSiteTeamHcp({
                purposeId: this.selectedPurposeId,
                wizardName:this.selectedWizardName,
                siteId: this.selectedSiteId,
                teamId: this.selectedTeamId,
                HCPId: this.selectedHcpId,
                recordId: this.recordId})
            .then(returnedRecordId => {
                this.error = undefined;
                console.log('return from insertPRFSiteTeamHcp: '+returnedRecordId);

                this.recordId = returnedRecordId;

                // Construct the Previous event
                const navigationEvent = new CustomEvent('navigation', {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: {
                        "navigateOriginComponent" : "PRF_START",
                        "navigateAction" : "Next",
                        "recordId" : 		    this.recordId,
                        "selectedPurposeId": 	this.selectedPurposeId,
                        "selectedSiteId": 		this.selectedSiteId,
                        "selectedTeamId": 		this.selectedTeamId,
                        "selectedHCPId": 		this.selectedHCPId
                    }
                });

                // Fire the event
                this.dispatchEvent(navigationEvent);
            })
            .catch(error => {

                this.error = error;
            });
    }
}
