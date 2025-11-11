import App from "../modules/app"
import { ReifiedClient, Core, Client } from "reified-client-api"

declare const ZAFClient: { init: () => Client }
const client = new ReifiedClient(ZAFClient.init())

client.on(Core.Events.app.registered, () => {
    return new App(client)
})