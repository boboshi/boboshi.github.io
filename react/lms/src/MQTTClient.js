import Paho from "paho-mqtt";

export default class MQTTClient
{
    constructor(addr, port, clientId)
    {
        this.client = new Paho.Client(addr, port, clientId);
        this.client.onConnectionLost = this.onConnectionLost;
        this.client.onMessageArrived = this.onMessageArrived;
        this.client.connect({onSuccess:this.onConnect.bind(this)});
    }

    onConnect()
    {
        console.log("onConnect");
        this.client.subscribe("World");
        var message = new Paho.Message("Hello");
        message.destinationName = "World";
        this.client.send(message);
    }

    onConnectionLost(responseObject)
    {
        if (responseObject.errorCode !== 0)
            console.log("onConnectionLost: " + responseObject.errorMessage);
    }

    onMessageArrived(message)
    {
        console.log("onMessageArrived: "+ message.payloadString);
    }
};