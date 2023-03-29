import { EffectorObject } from "../game-objects/EffectorObject";

export class AjaxRequestSender{
    public static sendRequestToggleLampAndPlug(lampEffectorObject: EffectorObject, OH_ID : string, nameStateOff: string){
        $.ajax({
            headers: {
                Accept: "*/*",
            },
            crossDomain: true,
            type: 'GET',
            url: 'http://localhost:8080/rest/items/'+OH_ID+'?recursive=false',
            success: function (json_response) {
                $.ajax({
                    headers: {
                        Accept: "*/*",
                    },
                    type: 'POST',
                    crossDomain: true,
                    url: 'http://localhost:8080/rest/items/'+OH_ID,
                    contentType: 'text/plain',
                    data: (json_response["state"] == nameStateOff ? "ON" : "OFF"),
                    success: function () {
                        if (json_response["state"] == nameStateOff && lampEffectorObject != null)
                            lampEffectorObject.getTextObject().setText("ON")
                        if (json_response["state"] != nameStateOff && lampEffectorObject != null)
                            lampEffectorObject.getTextObject().setText("OFF")
                    }
                });
            }
        })
    }

    public static updateTextWithStateObject(lampEffectorObject: EffectorObject, OH_ID : string, nameStateOff: string, textOff : string, textOn : string){
        $.ajax({
            headers: {
                Accept: "*/*",
            },
            crossDomain: true,
            type: 'GET',
            url: 'http://localhost:8080/rest/items/'+OH_ID+'?recursive=false',
            success: function (json_response) {
                if (json_response["state"] == nameStateOff && lampEffectorObject != null)
                    lampEffectorObject.getTextObject().setText(textOff)
                if (json_response["state"] != nameStateOff && lampEffectorObject != null)
                    lampEffectorObject.getTextObject().setText(textOn)
            }
        })
    }

    public static postStateObject(OH_ID : string, state: string){
        return $.ajax({
            headers: {
                Accept: "*/*",
            },
            crossDomain: true,
            type: 'POST',
            url: 'http://localhost:8080/rest/items/'+OH_ID,
            contentType: 'text/plain',
            data: state,
            success: function (json_response) {
                console.log("change color")
            }
        })
    }



    public static getStateObject(OH_ID : string){
    return new Promise((resolve, reject) => {
        $.ajax({
            headers: {
                Accept: "*/*",
            },
            crossDomain: true,
            type: 'GET',
            url: 'http://localhost:8080/rest/items/'+OH_ID+'?recursive=false',
            success: function (json_response) {
                resolve(json_response["state"]);
            },
            error: function (error) {
                reject(error);
            },
        })
    })
}

}

