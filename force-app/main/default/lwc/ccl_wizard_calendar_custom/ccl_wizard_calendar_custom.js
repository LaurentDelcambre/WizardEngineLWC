import { LightningElement, api, track } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

/* Import jQuery library */
import jquery from '@salesforce/resourceUrl/jquery';
import jqueryUI from '@salesforce/resourceUrl/jqueryUI';
import moment from '@salesforce/resourceUrl/moment';

/* Labels */
import ccl_wizard_next                    from '@salesforce/label/c.ccl_wizard_next';
import ccl_wizard_previous                  from '@salesforce/label/c.ccl_wizard_previous';
import ccl_wizard_leukapheresisShipmentDate            from '@salesforce/label/c.ccl_wizard_leukapheresisShipmentDate';

export default class Ccl_wizard_calendar_custom extends LightningElement {

    // Expose the labels to use in the template.
    staticLabels = {
        ccl_wizard_leukapheresisShipmentDate,
        ccl_wizard_next,
        ccl_wizard_previous
    };

    @track errors;
    @track
    calendar;
    renderedCallback() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        loadScript(this, moment)
            .then(() => {
                // Initialise the calendar configuration
                this.initializeCalendar();
            })
            .catch(error => {
                this.errors = error;
                // eslint-disable-next-line no-console
                console.error({
                message: 'Error occured on loading jQuery library',
                error
                });
            })
    }

    /* Initalization of the calendar */
    initializeCalendar() {
        console.log('initializeCalendar');
        //const ele = this.template.querySelector('div.calendar');
        //console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
        // const startWeek = moment().startOf('month').week();
        // const endWeek = moment().endOf('month').week();

        //console.log(startWeek.format());
        // this.calendar = []
        // for(let week = startWeek; week<endWeek;week++){
        // this.calendar.push({
        //         week:week,
        //         days:Array(7).fill(0).map((n, i) => moment().week(week).startOf('week').clone().add(n + i, 'day'))
        //     })
        // }


        // $(ele).datepicker({
        //     inline: true,
        //     firstDay: 1,
        //     showOtherMonths: true,
        //     dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        // });
        // .on("changeDate", function(e) {
        // console.log("Date changed: ", e.date);
        // });

        console.log('after initializeCalendar');
    }
    @track
    isClicked = false;

    get divClassSelected(){
        let str = "available";
        if(this.isClicked){
            str = "selected";
        }
        return str;
    }
    get divClassBetween(){
        let str = "available";
        if(this.isClicked){
            str = "in-range";
        }
        return str;
    }
    get divClassRange(){
        let str = "available";
        if(this.isClicked){
            str = " active start-date";
        }
        return str;
    }
    dateclick(){
        console.log('dateclick');
        this.isClicked = true;
        this.template.querySelector('div.calendar').classList.add('cf');
    }
}
