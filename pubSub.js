// This implementatin is Helpfull, where you are subscribing to data that needs no state menagement 
class pubSub {
    constructor(){
        // Initialize an empty object to hold subscribers for different events
        this.subscribers = [];
    }
    // Method to subscribe to an event with a callback function
    subscribe(callBack){
        // Add the callback function to the list of subscribers for the event
        this.subscribers.push(callBack);
    }
    // Method to publish an event with a payload
    publish(payload){
        // Call each subscriber's callback function with the payload
        this.subscribers.forEach(callBack => callBack(payload));
    }
    // Method to unsubscribe a callback function from an event
    unsubscribe(event, callBack){
        // If there are no subscribers for the event, return early
        if(!this.subscribers[event]){ return; }
        // Remove the callback function from the list of subscribers for the event
        this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callBack);
    }
    // Method to get the list of subscribers for all events
    getSubscribers(){
        return this.subscribers;
    }
}
// This implementatin is Helpfull, where you are subscribing to data that needs state menagement 
class dataStore {
    constructor(trackState = false, historyLength = 3){
        // Initialize properties for tracking state, history length, subscribers, etc.
        this.trackState = trackState;
        this.historyLength = historyLength;
        this.subscribers = [];
        this.subData = "";
        this.history = [];
        this.publishCount = 0;
        this.instanceId = this.hashGenerator(2, 7);
    }

    // Method to subscribe to data changes with a callback function
    subscribe(callBack){
        // Generate a unique subscriber ID
        let subscriberId = this.instanceId + '-' + this.hashGenerator(0, 8);
        // Add the callback function and subscriber ID to the list of subscribers
        this.subscribers.push({ cb: callBack, id: subscriberId });
        // Prepare the response data
        let res = { data: this.subData };
        // If tracking state, include the history in the response
        this.trackState && (res.history = this.history);
        // If there is existing data, call the callback function with the response
        (this.subData) && callBack(res);
    }

    // Method to publish new data
    publish(payload){
        // If this is not the first publish and tracking state, update the history
        if(this.publishCount > 0 && this.trackState){
            this.history.unshift(this.subData);
            (this.history.length > this.historyLength) && (this.history.length = this.historyLength);
        }
        // Update the current data with the new payload
        this.subData = payload;
        // If there are subscribers, notify them with the new data
        if(this.subscribers.length > 0){
            let res = { data: this.subData };
            this.trackState && (res.history = this.history);
            this.subscribers.forEach(sub => sub.cb(res));
        }
        // Increment the publish count
        this.publishCount++;
    }

    // Method to get the list of subscribers
    getSubscribers(){ return this.subscribers; }

    // Method to get the number of times data has been published
    getPublishCount(){ return this.publishCount; }

    // Method to generate a random hash string
    hashGenerator(s, e){ return Math.random().toString(36).substring(s, e); }

    // Method to get the current event data
    getEvent(){ return this.subData; }
}
// this implemenation is helpfull, where you are subscribing to data only once... for example on page load
class EventFactory {
    constructor(trackState = false, historyLength = 3){
        // Initialize properties for tracking state, history length, event data, etc.
        this.trackState = trackState;
        this.historyLength = historyLength;
        this.subData = "";
        this.history = [];
        this.publishCount = 0;
        this.instanceId = this.hashGenerator(2, 7);
        this.event = "";
    }

    // Method to subscribe to an event with a callback function
    subscribe(fn){
        // Generate a unique subscriber ID
        let subscriberId = this.instanceId + '-' + this.hashGenerator(0, 8);
        // Prepare the response data
        let res = { data: this.subData };
        // If tracking state, include the history in the response
        this.trackState && (res.history = this.history);
        // Return a promise that resolves with the response data
        return new Promise((resolve, reject) => {
            try{
                // Remove any existing event listener for the subscriber ID
                window.removeEventListener(this.instanceId, fn);
                resolve(res);
            }
            catch(error){ reject(error); }
        });
    }

    // Method to publish an event with data
    publish(EventData){
        // If no event data is provided, return the instance ID
        if(!EventData){
            return this.instanceId;
        } else {
            // Create a new custom event with the instance ID
            this.event = new CustomEvent(this.instanceId, {});
            // Update the current event data with the new data
            this.subData = EventData;
            // Dispatch the custom event
            window.dispatchEvent(this.event);
        }
    }

    // Method to get the instance ID
    getEFI(){
        return this.instanceId;
    }

    // Method to generate a random hash string
    hashGenerator(s, e){ return Math.random().toString(36).substring(s, e); }
}
    
