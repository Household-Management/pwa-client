import {ItemDataInput, PantryItemInput, PantryItemModel} from "./PantryStateConfiguration.ts";

export default class PantryItemProxy implements ItemDataInput, PantryItemInput {
    private proxy: any;

    [index: string]: any;

    static proxy(target: PantryItemModel | undefined) {
        return new PantryItemProxy(target).proxy;
    }

    constructor(target: PantryItemModel | undefined) {
        this.proxy = new Proxy(target || {}, {
            get: (obj: any, prop) => {
                if (prop === "name") {
                    return obj.item?.name;
                }
                if (prop === "id") {
                    return obj.item?.id;
                }
                if (prop === "nutrition") {
                    return obj.item?.nutrition;
                }
                if (prop === "location") {
                    return obj.state?.location;
                }
                if (prop === "quantity") {
                    return obj.state?.quantity;
                }
                return obj[prop as keyof PantryItemModel];
            },
            set: (obj, prop, value) => {
                if(obj.item) {
                    if (prop === "name") {
                        obj.item.name = value;
                        return true;
                    }
                    if (prop === "id") {
                        obj.item.id = value;
                        return true;
                    }
                    if (prop === "nutrition") {
                        obj.item.nutrition = value;
                        return true;
                    }
                }
                if(obj.state) {
                    if (prop === "location") {
                        obj.state.location = value;
                        return true;
                    }
                    if (prop === "quantity") {
                        obj.state.quantity = value;
                        return true;
                    }
                }
                obj[prop as keyof PantryItemModel] = value;
                return true;
            },
        });
    }

    public get name() {
        return this.proxy.item.name;
    }

    public get expiration() {
        return this.proxy.state.expiration;
    }

    public get quantity() {
        return this.proxy.state.quantity;
    }
}