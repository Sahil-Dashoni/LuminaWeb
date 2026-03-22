const extractJson = async (text) => {
    if (!text) return;
    const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = cleanedText.indexOf('{');
    const closeBrace = cleanedText.lastIndexOf('}');
    if (firstBrace === -1 || closeBrace === -1) return null;
    const jsonString = cleanedText.slice(firstBrace, closeBrace + 1);
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
    }
}

export default extractJson;