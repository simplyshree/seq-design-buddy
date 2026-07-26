import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GLOSSARY, useMock } from "@/lib/mock-state";

export function HelpDrawer() {
  const { helpOpen, setHelpOpen } = useMock();
  return (
    <Sheet open={helpOpen} onOpenChange={setHelpOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Help & Glossary</SheetTitle>
          <SheetDescription>Plain-language explanations for each step and term.</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Glossary</h3>
          <Accordion type="multiple" className="w-full">
            {GLOSSARY.map((g) => (
              <AccordionItem key={g.term} value={g.term}>
                <AccordionTrigger className="text-sm">{g.term}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{g.def}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}