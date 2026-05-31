import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is HR Connect?",
    answer: "HR Connect is an all-in-one enterprise Human Resource Management System (HRMS) designed to streamline employee management, recruitment, attendance tracking, and payroll integration."
  },
  {
    question: "How do I reset my password?",
    answer: "You can change your password by navigating to the Settings page from the sidebar. Under the Profile tab, you will find a section dedicated to updating your security credentials."
  },
  {
    question: "Can I customize the dashboard appearance?",
    answer: "Yes! HR Connect supports Dark Mode, Light Mode, and System Default synchronization. You can toggle these preferences in the Settings page under the Appearance tab."
  },
  {
    question: "How do I add a new employee to the system?",
    answer: "Only users with 'Admin' or 'Manager' roles can add new employees. Go to the Employees page and click the 'Add Employee' button at the top right corner. Fill in the required details and credentials to generate their account."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We employ industry-standard JWT authentication and TLS encryption to ensure that all personal information and company data remains strictly confidential and secure."
  },
  {
    question: "How does the attendance system work?",
    answer: "The attendance module allows employees to check in and check out using a QR code or manual entry, depending on company policy. Managers can then review these logs in real-time."
  }
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
      
      <div className="bg-card p-8 rounded-3xl shadow-sm border border-border/50 bg-gradient-to-br from-card to-muted/20 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Find answers to common questions about using the HR Connect platform.
        </p>
      </div>

      <div className="bg-card rounded-2xl p-6 md:p-8 border shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b-border/50">
              <AccordionTrigger className="text-left font-medium text-base hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-muted-foreground">
          Still have questions? Contact your IT department or system administrator for further assistance.
        </p>
      </div>

    </div>
  );
}
