const fs = require('fs');
let input = fs.readFileSync('src/app/(root)/conversations/[conversationId]/_components/ChatInput.tsx', 'utf8');

input = input.replace(
  /className=\{cn\([\s\S]*?"flex items-end gap-2 p-3 border-t bg-background\/95 backdrop-blur supports-\[backdrop-filter\]:bg-background\/60 transition-all duration-200",[\s\S]*?isFocused && "border-primary\/20 bg-background",\s*\)\}/,
  'className={cn(\n          "flex items-end gap-2 p-4 border-t-[3px] border-dashed border-border bg-white transition-all duration-200"\n        )}'
);

input = input.replace(
  /className=\{cn\([\s\S]*?"min-h-\[40px\] max-h-\[120px\] resize-none rounded-2xl border-0 bg-muted\/50 px-4 py-2 pr-12 text-sm leading-6 placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary\/50 focus-visible:bg-background transition-all duration-200",[\s\S]*?isLoading && "opacity-50",\s*\)\}/,
  'className={cn(\n                "min-h-[40px] max-h-[120px] resize-none border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] bg-white px-4 py-2 pr-12 text-lg leading-6 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus:translate-x-1 focus:translate-y-1 focus:shadow-[2px_2px_0_0_#2d2d2d] transition-all duration-200 font-[family-name:var(--font-patrick-hand)]",\n                isLoading && "opacity-50",\n              )} style={{ borderRadius: "var(--radius-wobbly)" }}'
);

fs.writeFileSync('src/app/(root)/conversations/[conversationId]/_components/ChatInput.tsx', input);
