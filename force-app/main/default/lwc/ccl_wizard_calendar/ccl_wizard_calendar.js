import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

/* Import Calendar library */
import datepickk from '@salesforce/resourceUrl/datepickk';
// import jquery from '@salesforce/resourceUrl/jquery';
// import fullCalendar from '@salesforce/resourceUrl/fullCalendar';

/*import Pikaday from '@salesforce/resourceUrl/Pikaday';*/

/* Update Pickup date */
import updateSelectedDate from '@salesforce/apex/CCL_WizardEngineController.updateSelectedDate';
/* fetch record Date */
import getDateValue from '@salesforce/apex/CCL_WizardEngineController.getDateValue';

/* Labels */
import ccl_wizard_next                    from '@salesforce/label/c.ccl_wizard_next';
import ccl_wizard_previous                  from '@salesforce/label/c.ccl_wizard_previous';
import ccl_wizard_leukapheresisShipmentDate            from '@salesforce/label/c.ccl_wizard_leukapheresisShipmentDate';

export default class Ccl_wizard_calendar extends LightningElement {
    @api recordId;
    @api objectName;
    @api fieldName;
    @api reviewMode = false;
    @track selectedDate;
    @track returnedDate;
    @track formattedDate;
    initialized = false;

    // Expose the labels to use in the template.
    staticLabels = {
        ccl_wizard_leukapheresisShipmentDate,
        ccl_wizard_next,
        ccl_wizard_previous
    };

    renderedCallback() {
        if(!this.reviewMode){
            if (this.initialized) {
                return;
            }
            this.initialized = true;

            console.log('before loading');
            Promise.all([
                /* Pickaday */
                // loadScript(this, Pikaday + '/pikaday.js'),
                // loadStyle(this, Pikaday + '/pikaday.css')

                /* Custom jQueryUI */


                /* Datepickk */
                loadStyle(this, datepickk + '/datepickk.min.css'),
                loadScript(this, datepickk + '/datepickk.min.js'),

                /* FullCalendarJS */

                // loadScript(this, jquery),
                // loadScript(this, fullCalendar + '/moment.min.js'),
                // loadScript(this, fullCalendar + '/fullcalendar.min.js'),
                // //loadScript(this, fullCalendar + '/interaction.js'),
                // //loadScript(this, fullCalendar + '/daygrid.js'),
                // //loadScript(this, fullCalendar + '/timegrid.js'),
                // loadStyle(this, fullCalendar + '/fullcalendar.min.css'),
                // loadStyle(this, fullCalendar + '/daygrid.css'),
                // loadStyle(this, fullCalendar + '/timegrid.css'),

            ])
            .then(() => {
                // Initialise the calendar configuration
                this.initializeCalendar();
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error({
                message: 'Error occured on FullCalendarJS',
                error
                });
            })
        }
    }

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

    /* Initalization of the calendar */
    initializeCalendar() {
        console.log('initializeCalendar');

        /* Pickaday */
        /*const container = this.template.querySelector('.date-picker');
        new Pikaday({ field: container });*/

        /* Datepickk */
        const calendarEl = this.template.querySelector('div.calendar');
        const datepicker = new Datepickk();
        datepicker.container = calendarEl;
        datepicker.maxSelections  = 1;
        let that = this;
        datepicker.onSelect = function(checked){
            console.log(this.toLocaleDateString());
            const options = { year: 'numeric', month: 'short', day: '2-digit' };

            /* !!! HARDCODED !!! */
            //that.selectedDate = this.toLocaleDateString();
            that.selectedDate = '04/04/2019';
            //that.formattedDate = this.toLocaleDateString("en-US", options);
            that.formattedDate = '04 March 2019';
        };
        datepicker.show();

        /* FullCalendarJS
        const ele = this.template.querySelector('div.fullcalendarjs');

        // eslint-disable-next-line no-undef
        $(ele).fullCalendar({
            header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
            },
            // defaultDate: '2019-01-12',
            defaultDate: new Date(), // default day is today
            navLinks: true, // can click day/week names to navigate views
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            events: [
                {
                        title: 'All Day Event',
                        start: '2019-01-01'
                },
                {
                        title: 'Long Event',
                        start: '2019-01-07',
                        end: '2019-01-10'
                },
                {
                        id: 999,
                        title: 'Repeating Event',
                        start: '2019-01-09T16:00:00'
                },
                {
                        id: 999,
                        title: 'Repeating Event',
                        start: '2019-01-16T16:00:00'
                },
                {
                        title: 'Conference',
                        start: '2019-01-11',
                        end: '2019-01-13'
                },
                {
                        title: 'Meeting',
                        start: '2019-01-12T10:30:00',
                        end: '2019-01-12T12:30:00'
                },
                {
                        title: 'Lunch',
                        start: '2019-01-12T12:00:00'
                },
                {
                        title: 'Meeting',
                        start: '2019-01-12T14:30:00'
                },
                {
                        title: 'Happy Hour',
                        start: '2019-01-12T17:30:00'
                },
                {
                        title: 'Dinner',
                        start: '2019-01-12T20:00:00'
                },
                {
                        title: 'Birthday Party',
                        start: '2019-01-13T07:00:00'
                },
                {
                        title: 'Click for Google',
                        url: 'http://google.com/',
                        start: '2019-01-28'
                }
            ]
            });
            */
    }

    // Call serv-side method to update Date
    clickNext(){
        console.log('clickNext:updateSelectedDate');
        updateSelectedDate({'recordId': this.recordId,
                            'selectedDate': this.selectedDate})
            .then( ()=>{

                console.log('return from updateSelectedDate');
                // Construct the Previous event
                const navigationEvent = new CustomEvent('navigation', {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                    "navigateOriginComponent"   : "PRF_Scheduling",
                    "navigateAction"            : "Next"
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
                "navigateOriginComponent" : "PRF_Scheduling",
				"navigateAction" : "Previous"
            }
        });

        // Fire the event
        this.dispatchEvent(navigationEvent);
    }
}
