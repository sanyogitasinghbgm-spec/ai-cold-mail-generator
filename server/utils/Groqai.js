const Groq = require('groq-sdk');

/**
 * Generates an email campaign (Subject, Body, LinkedIn DM, and Follow-Up) using Groq.
 * 
 * @param {string} prompt - User request/goal description
 * @param {string} tone - Tone of the email (e.g., Professional, Casual, Persuasive)
 * @param {string} targetAudience - Target recipient (e.g., Recruiter, Engineering Lead)
 * @returns {Promise<Object>} - Object containing { subject, body, linkedinDm, followUp }
 */
const generateCampaign = async (prompt, tone, targetAudience) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not defined in the environment variables.');
  }

  const groq = new Groq({ apiKey });

  const systemPrompt = `You are a world-class cold outreach copywriter and sales conversion specialist.
Your goal is to generate high-converting, hyper-personalized cold outreach sequences.
Every email must hook the reader, present a single clear value proposition, avoid generic clichés, and end with a low-friction Call to Action (CTA).
Always write highly custom templates based on the specific prompt details. Use natural, conversational language appropriate for the tone.

You must respond with a JSON object containing exactly these keys:
1. "subject": A click-worthy, short (under 7 words), and intriguing email subject line.
2. "body": The main cold email body text. Use placeholders like [Recipient Name], [Company Name], and [Your Name] where appropriate. Focus on value prop. Split the body into at least 2 distinct, readable paragraphs using double line breaks (\n\n): Paragraph 1 should hook the reader and state the value proposition, and Paragraph 2 should state the low-friction Call to Action (CTA). Keep the total word count under 180 words, and always include a professional closing sign-off (e.g., "Best regards,\n\n[Your Name]").
3. "linkedinDm": A short LinkedIn direct message connect note. It MUST be under 300 characters, conversational, and direct.
4. "followUp": A brief, polite follow-up email template referencing the initial email, keep it under 80 words.

Your response must be a single valid JSON object. Do not include any preamble, explanations, markdown code blocks, or markdown backticks outside of the JSON structure.`;

  const userPrompt = `Generate a personalized multi-channel cold outreach campaign based on the following input:

Outreach Goal/Prompt: "${prompt}"
Tone Style: "${tone}"
Target Recipient: "${targetAudience}"

Write highly custom, compelling copy matching the context above. Output strictly as JSON.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const responseText = chatCompletion.choices[0].message.content.trim();
    const campaign = JSON.parse(responseText);

    // Validate structure
    if (!campaign.subject || !campaign.body || !campaign.linkedinDm || !campaign.followUp) {
      throw new Error('Incomplete JSON response from Groq');
    }

    return {
      subject: campaign.subject,
      body: campaign.body,
      linkedinDm: campaign.linkedinDm,
      followUp: campaign.followUp,
    };
  } catch (error) {
    console.error('Error generating campaign with Groq:', error.message);
    
    // Smart dynamic fallback to prevent generic static output when API key fails
    let company = "your company";
    const companyMatch = prompt.match(/at\s+([A-Z][a-zA-Z0-9]+)/i);
    if (companyMatch) {
      company = companyMatch[1];
    } else {
      const companyMatch2 = prompt.match(/to\s+([A-Z][a-zA-Z0-9]+)/i);
      if (companyMatch2) company = companyMatch2[1];
    }

    let role = "Outreach Specialist";
    if (prompt.toLowerCase().includes("react")) role = "React Developer";
    else if (prompt.toLowerCase().includes("node")) role = "Node.js Developer";
    else if (prompt.toLowerCase().includes("full-stack") || prompt.toLowerCase().includes("fullstack")) role = "Full-Stack Engineer";
    else if (prompt.toLowerCase().includes("product")) role = "Product Manager";
    else if (prompt.toLowerCase().includes("design")) role = "UI/UX Designer";

    let skill = "collaboration opportunities";
    if (prompt.toLowerCase().includes("react")) skill = "React & frontend optimization";
    else if (prompt.toLowerCase().includes("node")) skill = "Node.js API architecture";
    else if (prompt.toLowerCase().includes("full-stack") || prompt.toLowerCase().includes("fullstack")) skill = "full-stack development and migration";

    let subject = `Collaboration inquiry: ${role} solutions for ${company}`;
    let body = `Hi [Recipient Name],\n\nI hope this email finds you well.\n\nI saw that you are scaling operations at ${company}, particularly on workflows that align with ${skill}. As a ${role}, I wanted to connect.\n\nI specialize in helping teams streamline their architecture and launch high-impact product features. I'm confident I could provide similar value to your upcoming projects.\n\nWould you be open to a quick 10-minute introductory call next Tuesday or Thursday afternoon?\n\nBest regards,\n\n[Your Name]`;

    if (tone === 'Persuasive') {
      subject = `Quick question regarding ${company}'s development roadmap`;
      body = `Hi [Recipient Name],\n\nI've been following ${company}'s milestones and noticed your recent scaling goals.\n\nAs a ${role} specializing in ${skill}, I help teams accelerate development velocity and optimize product performance. I've previously helped similar companies scale key features under tight deadlines.\n\nI'd love to share some insights that might help ${company}. Do you have 10 minutes for a quick chat next week?\n\nBest,\n\n[Your Name]`;
    } else if (tone === 'Casual') {
      subject = `Intro: [Your Name] + ${company}`;
      body = `Hi [Recipient Name],\n\nHope you're having a great week.\n\nJust came across what you're building at ${company} and wanted to reach out. I'm a ${role} working on ${skill}, and I thought it would be great to connect.\n\nLet me know if you're free for a quick 10-minute virtual coffee sometime next week.\n\nCheers,\n\n[Your Name]`;
    }

    const linkedinDm = `Hi [Recipient Name]! Impressed by your work at ${company}. I work as a ${role} focusing on ${skill} and wanted to connect to exchange insights. Cheers!`;
    const followUp = `Hi [Recipient Name],\n\nFollowing up on my previous message regarding joining forces for ${company}'s ${role} needs. I know you're busy, but I'd love to jump on a short call next week if you're open to it.\n\nBest,\n\n[Your Name]`;

    return { subject, body, linkedinDm, followUp };
  }
};

module.exports = { generateCampaign };
