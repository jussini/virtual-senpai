import { SetList } from "./input-form"
import { PracticeTechniqueList } from "./techniques"

export type PlayParams = { 
    list: PracticeTechniqueList
    shuffle: boolean
    delay: number
    listName: SetList
}