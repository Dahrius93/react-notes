import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/ui/Button'
import { StarRating } from '@/shared/ui/StarRating'
import { Textarea } from '@/shared/ui/Textarea'

const reviewSchema = z.object({
  rating: z.number().int().min(1, { error: 'Dai almeno una stella' }).max(5),
  comment: z.string().trim().min(10, { error: 'Scrivi almeno 10 caratteri' }),
})

type Review = z.infer<typeof reviewSchema>

export function ReviewForm() {
  const [sent, setSent] = useState<Review | null>(null)
  const { control, register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  })

  if (sent) return <p>Grazie! Hai dato {sent.rating}/5: “{sent.comment}”</p>

  return (
    <form onSubmit={handleSubmit(setSent)} noValidate className="max-w-md space-y-4">
      {/* Native inputs: register. Custom controlled components: Controller */}
      <Controller
        name="rating"
        control={control}
        render={({ field, fieldState }) => (
          <StarRating
            label="Voto *"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={fieldState.error?.message}
          />
        )}
      />
      <Textarea label="Commento *" rows={3} {...register('comment')} error={errors.comment?.message} />
      <Button type="submit">Invia recensione</Button>
    </form>
  )
}
