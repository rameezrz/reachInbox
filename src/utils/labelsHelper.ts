import { Label } from "../Types/gmail";

export const fetchExistingLabels = async (
  gmail: any
): Promise<{ [key: string]: string }> => {
  try {
    const res = await gmail.users.labels.list({ userId: "me" });
    const existingLabels = res.data.labels || [];
    return existingLabels.reduce(
      (acc: { [key: string]: string }, label: any) => {
        acc[label.name] = label.id;
        return acc;
      },
      {}
    );
  } catch (error) {
    console.error(`Error fetching existing labels:`, error);
    return {};
  }
};

export const createLabel = async (
  gmail: any,
  userId: string,
  label: Label
): Promise<string | null> => {
  try {
    const res = await gmail.users.labels.create({
      userId,
      requestBody: {
        name: label.name,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
        color: {
          backgroundColor: label.color.backgroundColor,
          textColor: label.color.textColor,
        },
      },
    });
    return res.data.id;
  } catch (error) {
    console.error(`Error creating label ${label.name}:`, error);
    return null;
  }
};

export const getLabelIds = (
  labelNames: string[],
  labelMap: { [key: string]: string }
): string[] => {
  return labelNames
    .map((name: string) => labelMap[name])
    .filter((id: string | undefined) => !!id);
};
