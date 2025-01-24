import { atom } from "jotai";
import { Inputs } from "../types/input-form";

export const formState = atom<Inputs>({
  setList: 'kyu6List',
  shuffle: false,
  delay: 30,
})
