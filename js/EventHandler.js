/**
 * @description EventHandler
 * @version 2015.06.05
 * @author Vegard J (Vegard@MindEngineering.no)
 * @class
 */
function EventHandler()
{
    var THIS = this;

    /*---------------------------------------------------Privileged----------------------------------------------------*/

    /**#@+
     * @privileged
     */

    THIS.addListener = addListener;
    THIS.removeListener = removeListener;
    THIS.trigger = trigger;

    /**#@-*/

    /*-----------------------------------------------------Private-----------------------------------------------------*/

    /**#@+
     * @private
     */

    /** @type {Function} */
    var LISTENERS;

    /**
     * @description Adds a listener to the EventHandler
     * @param {Function} [listener]
     */
    function addListener(listener)
    {
        if (typeof LISTENERS == "undefined")
        {
            LISTENERS = [];
        }

        LISTENERS.push(listener);
    }

    /**
     * @description Removes a listener from the EventHandler
     * @param {Function} [listener]
     */
    function removeListener(listener)
    {
        if (LISTENERS instanceof Array)
        {
            for (var idx=0; idx < LISTENERS.length; idx++)
            {
                if (LISTENERS[idx] === listener)
                {
                    LISTENERS.splice(idx, 1);
                    break;
                }
            }
        }
    }

    /**
     * @description Triggers the Event
     */
    function trigger(err, param)
    {
        if (LISTENERS instanceof Array)
        {
            for (var idx = 0; idx < LISTENERS.length; idx++)
            {
                if (!(typeof param === 'undefined'))
                {
                    LISTENERS[idx](err, param);
                }
                else
                {
                    LISTENERS[idx](err);
                }
            }
        }
    }

    /**#@-*/
}