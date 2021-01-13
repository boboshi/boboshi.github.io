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
        // subscribe to topic "mup" to listen for published messages
        console.log("onConnect");
        this.client.subscribe("mup");
    }

    onConnectionLost(responseObject)
    {
        if (responseObject.errorCode !== 0)
            console.log("onConnectionLost: " + responseObject.errorMessage);
    }

    onMessageArrived(message)
    {
        var obj = JSON.parse(message.payloadString);
        console.log("onMessageArrived: ", obj);
    }

    SendMessage(str, dest)
    {
        // ignore actual destination for now, use "mup" for testing
        var message = new Paho.Message(str);
        message.destinationName = "mup";
        this.client.send(message);
    }
};