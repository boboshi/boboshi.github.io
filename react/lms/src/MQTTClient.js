import Paho from "paho-mqtt";
import LMSUtility from "./LMSUtility.js";

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
        console.log("MQTT connected");
        this.client.subscribe("mup");
    }

    onConnectionLost(responseObject)
    {
        if (responseObject.errorCode !== 0)
            console.log("Connection lost: " + responseObject.errorMessage);
    }

    onMessageArrived(message)
    {
        var obj = JSON.parse(message.payloadString);
        console.log("Message Arrived:: ", obj);
    }

    CreateMessage(sender, key, eventtype, commandtype)
    {
        var json = {SenderId: sender,
                    SensorID: "LightingSystem-AZTECH-YY-" + key,
                    EventId: "EV-YY-" + key + "-" + LMSUtility.Timestamp(),
                    EventType: "LightingSystem/" + eventtype,
                    Parameters: {CommandType: commandtype}};

        return json;
    }

    SendMessage(str, dest)
    {
        // ignore actual destination for now, use "mup" for testing
        var message = new Paho.Message(str);
        message.destinationName = "mup";
        this.client.send(message);
    }
};