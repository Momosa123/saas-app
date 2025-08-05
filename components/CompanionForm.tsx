"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subjects } from "@/constants";
import { createCompanion } from "@/lib/actions/companion.actions";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "AI Tutor name is required." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  topic: z.string().min(1, { message: "Topic is required." }),
  voice: z.string().min(1, { message: "Voice is required." }),
  style: z.string().min(1, { message: "Style is required." }),
  tutorType: z.string().min(1, { message: "Tutor type is required." }),
  duration: z.coerce.number().min(1, { message: "Duration is required." }),
});

const CompanionForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      tutorType: "conversation",
      duration: 15,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const companion = await createCompanion(values);

    if (companion) {
      redirect(`/tutors/${companion.id}`);
    } else {
      console.log("Failed to create an AI tutor");
      redirect("/");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>🤖 AI Tutor Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your AI tutor name (e.g., Alex the Conversation Coach)"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormDescription>
                Choose a friendly name for your AI tutor
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tutorType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>🎯 Tutor Specialization</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="input">
                    <SelectValue placeholder="Select tutor specialization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="conversation">
                    💬 Conversation Practice
                  </SelectItem>
                  <SelectItem value="grammar">📝 Grammar Expert</SelectItem>
                  <SelectItem value="pronunciation">
                    🗣️ Pronunciation Coach
                  </SelectItem>
                  <SelectItem value="business">💼 Business English</SelectItem>
                  <SelectItem value="beginner">🌱 Beginner Friendly</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of English learning experience you want
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>📚 Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="input">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>🎯 Topic</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter specific topic (e.g., Job Interview Practice, Travel Conversations)"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormDescription>
                What specific area do you want to practice?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>🎤 Voice</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="input">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                  <SelectItem value="echo">Echo (Male)</SelectItem>
                  <SelectItem value="fable">Fable (British)</SelectItem>
                  <SelectItem value="onyx">Onyx (Deep)</SelectItem>
                  <SelectItem value="nova">Nova (Friendly)</SelectItem>
                  <SelectItem value="shimmer">Shimmer (Soft)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>🎭 Personality Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="input">
                    <SelectValue placeholder="Select personality style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="encouraging">
                    😊 Encouraging & Supportive
                  </SelectItem>
                  <SelectItem value="professional">
                    💼 Professional & Formal
                  </SelectItem>
                  <SelectItem value="casual">😎 Casual & Friendly</SelectItem>
                  <SelectItem value="patient">
                    🧘 Patient & Understanding
                  </SelectItem>
                  <SelectItem value="energetic">
                    ⚡ Energetic & Motivating
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>⏱️ Session Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="15"
                  min="5"
                  max="60"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormDescription>
                How long should each practice session last? (5-60 minutes)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="btn-primary w-full">
          🚀 Create AI Tutor
        </Button>
      </form>
    </Form>
  );
};

export default CompanionForm;
