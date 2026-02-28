import React from 'react';
import { HelpCircle, Bug, Lightbulb, Mail, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Feedback } from '../types';

export const HelpFeedback: React.FC = () => {
  const [feedback, setFeedback] = React.useState<Feedback>({ type: 'bug', text: '', email: '' });
  const [submitted, setSubmitted] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedback);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFeedback({ type: 'bug', text: '', email: '' });
  };

  const faqs = [
    { q: "How do I restore deleted items?", a: "Go to the Trash section, find the item, and click 'Restore'. Items stay in trash for 30 days." },
    { q: "Can I change my password?", a: "Currently, password changes are handled through the account verification email sent during registration." },
    { q: "What is the storage limit?", a: "Free accounts have a 5GB storage limit. You can check your usage in the Settings page." }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-blue-500" />
        Help & Feedback
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Feedback Form */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5 text-slate-500" />
            Send Feedback
          </h3>
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFeedback({ ...feedback, type: 'bug' })}
                className={`flex-1 btn ${feedback.type === 'bug' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Bug className="w-4 h-4" />
                Report Bug
              </button>
              <button
                type="button"
                onClick={() => setFeedback({ ...feedback, type: 'feature' })}
                className={`flex-1 btn ${feedback.type === 'feature' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Lightbulb className="w-4 h-4" />
                Feature
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Email (Optional)</label>
              <input
                type="email"
                value={feedback.email}
                onChange={e => setFeedback({ ...feedback, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                required
                value={feedback.text}
                onChange={e => setFeedback({ ...feedback, text: e.target.value })}
                placeholder={feedback.type === 'bug' ? "Describe the bug..." : "Describe the feature request..."}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={submitted}>
              {submitted ? "Sent! Thank you." : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
          
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Mail className="w-4 h-4" />
            <span>Or contact us at support@example.com</span>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-500" />
            FAQ
          </h3>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-left font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {faq.q}
                  {openFaq === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFaq === index && (
                  <div className="p-4 pt-0 text-sm text-slate-500 border-t border-slate-50 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
