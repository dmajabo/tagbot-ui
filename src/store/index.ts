import { userStore } from './userStore'
import { pageMetaStore } from './pageMetaStore'
import { useLayoutStore } from './layoutStore'

export const stores = () => {
    return {
        auth: userStore(),
        pagemeta: pageMetaStore(),
        useLayoutStore: useLayoutStore()
    }
}
