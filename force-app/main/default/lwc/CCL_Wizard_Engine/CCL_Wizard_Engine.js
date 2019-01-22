import { LightningElement, api, track, wire } from 'lwc';

export default class CCL_Wizard_Engine extends LightningElement {
    // Boolean to control diusplay of relevant components
    @track isProgressBarDisplayed   = false;
    @track isProgressBarDisplayed   = false;
    @track isPurposeCmpDisplayed    = false;
    @track isSiteCmpDisplayed       = false;
    @track isPatientCmpDisplayed    = false;
    @track isLogisticsDisplayed     = false;
    @track isReviewSubmitDisplayed  = false;
    @track isCryobagsDisplayed      = false;
    @track isLoading                = false;

    @track sectionDescription;
}
