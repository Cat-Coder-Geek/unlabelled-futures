import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM = `You are ECHO ("Every Concern Has a Voice"), the supportive assistant of UNLABELLED, a Dubai-based initiative on gender equality in education (UN SDG 4 and SDG 5).
Answer questions about gender equality, educational stereotypes, SDG 4 and SDG 5. Explain how to report discrimination (the Speak Up report form on this site, school leadership, KHDA for Dubai private schools). Help users prepare a clear complaint.
Be warm, non-judgmental and never blame or dismiss the user. Do not invent statistics; say when you are unsure. You are not a counsellor or emergency service.
If someone is in immediate danger, tell them to call Dubai Police 999 or Ambulance 998. Keep answers concise and use markdown.`;

export const echoChat = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: Msg[] }) => ({
    messages: input.messages.slice(-20).map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) })),
  }))
  .handler(async ({ data }) => {
    const { generateResponse } = await import("@lovable.dev/ai-gateway");
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions: SYSTEM,
        input: data.messages.map((m) => ({ role: m.role, content: m.content })),
      });
      const text = (res.output ?? [])
        .flatMap((o) => (o.type === "message" ? o.content : []))
        .map((c) => (c.type === "output_text" ? c.text : ""))
        .join("");
      return { ok: true as const, text: text || "I'm sorry, I couldn't form a reply. Please try again." };
    } catch (e) {
      console.error(e);
      return { ok: false as const, text: "ECHO is temporarily unavailable. You can still submit a report using the form." };
    }
  });
