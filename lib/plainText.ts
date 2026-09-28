export const plainText = (htmlString: string): string => {
  if (!htmlString) return "";
  return htmlString
    .replace(/<[^>]*>/g, "") // Removes all HTML tags
    .replace(/&nbsp;/g, " ") // Replaces non-breaking spaces
    .trim(); // Cleans up whitespace at ends
};
