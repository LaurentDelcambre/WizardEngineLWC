import { LightningElement, api } from 'lwc';

export default class Ccl_wizard_progressIndicator extends LightningElement {
    @api title = 'Path Indicator';
    @api steps;
    @api currentStep;
}
