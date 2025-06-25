import { ComponentProps } from "react";

export const components = {
  h1: (props: ComponentProps<"h1">) => (
    <h1 className="text-4xl font-bold my-6" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="text-3xl font-semibold my-5" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="text-2xl font-medium my-4" {...props} />
  ),
  h4: (props: ComponentProps<"h4">) => (
    <h4 className="text-xl font-medium my-3" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="text-base leading-relaxed mb-4" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="list-disc ml-6 mb-4" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="list-decimal ml-6 mb-4" {...props} />
  ),
  li: (props: ComponentProps<"li">) => <li className="mb-1" {...props} />,
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:text-gray-300 my-4"
      {...props}
    />
  ),
  code: (props: ComponentProps<"code">) => (
    <code
      className="bg-gray-200 dark:bg-gray-800 rounded px-1 py-0.5 text-sm"
      {...props}
    />
  ),
};
