import { LightningElement, api, track } from 'lwc';
//import {Picker} from './vanilla-picker/vanilla-picker';
//import {colorPicker} from './tui-color-picker/tui-color-picker';


export default class ccl_wizard_color_picker extends LightningElement {
    @track myValue = '10';
    @api title;
    instance;

    // Logging
    @track logtext = '';

    connectedCallback(){
        // this.instance = new Picker({
        //     parent: this.template.querySelector('#example'),
        //     onDone: function(color){this.log('color selectd: '+color)}
        // });
    }



    @api getValue(){

        this.logtext = this.logtext + ' | value field: '+ this.template.querySelector('lightning-input').value;
        return this.template.querySelector('lightning-input').value;
    }

    handleChange(evt){
        //this.log('value from change Event: '+evt.target.value);
        // Prepare Next event
        const changeEvent = new CustomEvent('modified', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {"value"       : evt.target.value}
        });

        // Fire the event
        this.dispatchEvent(changeEvent);
    }

    // Logging function
    log(text){
        this.logtext = this.logtext + ' | '+text ;
    }
}
