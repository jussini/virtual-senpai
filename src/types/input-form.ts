import { z } from 'zod'

export const SetListSchema = z.enum([
  'kyu6List',
  'kyu5List',
  'kyu4List',
  'kyu3List',
  'kyu2List',
  'kyu1List',
  'kyu1List2007',
  'kyu2List2007',
  'kyu3List2007',
  'kyu4List2007',
  'kyu5List2007',
  'kyu6List2007',
  'all',
])

export type SetList = z.infer<typeof SetListSchema>

export const InputsSchema = z.object({
  setList: SetListSchema,
  shuffle: z.coerce.boolean(),
  delay: z.coerce
    .number()
    .gt(0, { message: 'Kesto on oltava suurempi kuin 0' }),
  techset: z.optional(
    z.string().array().min(1, { message: 'Valitse ainakin yksi tekniikka' })
  ),
})

export type Inputs = z.infer<typeof InputsSchema>
