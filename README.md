#jquery.numericfield
This jQuery plugin creates an input field that only allows numbers. It also supports min/max values, configurable decimal places, configurable steps (increments and decrements by using keyboard arrows) and a simple API to interact with it programatically.

##Setup
Obs.: This plugin depends on jQuery 1.6+ and jQuery UI 1.9+. 
You don't need to reference the whole jQuery UI library, just the *jquery.ui.widget*

- Add a reference to jQuery and jQuery UI (or jquery.ui.widget)
- Add a reference to jquery.numericfield
- Have fun!

##Examples
###Simple usage
    
    <input type="text" id="simple" />
    <script type="text/javascript">
        $('#simple').numericfield();
    </script>
    
###Min/Max values

    <input type="text" id="minmax" />
    <script type="text/javascript">
        $('#minmax').numericfield({
            minValue: -10,
            maxValue: 20
        });
    </script>
    
###Decimal places

    <input type="text" id="decimals" />
    <script type="text/javascript">
        $('#decimals').numericfield({
            decimalPlaces: 3
        });
    </script>
    
###Configurable steps values

    <input type="text" id="steps" />
    <script type="text/javascript">
        $('#steps').numericfield({
            stepUp: 2,
            stepDown: 3
        });
    </script>

###Disable steps

    <input type="text" id="steps" />
    <script type="text/javascript">
        $('#steps').numericfield({
            allowSteps: false
        });
    </script>
    
###Real time change event
When this option is set to true a *change* event will be triggered when a "step" operation is performed or when the value must be changed to be valid. Otherwise the *change* event will only be triggered when the input loses focus.

    <input type="text" id="realtime" />
    <script type="text/javascript">
        $('#realtime').numericfield({
            realTimeChange: true
        });
    </script>
    
### Quiet milliseconds for "step" operations
In cases where the user keeps the up or down arrow pressed, if realTimeChange is true, a *change* event would be triggered for each step performed. Quiet millis waits a given amount of time after the user to stop changing the value and triggers the *change* event only once.

    <input type="text" id="quietmillis" />
    <script type="text/javascript">
        $("#quietmillis").numericfield({
            quietMillis: 400
        });
    </script>    

##Options
<table>
    <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Default value</th>
    </tr>
    <tr>
        <td>
            maxValue
        </td>
        <td>
            Maximum value that can be typed in the input<br/>
            If null there is no maximum value
        </td>
        <td>
            null
        </td>
    </tr>
    <tr>
        <td>
            minValue
        </td>
        <td>
            Minimum value that can be typed in the input<br/>
            If null there is no minimum value
        </td>
        <td>
            null
        </td>
    </tr>
    <tr>
        <td>
            decimalPlaces
        </td>
        <td>
            Maximum number of decimal places that can be typed in the input<br/>
            If 0 (zero) only integers will be allowed<br/>
            When changed the current value is rounded automatically
        </td>
        <td>
            0
        </td>
    </tr>
    <tr>
        <td>
            stepUp
        </td>
        <td>
            The amount that will be added to the current value when a "step up" is performed
        </td>
        <td>
            1
        </td>
    </tr>
    <tr>
        <td>
            stepDown
        </td>
        <td>
            The amount that will be subtracted to the current value when a "step down" is performed
        </td>
        <td>
            1
        </td>
    </tr>
    <tr>
        <td>
            allowSteps
        </td>
        <td>
            If set to true enable "steps" (up arrow = step up & down arrow = step down)<br/>
            If set to false disable "steps"
        </td>
        <td>
            true
        </td>
    </tr>
    <tr>
        <td>
            realTimeChange
        </td>
        <td>
            When set to true, if a "step" is performed or when an invalid value must be changed to be valid, a <i>change</i> event will be triggered
        </td>
        <td>
            false
        </td>
    </tr>
    <tr>
        <td>
            quietMillis
        </td>
        <td>
            Amount of milliseconds that will be awaited before triggering a <i>change</i> event after a "step" operation<br/>
            If 0 (zero) the <i>change</i> event will be imediatelly triggered<br/>
            <b>Attention</b>: this option has NO effect if realTimeChange is false
        </td>
        <td>
            300
        </td>
    </tr>
</table>

##API

###value( [newVal] )
Gets or sets the current value

    $(element).numericfield(); // initialization
    ...
    // Gets the value
    var value = $(element).numericfield('value'); 
    
    // Sets the value
    $(element).numericfield('value', value + 10);

###stepUp( [useQuietMillis], [step] )
Performs a "step-up" operation. Increments the current value.

By default this method does not obey the quietMillis meaning that, if realTimeChange is true, then a *change* event will be imediatelly triggered. If you can make it obey quietMillis by passing **true** as the first parameter.

By default the amount that is added to the current value is defined by the stepUp option. If you want to override this you can pass the amount as the second parameter.

    $(element).numericfield({ realTimeChange: true, quietMillis: 400, stepUp: 2 }); // initialization
    ...
    // Increments current value by 2 and triggers the change event imediatelly
    $(element).numericfield('stepUp'); 
    
     // Increments current value by 2 and triggers the change event obeying the quietMillis option
    $(element).numericfield('stepUp', true);
    
     // Increments current value by 3 and triggers the change event imediatelly
    $(element).numericfield('stepUp', false, 3);
    
     // Increments current value by 3 and triggers the change event obeying the quietMillis option
    $(element).numericfield('stepUp', true, 3);

###stepDown( [useQuietMillis], [step] )
Performs a "step-down" operation. Decrements the current value.

By default this method does not obey the quietMillis meaning that, if realTimeChange is true, then a *change* event will be imediatelly triggered. If you can make it obey quietMillis by passing **true** as the first parameter.

By default the amount that is subtracted to the current value is defined by the stepDown option. If you want to override this you can pass the amount as the second parameter.

    $(element).numericfield({ realTimeChange: true, quietMillis: 400, stepDown: 2 }); // initialization
    ...
    // Derements current value by 2 and triggers the change event imediatelly
    $(element).numericfield('stepDown'); 
    
     // Decrements current value by 2 and triggers the change event obeying the quietMillis option
    $(element).numericfield('stepDown', true);
    
     // Decrements current value by 3 and triggers the change event imediatelly
    $(element).numericfield('stepDown', false, 3);
    
     // Decrements current value by 3 and triggers the change event obeying the quietMillis option
    $(element).numericfield('stepDown', true, 3);
    
###option(name, value)
Changes an option programatically

    $(element).numericfield({ realTimeChange: true, quietMillis: 400, stepDown: 2 }); // initialization
    ...
    // Sets the decimalPlaces options to 3
    $(element).numericfield('option', 'decimalPlaces', 3);
    
    // Sets the minValue options to 8
    $(element).numericfield('option', 'minValue', 8);
    
###destroy( )
Destroy the numericfield widget and returns the input to it's original behavior
    
    $(element).numericfield(); // initialization
    ...
    // Restore the input's original behavior
    $(element).numericfield("destroy");