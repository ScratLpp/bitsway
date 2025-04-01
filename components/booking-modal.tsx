"use client"

import { useState } from "react"
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

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time || !name || !email) return

    setStatus("loading")

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date.toISOString(),
          time,
          name,
          email,
          message,
        }),
      })

      if (!response.ok) throw new Error("Erreur lors de la prise de rendez-vous")
      
      setStatus("success")
      // Réinitialiser le formulaire
      setDate(undefined)
      setTime("")
      setName("")
      setEmail("")
      setMessage("")
      
      // Fermer la modal après 2 secondes
      setTimeout(onClose, 2000)
    } catch (error) {
      setStatus("error")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Prendre rendez-vous</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Date et Heure</Label>
            <div className="flex flex-col gap-4">
              <div className="border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={fr}
                  className="rounded-md"
                />
              </div>
              <div>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  min="09:00"
                  max="18:00"
                />
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
            <span>Le rendez-vous se déroulera en visioconférence via Google Meet. Vous recevrez le lien quelques minutes avant le rendez-vous.</span>
          </div>

          <Button type="submit" className="w-full" disabled={status === "loading"}>
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