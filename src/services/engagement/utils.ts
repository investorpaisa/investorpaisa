
export const formatMentions = (content: string): string => {
  // Simple regex to identify @mentions
  return content.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
};

export const extractMentions = (content: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};
