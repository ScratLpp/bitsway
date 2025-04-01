"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "react-hot-toast"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [availableSlots, setAvailableSlots] = useState<{ time: string; label: string }[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (date) {
      setIsLoadingSlots(true)
      fetch(`/api/available-slots?date=${date.toISOString()}`)
        .then(res => res.json())
        .then(data => {
          setAvailableSlots(data.slots || [])
          setIsLoadingSlots(false)
        })
        .catch(error => {
          console.error('Error fetching available slots:', error)
          setIsLoadingSlots(false)
        })
    } else {
      setAvailableSlots([])
    }
  }, [date])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date || !time || !name || !email) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date.toISOString(),
          time,
          name,
          email,
          message,
          isVideo: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit booking')
      }

      toast.success('Votre demande a été envoyée ! Nous vous contacterons rapidement pour confirmer le rendez-vous.')
      
      // Reset form
      setDate(null)
      setTime('')
      setName('')
      setEmail('')
      setMessage('')
      
      // Close modal after delay
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prendre rendez-vous</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Date et Heure</Label>
            <div className="flex gap-4">
              <div className="flex-1 border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={fr}
                  className="rounded-md"
                />
              </div>
              <div className="flex-1 flex items-center">
                <Select 
                  value={time} 
                  onValueChange={setTime}
                  disabled={!date || isLoadingSlots}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingSlots ? "Chargement..." : "Choisir une heure"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <SelectItem key={slot.time} value={slot.time}>
                          {slot.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Aucun créneau disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Message (optionnel)</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sujet du rendez-vous..."
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <Video className="h-4 w-4" />
            <span>Le rendez-vous se déroulera en visioconférence. Nous vous enverrons le lien de la réunion quelques minutes avant le rendez-vous.</span>
          </div>

          <Button type="submit" className="w-full" disabled={status === "loading" || isSubmitting}>
            {status === "loading" ? "Envoi en cours..." : "Confirmer le rendez-vous"}
          </Button>

          {status === "success" && (
            <p className="text-sm text-green-600">Rendez-vous confirmé ! Vous recevrez un email avec le lien de la réunion.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">Une erreur est survenue. Veuillez réessayer.</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
} 