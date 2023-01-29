import {userStore} from "./userStore"
import {pageMetaStore} from "./pageMetaStore"

export const stores = () => {
    return {
        auth: userStore(),
        pagemeta: pageMetaStore(),
    }
}
