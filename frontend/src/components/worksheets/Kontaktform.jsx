import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  FileText,
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  position: "",
  location: "",
  message: "",
};

export default function Kontaktformular() {
  const [formData, setFormData] = useState(initialFormData);
  const [focusedField, setFocusedField] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "email") {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!validEmail.test(value)) {
        setEmailError("Email muss ein @ Zeichen enthalten");
      } else {
        setEmailError("");
      }
    }

    if (field === "message" && value.length > 50 && !showTip) {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 3000);
    }
  };

  const isFieldComplete = (field) => {
    const value = formData[field].trim();

    if (field === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }





    if (field === "phone") {
      const onlyDigits = value.replace(/\D/g, "");
      return onlyDigits.length >= 10;
    }

    if (field === "message") {
      return value.length >= 20;
    }

    return value.length >= 2;
  };

  const allFieldsComplete = Object.keys(formData).every((field) =>
    isFieldComplete(field)
  );

  const handleSubmit = () => {
    if (!allFieldsComplete) return;
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData(initialFormData);
  };

  const getFieldClass = (field) => {
    if (focusedField === field) {
      return "border-sky-500 ring-2 ring-sky-500/20";
    }

    if (isFieldComplete(field)) {
      return "border-lime-500 ring-1 ring-lime-500/20";
    }

    return "border-border";
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="overflow-hidden rounded-3xl border bg-background shadow-xl"
        >
          <Card className="border-0 shadow-none">
            <CardContent className="flex flex-col items-center space-y-6 p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
                className="flex h-24 w-24 items-center justify-center rounded-full bg-lime-500"
              >
                <CheckCircle2 className="h-12 w-12 text-white" />
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  Kontakt gespeichert!
                </h2>
                <p className="text-muted-foreground">
                  Deine Kontaktanfrage wurde erfolgreich erstellt. Du kannst nun
                  weitere Kontakte hinzufügen.
                </p>
              </div>

              <Button onClick={resetForm} size="lg" className="rounded-xl px-8">
                Neuer Kontakt
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <Card className="rounded-2xl border-sky-200 bg-gradient-to-r from-sky-500/10 to-blue-600/10 shadow-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-3xl">
              Arbeitsblatt: Kontaktformular
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Design-Typ: Kontaktform
          </CardDescription>
          <p className="text-sm text-muted-foreground">
            Erfasse wichtige Kontakte für deine Berufsorientierung
          </p>
        </CardHeader>
      </Card>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex items-center gap-3 rounded-xl border border-lime-300 bg-lime-300 px-5 py-4 text-slate-900 shadow"
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">
              Super! Je detaillierter, desto hilfreicher für später!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="overflow-hidden rounded-3xl shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-5 text-white">
          <h3 className="text-2xl font-bold">Neuer Kontakt</h3>
          <p className="mt-1 text-sm text-white/90">
            Speichere wichtige Personen für dein Netzwerk
          </p>
        </div>

        <CardContent className="space-y-6 p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-2"
          >
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4 text-blue-600" />
              Name
            </Label>
            <div className="relative">
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Vor- und Nachname"
                className={`h-12 rounded-xl pr-10 ${getFieldClass("name")}`}
              />
              {isFieldComplete("name") && (
                <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-lime-500" />
              )}
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Mail className="h-4 w-4 text-blue-600" />
                E-Mail
              </Label>
              <div className="relative">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="beispiel@email.de"
                  className={`h-12 rounded-xl pr-10 ${getFieldClass("email")}`}
                />

                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}

                {isFieldComplete("email") && (
                  <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-lime-500" />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Phone className="h-4 w-4 text-blue-600" />
                Telefon
              </Label>
              <div className="relative">
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="+49 123 456789"
                  className={`h-12 rounded-xl pr-10 ${getFieldClass("phone")}`}
                />
                {isFieldComplete("phone") && (
                  <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-lime-500" />
                )}
              </div>
            </motion.div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Firma/Organisation
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  onFocus={() => setFocusedField("company")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Firmenname"
                  className={`h-12 rounded-xl pr-10 ${getFieldClass("company")}`}
                />
                {isFieldComplete("company") && (
                  <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-lime-500" />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2"
            >
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-blue-600" />
                Position
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  onFocus={() => setFocusedField("position")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="z. B. Ausbildungsleiter"
                  className={`h-12 rounded-xl pr-10 ${getFieldClass("position")}`}
                />
                {isFieldComplete("position") && (
                  <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-lime-500" />
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-blue-600" />
              Standort
            </Label>
            <div className="relative">
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                onFocus={() => setFocusedField("location")}
                onBlur={() => setFocusedField(null)}
                placeholder="Stadt oder Adresse"
                className={`h-12 rounded-xl pr-10 ${getFieldClass("location")}`}
              />
              {isFieldComplete("location") && (
                <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-lime-500" />
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-2"
          >
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-blue-600" />
              Notizen
            </Label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              placeholder="Warum ist dieser Kontakt wichtig? Was hast du besprochen?"
              rows={5}
              className={`resize-none rounded-xl ${getFieldClass("message")}`}
            />
          </motion.div>

          <Button
            onClick={handleSubmit}
            disabled={!allFieldsComplete}
            size="lg"
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            <Send className="mr-2 h-5 w-5" />
            {allFieldsComplete ? "Kontakt speichern" : "Alle Felder ausfüllen"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}