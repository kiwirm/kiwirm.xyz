import { marked } from 'marked';

export const markdownToHtml = async (markdown: string): Promise<string> => {
    return await marked.parse(markdown);
};