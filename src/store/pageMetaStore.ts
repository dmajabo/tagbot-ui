import { defineStore } from 'pinia'
import {ref} from 'vue'

export const pageMetaStore = defineStore('pagemeta', () => {
    const title  = ref('')
    const description = ref('')
    function setPageMeta(pagemeta:any) {
        window.document.title = pagemeta.title
        // @ts-ignore
        window.document.getElementsByTagName('meta')['description'] = pagemeta.description
        title.value = pagemeta.title
        description.value = pagemeta.description
    }
    return {title, description, setPageMeta}
})

